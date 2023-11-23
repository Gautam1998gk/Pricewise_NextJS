import axios from "axios"
import * as cheerio from 'cheerio';
import { extractDescription, extractPrice, extractCurrency } from "../utils";
import { ProductT } from "../../../types";

export async function scrapeAmazonProduct(url:string){
   //curl --proxy brd.superproxy.io:22225 --proxy-user brd-customer-hl_26ce9bd4-zone-unblocker:qdqxpwt6yw2v -k https://lumtest.com/myip.json
  // const reviews:any = [];
    const username  = String(process.env.BRIGHT_DATA_USERNAME)
   const password  = String(process.env.BRIGHT_DATA_PASSWORD)
    const port =22225
    const session_id=(1000000*Math.random()) | 0

    const  options = {
        auth:{
            username:`${username}-session-${session_id}`,
            password
        },
        host:"brd.superproxy.io",
        port,
        rejectUnauthorized:false
    }

    try {
        const response = await axios.get(url,options)
        //console.log(response.data)
        const $ =cheerio.load(response.data)
        const title = $(`#productTitle`).text().trim()
        //const stars = $(`.a-declarative span.a-size-base.a-color-base`).text().trim()
       const currentPrice=extractPrice(
          $(`.priceToPay span.a-price-whole`),
          $(`.apexPriceToPay span.a-offscreen`),
          $(`.a-size-large.a-color-price`),
          $(`.a-button-selected .a-color-base`)
        )
       const originalPrice=extractPrice(
          $(`.a-price.a-text-price span.a-offscreen`),
          $(`#priceblock_ourprice`),
          $(`.a-size-base.a-color-price`),
          $(`#listPrice`),
          $(`#priceblock_dealprice`)
        )
        const outOfStock = $('#availability span').text().trim().toLowerCase() === 'currently unavailable';
        const images = 
        $('#imgBlkFront').attr('data-a-dynamic-image') || 
        $('#landingImage').attr('data-a-dynamic-image') ||
        '{}'

        const imageUrls = Object.keys(JSON.parse(images))
        const discountRate = $('.savingsPercentage').text().replace(/[-%]/g, "");
        const currency =extractCurrency( $(".a-price-symbol"))
        const description:any = extractDescription($)

        const data:ProductT = {
          url,
          currency:currency || "$",
          title,
          image:imageUrls[0],
          currentPrice:Number(currentPrice) || Number(originalPrice),
          originalPrice:Number(originalPrice) || Number(currentPrice),
          priceHistory:[],
          discountRate:Number(discountRate),
          category:"category",
          isOutOfStock:outOfStock,
          stars:4.5,
          reviewsCount:100,
          description,
          lowestPrice: Number(currentPrice) || Number(originalPrice),
          highestPrice: Number(originalPrice) || Number(currentPrice),
          averagePrice: Number(currentPrice) || Number(originalPrice),
        }
       // console.log(data)
       /*  const title = $(`.a-section.review.aok-relative`).each((index, element) => {
            const reviewer = $(element).find('.a-profile-content').text();
            const rating = parseFloat($(element).find('.a-icon-alt').text());
            const dateF =new Date( $(element).find('.review-date').text());
            const reviewDateText  = $(element).find('.review-date').text();
            const comments = $(element).find('span[data-hook="review-body"]').text().trim();
            const title = $(element).find('a[data-hook="review-title"] > span').text().trim();
            const date = dateF.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
              });
            const country = reviewDateText.replace(/^Reviewed in (.+?) on .+$/, '$1');
            const review = {
              reviewer,
              rating,
              date,
              country,
              comments,
              title
            };
          
            reviews.push(review);
          });
          console.log(reviews) */
      return data
        
    } catch (error:any) {
        throw new Error(`failed`)
    }
}


