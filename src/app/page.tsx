import HeroCarousel from '@/components/HeroCarousel'
import SearchBar from '@/components/SearchBar'
import { getAllProducts } from '@/lib/actions'
import Image from 'next/image'
import React from 'react'
import { ProductT } from '../../types'
import ProductCard from '@/components/ProductCard'

export const revalidate = 60
const Home = async () => {
  const allProducts = await getAllProducts()

  return (
    <>
      <section className='px-6 border-red-500 border-2
    md:px-20 py-24'>
        <div className='flex max-xl:flex-col gap-16'>
          <div className='flex flex-col justify-center'>
            <p className='small-text'>
              Smart Shopping Starts Here:
              <Image
                alt="arrow-right"
                src="/assets/icons/arrow-right.svg"
                width={16}
                height={16}
              />
            </p>
            <h1 className='head-text'>
              Unleash the power of
              <span className='text-primary'> PriceWise</span>
            </h1>
            <p className='mt-6'>
              Powerful, self-serve product and growth
              analytics to help you convert, engage, and retain more.
            </p>
            <SearchBar />
          </div>
          <HeroCarousel />
        </div>
      </section>
      <section className='trending-section'>
        <h2 className="section-text">Trending</h2>
        <div className="flex flex-wrap gap-x-8 gap-y-16">
          {allProducts?.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </>
  )
}

export default Home