import Navbar from "@/components/Navbar/Navbar";
import Hero from "@/components/Hero/Hero";
import BrandStrip from "@/components/BrandStrip/BrandStrip";
import FeaturedProducts from "@/components/FeaturedProducts/FeaturedProducts";
import Categories from "@/components/Categories/Categories";
import WhyChooseUs from "@/components/WhyChooseUs/WhyChooseUs";
import NewsLetter from "@/components/NewsLetter/NewsLetter";
import CartDrawer from "@/components/cartdrawer/CartDrawer";
import Footer from "@/components/Footer/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <Hero />
      <BrandStrip />
      <FeaturedProducts />
      <Categories />
      <WhyChooseUs />
      <NewsLetter />
      <CartDrawer />
      <Footer />
    </main>
  );
}