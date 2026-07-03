import dynamic from "next/dynamic";
import HeroBanner from "@/components/home/HeroBanner";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import ShopByCategory from "@/components/home/ShopByCategory";
import LatestBlog from "@/components/home/LatestBlog";

const BrandIntro = dynamic(() => import("@/components/home/BrandIntro"), { ssr: true });
const Education101 = dynamic(() => import("@/components/home/Education101"), { ssr: true });
const Testimonials = dynamic(() => import("@/components/home/Testimonials"), { ssr: true });
const StoreSection = dynamic(() => import("@/components/home/StoreSection"), { ssr: true });
const InstagramFeed = dynamic(() => import("@/components/layout/InstagramFeed"), { ssr: true });

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <FeaturedProducts />
      <ShopByCategory />
      <BrandIntro />
      <Education101 />
      <Testimonials />
      <LatestBlog />
      <StoreSection />
      <InstagramFeed />
    </>
  );
}
