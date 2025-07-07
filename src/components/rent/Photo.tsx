/* eslint-disable */
import React, { FC } from 'react'
import { BlurFade } from '../magicui/blur-fade'

const Photo: FC<{ images: string[], nextSlide: () => void, currentSlideIndex: number }> = ({ currentSlideIndex, images, nextSlide }) => {
    return (
        <div className="flex-grow order-1 2xl:w-9/12 w-full md:order-2">
            <div className="flex flex-col lg:flex-row gap-2 mt-4">
                <div className="flex flex-col gap-2 w-full lg:w-[400px] order-2 lg:order-1">
                    <BlurFade className="w-full h-[208px] overflow-hidden rounded-lg">
                        <img
                            src={images[1] || " "}
                            alt=" "
                            className="w-full h-full object-cover bg-secondary-light2 rounded-[32px]"
                        />
                    </BlurFade>
                    <BlurFade className="w-full h-[204px] overflow-hidden rounded-lg relative">
                        <img
                            src={images[2] || " "}
                            alt=" "
                            className="w-full h-full object-cover bg-secondary-light2 rounded-[32px]"
                        />
                    </BlurFade>
                </div>

                <div className="h-[410px] overflow-hidden rounded-lg relative flex-grow order-1 lg:order-2">
                    <div className="relative w-full h-full">
                        {images.map((image, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 transition-opacity duration-500 ${index === currentSlideIndex ? "opacity-100" : "opacity-0"
                                    }`}
                            >
                                <img
                                    src={image}
                                    alt={''}
                                    className="w-full h-full object-cover bg-subBg rounded-[32px]"
                                />
                            </div>
                        ))}


                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={nextSlide}
                                    className={`w-3 h-3 rounded-full transition-all ${index === currentSlideIndex
                                        ? "bg-primary"
                                        : "bg-white opacity-70"
                                        }`}
                                ></button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Photo
