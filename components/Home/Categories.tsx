"use client";
import Link from "next/link";

export default function ShopByCategory() {
  const categories = [
    {
      name: "Anime",
      image:
        "https://images.unsplash.com/photo-1705932461994-6fb2b07f27dd?w=1000&auto=format&fit=crop&q=60",
      link: "/search?q=anime&page=1",
    },
    {
      name: "Girly",
      image:
        "https://images.unsplash.com/photo-1562048048-86d659689440?w=1000&auto=format&fit=crop&q=60",
      link: "/search?q=girly&page=1",
    },
    {
      name: "T-Shirts",
      image:
        "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=400&fit=crop&crop=center",
      link: "/search?q=t-shirts&page=1",
    },
    {
      name: "TFI Movies",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpcMA92drCk2JQaqq1jSd2ctcrVJrmgXoNSg&s",
      link: "/search?q=tfi&page=1",
    },
    {
      name: "Home Decor",
      image:
        "https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg",
      link: "/search?q=aarah&page=1",
    },
    {
      name: "Ink to Thread",
      image:
        "https://jancrsardwaagqgcsejm.supabase.co/storage/v1/object/public/images/00000005/1765791079113-t-shirtCompressed.jpg",
      link: "/search?q=chinhhari&page=1",
    },
    {
      name: "Hoodies",
      image:
        "https://jancrsardwaagqgcsejm.supabase.co/storage/v1/object/public/images/00000001/1768234784946-100125-10A.jpg",
      link: "/search?q=hoodies&page=1",
    },
    {
      name: "Jewellery",
      image:
        "https://media.istockphoto.com/id/1488371329/photo/indian-traditional-gold-jewellery-displayed-in-a-shop-for-sale-in-pune-maharashtra-indian-art.jpg?s=612x612&w=0&k=20&c=ZqCHPPuqTzrV5I4Ezem3XXIq_Gxttm7f9c0V3Q2DHXk=",
      link: "/search?q=Inaya&page=1",
    },
    {
      name: "Ethnic Sets",
      image:
        "https://jancrsardwaagqgcsejm.supabase.co/storage/v1/object/public/images/00000009/1770183222384-1000102037.jpg",
      link: "/search?q=Aaradhya&page=1",
    },
  ];

  return (
    <div className="w-full flex flex-col items-center bg-white px-4 py-6 mt-8">
      <h1 className="text-xl sm:text-2xl font-semibold mb-6 tracking-wide text-gray-900">
        Shop by Category
      </h1>

      <div className="flex flex-wrap justify-center gap-5 sm:gap-6 max-w-4xl mx-auto">
        {categories.map((cat, idx) => (
          <Link
            href={cat.link}
            key={idx}
            className="flex flex-col items-center group w-20 sm:w-24 md:w-28"
          >
            <div
              className="
                rounded-full overflow-hidden
                flex items-center justify-center
                shadow-sm border bg-gray-100
                transition-transform duration-200
                group-hover:scale-105
                w-20 h-20
                sm:w-24 sm:h-24
                md:w-28 md:h-28
              "
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover"
              />
            </div>

            <p
              className="
                mt-2 sm:mt-3
                text-xs sm:text-sm
                text-gray-700
                group-hover:opacity-80
                text-center
              "
            >
              {cat.name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
