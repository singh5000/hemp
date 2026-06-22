import HeroSlider from "@/components/home/HeroSlider";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import ShopByCategory from "@/components/home/ShopByCategory";
import Education101 from "@/components/home/Education101";
import Testimonials from "@/components/home/Testimonials";
import StoreSection from "@/components/home/StoreSection";
import InstagramFeed from "@/components/layout/InstagramFeed";
import FloatingHempIcons from "@/components/home/FloatingHempIcons";

export default function HomePage() {
  return (
    <>
      <FloatingHempIcons />
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
