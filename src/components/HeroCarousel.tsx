"use client"
import Image from "next/image";
import { Carousel } from "react-responsive-carousel"
import "react-responsive-carousel/lib/styles/carousel.min.css";

const heroImgs = [
    {imgurl:"/assets/images/hero-1.svg",alt:"smartwatch"},
    {imgurl:"/assets/images/hero-2.svg",alt:"bag"},
    {imgurl:"/assets/images/hero-3.svg",alt:"lamp"},
    {imgurl:"/assets/images/hero-4.svg",alt:"air fryer"},
    {imgurl:"/assets/images/hero-5.svg",alt:"chair"},

]
const HeroCarousel = () => {
    return (
        <div className="hero-carousel">
        <Carousel showThumbs={false}
        autoPlay
        showStatus={false}
        showArrows={false}
        interval={1000}
        >
            {heroImgs.map(image=>(
                <Image
                key={image.alt}
                alt={image.alt}
                src={image.imgurl}
                width={720}
                height={720}
                className="object-contain"
                />
            ))}
        </Carousel>
        <Image
        src="/assets/icons/hand-drawn-arrow.svg"
        alt="arrow"
        width={175}
        height={175}
        className="max-xl:hidden absolute -left-[15%] bottom-0 "
        />
        </div>
    )
}

export default HeroCarousel