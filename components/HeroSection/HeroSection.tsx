import { FC } from "react";
import ProductCard from "../Card/Card";

const products = [
  {
    id: '14b8758c-3f4c-4d98-afca-b820f7058910',
    name: "Snitch",
    description: "Boxy Opaque Casual Shirt",
    price: "₹1,199",
    offerPrice: "₹999",
    image:
      "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTS_uSl0NCZQm3eDzHSLB5WXkv0YY6ljrm4oK2Tg62ZWbMrBs_Am_ooJAQZTEDSZldZ16WS5izFqOwNKhJ8VitnDKD3XTJuajiyBtTdUbYCpFlrCRecoo98jfMcSVe9m4yp7HK1Nw&usqp=CAc/",
  },
  {
    id: "760c4640-e6f5-473e-b21e-ffe5073c3a23",
    name: "Campus Sutra",
    description: "Spread Collar Casual Shirt",
    price: "₹1,899",
    offerPrice: "₹778",
    image:
      "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQt7gkdXETOn-NdqY1t5XkjDzH6bXbvc9Ylj67S260VMQWTwhcV6uTQnRbaEFXdFa0rXA4-F9NGNp_0nYiqOq2miDv87S4icRTuhrxOxLPBErJlgmunHiavEf1LkOnDpFAgdrW-mDw&usqp=CAc",
  },
  {
    id: 3,
    name: "Campus Sutra",
    description: "Spread Collar Casual Shirt",
    price: "₹1,899",
    offerPrice: "₹778",
    image:
      "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQt7gkdXETOn-NdqY1t5XkjDzH6bXbvc9Ylj67S260VMQWTwhcV6uTQnRbaEFXdFa0rXA4-F9NGNp_0nYiqOq2miDv87S4icRTuhrxOxLPBErJlgmunHiavEf1LkOnDpFAgdrW-mDw&usqp=CAc",
  },
  {
    id: 4,
    name: "Campus Sutra",
    description: "Spread Collar Casual Shirt",
    price: "₹1,899",
    offerPrice: "₹778",
    image:
      "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQt7gkdXETOn-NdqY1t5XkjDzH6bXbvc9Ylj67S260VMQWTwhcV6uTQnRbaEFXdFa0rXA4-F9NGNp_0nYiqOq2miDv87S4icRTuhrxOxLPBErJlgmunHiavEf1LkOnDpFAgdrW-mDw&usqp=CAc",
  },
];

const HeroSection: FC = () => {
  return (
    <section className="px-3 py-6 md:px-6 md:py-10">
      {/* <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-wide text-gray-900">
          OG Wear
        </h2>
        <button className="text-sm font-medium text-gray-600 hover:text-black transition">
          Shop Now &gt;
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div> */}
    </section>
  );
};

export default HeroSection;
