import { getProductById, getSimilarProducts } from "@/lib/actions";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ProductT } from "../../../../types";
import { formatNumber } from "@/lib/utils";
import PriceInfoCard from "@/components/PriceInfoCard";
import ProductCard from "@/components/ProductCard";
import Modal from "@/components/Modal";

const ProductDetails = async ({ params }: { params: { id: string } }) => {
  const product: ProductT = await getProductById(params.id);
 const similarProducts=await getSimilarProducts(params.id)
  if (!product) return redirect("/");
//console.log(product);

  return (
    <div className="product-container">
      <div className="flex gap-28 xl:flex-row flex-col">
        <div className="product-image">
          <Image
            src={product.image}
            alt={product.title}
            width={580}
            height={400}
            className="mx-auto"
          />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-start flex-wrap pb-6">
            <div className="flex flex-col gap-3">
              <p className="text-[28px] font-semibold text-secondary">
                {product.title}
              </p>
              <Link
                href={product.url}
                target="_blank"
                className="text-base text-black opacity-50"
              >
                Visit Link
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Image
                src="/assets/icons/red-heart.svg"
                width={20}
                height={20}
                alt="heart"
              />
              <p className="text-base font-semibold text-red-400">
                {product.reviewsCount}
              </p>
              <div className="p-2bg-white-200-rounded-10">
                <Image
                  src="/assets/icons/bookmark.svg"
                  alt="bookmark"
                  width={20}
                  height={20}
                />
              </div>
              <div className="p-2bg-white-200-rounded-10">
                <Image
                  src="/assets/icons/share.svg"
                  alt="share"
                  width={20}
                  height={20}
                />
              </div>
            </div>
          </div>
          <div className="product-info">
            <div className="flex flex-col gap-2">
              <p className="text-[34px] text-secondary font-bold">
                {product.currency}
                {formatNumber(product.currentPrice)}
              </p>
              <p className="text-[21px] text-black opacity-50 line-through">
                {product.currency}
                {formatNumber(product.originalPrice)}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-3">
                <div className="product-stars">
                  <Image
                    src="/assets/icons/star.svg"
                    alt="star"
                    width={16}
                    height={16}
                  />
                  <p className="text-sm font-bold">{product.stars || 4}</p>
                </div>
                <div className="product-reviews">
                  <Image
                    width={16}
                    height={16}
                    src="/assets/icons/comment.svg"
                    alt="comment"
                  />
                  <p className="text-sm text-secondary font-semibold">
                    {product.reviewsCount}
                  </p>
                </div>
              </div>
              <p className="text-sm text-black opacity-50">
                <span className="text-primary-green font-semibold">93%</span> of
                buyershave recomened this
              </p>
            </div>
          </div>
          <div className="my-7 flex flex-col gap-5">
            <div className="flex gap-5 flex-wrap">
              <PriceInfoCard
                title="Current Price"
                iconSrc="/assets/icons/price-tag.svg"
                value={`${product.currency}${formatNumber(
                  product.currentPrice
                )}`}
                borderColor="#b6dbff"
              />
              <PriceInfoCard
                title="Average Price"
                iconSrc="/assets/icons/chart.svg"
                value={`${product.currency}${formatNumber(
                  product.averagePrice
                )}`}
                borderColor="#b6dbff"
              />
              <PriceInfoCard
                title="highest Price"
                iconSrc="/assets/icons/arrow-up.svg"
                value={`${product.currency}${formatNumber(
                  product.highestPrice
                )}`}
                borderColor="#b6dbff"
              />
              <PriceInfoCard
                title="lowest Price"
                iconSrc="/assets/icons/arrow-down.svg"
                value={`${product.currency}${formatNumber(
                  product.lowestPrice
                )}`}
                borderColor="#beffc5"
              />
            </div>
          </div>
                  <Modal productId={params.id}/>
        </div>
      </div>
      <div className="flex flex-col gap-16 ">
        <div className="flex flex-col gap-5"><h1 className="text-2xl font-semibold text-secondary">Product description</h1>
                  <div className="flex flex-col gap-4">
                    {product.description.split("\n")}
                  </div>
        </div>
        <button className="btn min-w-[200px] w-fit mx-auto flex items-center justify-center gap-3"  >
          <Image src="/assets/icons/bag.svg" alt="check" width={22} height={22}/>
         <Link href="/" className="text-base text-white">Buy Now</Link>
        </button>
      </div>
      {similarProducts&&similarProducts?.length>0&& (
        <div className="py-14 flex flex-col gap-2 w-full">
          <p className="section-text">Similar Products</p>
          <div className="flex flex-wrap w-full gap-10 mt-7">
            {similarProducts.map(product=>(
              <ProductCard key={product._id} product={product}  />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
