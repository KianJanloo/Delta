import AboutUs from "@/components/Landing/about/aboutUs";
import CommentUsers from "@/components/Landing/comment/CommentUsers";
import SpecialOffer from "@/components/Landing/specialOffer/SpecialOffer";
import DivBlur from "@/components/common/blurFilter/DivBlur";
import HeroSection from "@/components/Landing/hero-section/HeroSection";
import DestinationOfDreams from "@/components/Landing/destinationOfDreams/DestinationOfDreams";
import RealStateTraveling from "@/components/Landing/realStateTraveling/RealStateTraveling";
import NewPlaces from "@/components/Landing/newPlaces/NewPlaces";
import Categories from "@/components/Landing/categories/Categories";

export default async function Home() {

  return (
    <div className="w-full flex flex-col gap-16 overflow-x-hidden">
      <HeroSection />

      <div className="relative">
        <Categories />
      </div>
      <div className="relative px-8">
        <DivBlur className="bg-blur-blue right-[-150px]" />
        <SpecialOffer />
      </div>
      <div className="relative">
        <DivBlur className="bg-blur-primary left-[-150px] top-[150px]" />
        <DestinationOfDreams />
      </div>
      <div className="relative">
        <DivBlur className="bg-blur-primary left-[-150px] bottom-0" />
        <DivBlur className="bg-blur-blue right-[-150px]" />
        <AboutUs />
      </div>
      <div className="relative bg-secondary-light flex flex-col gap-32 py-[40px] rounded-[64px] px-8">
        <DivBlur className="bg-blur-blue right-[-150px] bottom-[500px]" />
        <RealStateTraveling />
        <NewPlaces />
      </div>
      <div className="relative">
        <CommentUsers />
      </div>
    </div>
  );
}
