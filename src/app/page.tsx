import dynamic from "next/dynamic";
import HeroSlider from "@/components/home/HeroSlider";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import ShopByCategory from "@/components/home/ShopByCategory";

const Education101 = dynamic(() => import("@/components/home/Education101"), { ssr: true });
const Testimonials = dynamic(() => import("@/components/home/Testimonials"), { ssr: true });
const StoreSection = dynamic(() => import("@/components/home/StoreSection"), { ssr: true });
const InstagramFeed = dynamic(() => import("@/components/layout/InstagramFeed"), { ssr: true });

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
