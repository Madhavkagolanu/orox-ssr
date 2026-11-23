"use client";
import HomeBannerSlider from "./HomeBannerSlider";
import Categories from "./Categories";
import ProductRow from "./ProductRow";
import Footer from "./Footer";
import FeaturedProductGrid from "./FeaturedProductGrid";
import ProductCarousel from "./ProductCarousel";

export default function HomePage() {
  const banners = [
    {
      image:
        "https://jancrsardwaagqgcsejm.supabase.co/storage/v1/object/public/images/00000001/1768238237288-100125-1A.jpg",
      path: "/search?q=tfi&page=1",
    },
    {
      image:
        "https://jancrsardwaagqgcsejm.supabase.co/storage/v1/object/public/images/00000008/1769758256393-1001497846.jpg",
      path: "/search?q=inaya&page=1",
    },
    {
      image:
        "https://jancrsardwaagqgcsejm.supabase.co/storage/v1/object/public/images/00000009/1770183247841-20260125084649.jpg",
      path: "/search?q=aaradhya&page=1",
    },
    {
      image:
        "https://jancrsardwaagqgcsejm.supabase.co/storage/v1/object/public/images/00000006/1765917675215-1000011302.jpg",
      path: "/search?q=aarah&page=1",
    },
    {
      image:
        "https://jancrsardwaagqgcsejm.supabase.co/storage/v1/object/public/images/00000005/1767269539780-tote.jpg",
      path: "/search?q=chinhhari&page=1",
    },
  ];

  return (
    <div className="mt-20">
      <HomeBannerSlider banners={banners} />

      <Categories />

      {/* <ProductRow
        title="TFI"
        subtitle="Iconic TFI-Inspired Apparel"
        search="telugu"
        limit={4}
      /> */}

      <ProductCarousel
        title="Fusion Wear"
        subtitle="Everyday ethnic wear you'll love"
        search="Aaradhya"
        limit={6}
      />
      <ProductCarousel
        title="Fashion Jewellery"
        subtitle="Everyday sparkle"
        search="Inaya"
        limit={6}
      />
      <ProductCarousel
        title="Hoodies"
        subtitle="Built for comfort"
        search="Hoodies"
        limit={6}
      />

      <ProductCarousel
        title="Home Decor"
        subtitle="Design your perfect space"
        search="Aarah"
        limit={6}
      />
      <ProductCarousel
        title="Ink to Thread"
        subtitle="Hand-Drawn Sketches on Tees"
        search="Chinhhari"
        limit={6}
      />

      <FeaturedProductGrid
        title="Anime Picks"
        subtitle="Top trending anime styles"
        search="anime"
      />

      <ProductRow
        title="Exclusives"
        subtitle="Our exclusive product selection"
        search="Oversized"
        limit={4}
      />

      <div className="mt-4">
        <Footer />
      </div>
    </div>
  );
}
