import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    name: "Smokable Hemp Flower",
    href: "/product-category/smokable-hemp-flower",
    image: "https://hempandbarrel.com/wp-content/uploads/2023/02/smokables.jpg",
  },
  {
    name: "Edibles & Gummies",
    href: "/product-category/edibles-gummies",
    image: "https://hempandbarrel.com/wp-content/uploads/2023/02/edibles-image.jpg",
  },
  {
    name: "Infused Beverages",
    href: "/product-category/infused-beverages",
    image: "https://hempandbarrel.com/wp-content/uploads/2023/02/beverages.jpg",
  },
  {
    name: "CBD Pouches",
    href: "/product-category/cbd-pouches",
    image: "https://hempandbarrel.com/wp-content/uploads/2024/04/cbd-pouches2.png",
  },
  {
    name: "Tinctures",
    href: "/product-category/tinctures",
    image: "https://hempandbarrel.com/wp-content/uploads/2023/02/tincture.jpg",
  },
  {
    name: "Topicals",
    href: "/product-category/topicals",
    image: "https://hempandbarrel.com/wp-content/uploads/2024/04/Topicals-Category-Photo.png",
  },
  {
    name: "Pet Products",
    href: "/product-category/pets",
    image: "https://hempandbarrel.com/wp-content/uploads/2023/02/pets.jpg",
  },
  {
    name: "View All",
    href: "/shop",
    image: "https://hempandbarrel.com/wp-content/uploads/2023/02/view-all.jpg",
  },
];

export default function ShopByCategory() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1320px] mx-auto px-4">
        {/* Title */}
        <h2 className="text-center text-[44px] font-bold text-[#3d2b1f] uppercase tracking-widest mb-10">
          Shop By Category
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="relative rounded-xl overflow-hidden group"
              style={{ aspectRatio: "4/3" }}
            >
              {/* Background Image */}
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/45 transition-colors duration-300" />

              {/* Category name */}
              <div className="absolute bottom-0 left-0 p-4">
                <span className="text-white font-bold uppercase text-lg leading-tight tracking-wide drop-shadow-md">
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
