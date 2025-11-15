/* eslint-disable */
import React, { FC } from 'react'
import { BlurFade } from '../magicui/blur-fade'

const Photo: FC<{ images: string[] | null, nextSlide: () => void, currentSlideIndex: number }> = ({ currentSlideIndex, images, nextSlide }) => {
    const safeImages = images && Array.isArray(images) && images.length > 0 ? images : []
    
    if (safeImages.length === 0) {
        return (
            <div className="flex-grow order-1 2xl:w-9/12 w-full md:order-2">
                <div className="w-full h-[410px] bg-secondary-light2 rounded-[32px] flex items-center justify-center">
                    <span className="text-subText">تصویری موجود نیست</span>
                </div>
            </div>
        )
    }

    const image1 = safeImages[1] || safeImages[0] || ""
    const image2 = safeImages[2] || safeImages[0] || ""
    const currentImage = safeImages[currentSlideIndex] || safeImages[0] || ""

    return (
        <div className="flex-grow order-1 2xl:w-9/12 w-full md:order-2">
            <div className="flex flex-col lg:flex-row gap-2">
                <div className="flex flex-col gap-2 w-full lg:w-[400px] order-2 lg:order-1">
                    {image1 && (
                        <BlurFade className="w-full h-[208px] overflow-hidden rounded-lg">
                            <img
                                src={image1}
                                alt="تصویر ملک"
                                className="w-full h-full object-cover bg-secondary-light2 rounded-[32px]"
                                loading="lazy"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.style.display = 'none'
                                }}
                            />
                        </BlurFade>
                    )}
                    {image2 && image2 !== image1 && (
                        <BlurFade className="w-full h-[204px] overflow-hidden rounded-lg relative">
                            <img
                                src={image2}
                                alt="تصویر ملک"
                                className="w-full h-full object-cover bg-secondary-light2 rounded-[32px]"
                                loading="lazy"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.style.display = 'none'
                                }}
                            />
                        </BlurFade>
                    )}
                </div>

                <div className="h-[410px] overflow-hidden rounded-lg relative flex-grow order-1 lg:order-2">
                    <div className="relative w-full h-full">
                        {safeImages.map((image, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 transition-opacity duration-500 ${index === currentSlideIndex ? "opacity-100" : "opacity-0"
                                    }`}
                            >
                                <img
                                    src={image || ""}
                                    alt={`تصویر ${index + 1}`}
                                    className="w-full h-full object-cover bg-subBg rounded-[32px]"
                                    loading={index === 0 ? 'eager' : 'lazy'}
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement
                                        target.style.display = 'none'
                                    }}
                                />
                            </div>
                        ))}

                        {safeImages.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
                                {safeImages.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={nextSlide}
                                        className={`w-3 h-3 rounded-full transition-all cursor-pointer ${index === currentSlideIndex
                                            ? "bg-primary"
                                            : "bg-white opacity-70 hover:opacity-100"
                                            }`}
                                        aria-label={`تصویر ${index + 1}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Photo
