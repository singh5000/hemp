import HeroSlider from "@/components/home/HeroSlider";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import ShopByCategory from "@/components/home/ShopByCategory";
import Education101 from "@/components/home/Education101";
import Testimonials from "@/components/home/Testimonials";
import StoreSection from "@/components/home/StoreSection";
import InstagramFeed from "@/components/layout/InstagramFeed";

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <FeaturedProducts />
      <ShopByCategory />
      <Education101 />
      <Testimonials />
      <StoreSection />
      <InstagramFeed />
    </>
  );
}
