import { Product } from "@/lib/models/product.model";
import { connectToDB } from "@/lib/mongoose";
import { ProductT } from "../../../../types";
import { scrapeAmazonProduct } from "@/lib/scraper";
import {
  getAveragePrice,
  getEmailNotifType,
  getHighestPrice,
  getLowestPrice,
} from "@/lib/utils";
import { generateEmailBody, sendEmail } from "@/lib/nodeMailer";
import { NextResponse } from "next/server";

export const maxDuration = 5
export const dynamic = "force-dynamic"
export const revalidate = 0


export async function GET() {
  try {
    connectToDB();
    const products = await Product.find({});
    if (!products) throw new Error("No products found");

    const updateProducts = await Promise.all(
      products.map(async (product: ProductT) => {
        const scrapedProduct = await scrapeAmazonProduct(product.url);
        if (!scrapedProduct) throw new Error("No products found");

        const updatedPriceHistory = [
          ...product.priceHistory,
          { price: scrapedProduct.currentPrice },
        ];
        const upProduct = {
          ...scrapedProduct,
          priceHistory: updatedPriceHistory,
          lowestPrice: getLowestPrice(updatedPriceHistory),
          highestPrice: getHighestPrice(updatedPriceHistory),
          averagePrice: getAveragePrice(updatedPriceHistory),
        };

        const updateProduct= await Product.findByIdAndUpdate(
          { _id: product._id },
          upProduct
        );

        const emailNotifType = getEmailNotifType(scrapedProduct, product);
        if(emailNotifType && updateProduct.users.length){
            const productInfo ={
                title:updateProduct.title,
                url:updateProduct.url,
            }
            const emailContent =await generateEmailBody(productInfo,emailNotifType)
            const userEmails =await updateProduct.users.map((user:any)=>user.email)
            await sendEmail(emailContent,userEmails)
        }

        return updateProduct
      })
    );
    return NextResponse.json({message:"ok",body:updateProducts})
  } catch (error: any) {
    throw new Error("Error in Get", error);
  }
}
