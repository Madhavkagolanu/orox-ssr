import { FC } from "react";
import banner from "./Banner3.png";
// Product interface matching your database structure
interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  offerPrice: string;
  image: string;
  brand: string;
  category: string;
  tags: string[];
}

// Product Card Component
const ProductCard: FC<{ product: Product }> = ({ product }) => {
  const originalPrice = parseFloat(product.price.replace('₹', ''));
  const offerPrice = parseFloat(product.offerPrice.replace('₹', ''));
  const discount = Math.round(((originalPrice - offerPrice) / originalPrice) * 100);

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer border border-gray-100">
      {/* Product Image */}
      <div className="relative overflow-hidden rounded-t-lg">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
        />
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-2 left-2">
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-semibold">
              {discount}% OFF
            </span>
          </div>
        )}
        {/* Brand Tag */}
        <div className="absolute top-2 right-2">
          <span className="bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            {product.brand}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        
        {/* Price Section */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-bold text-gray-900">{product.offerPrice}</span>
          {discount > 0 && (
            <span className="text-sm text-gray-500 line-through">{product.price}</span>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {product.tags.slice(0, 2).map((tag, index) => (
            <span 
              key={index}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>

       
      </div>
    </div>
  );
};

// Footer Component
const Footer: FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">M A D Company</h3>
            <p className="text-gray-300 leading-relaxed">
              Premium fashion destination offering curated collections for the modern lifestyle. 
              Quality meets style in every piece.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Contact Info</h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
                </svg>
                <div>
                  <p className="font-medium">Address:</p>
                  <p>Whitefield,</p>
                  <p>Bangalore, India</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <div>
                  <p className="font-medium">Email:</p>
                  <a href="mailto:email@email.com" className="hover:text-white transition">
                    email@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1zM12 3v10l3-3h6V3h-9z"/>
                </svg>
                <div>
                  <p className="font-medium">Phone:</p>
                  <a href="tel:+912253" className="hover:text-white transition">
                    +91  2253
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/about" className="hover:text-white transition">About Us</a></li>
              <li><a href="/contact" className="hover:text-white transition">Contact</a></li>
              <li><a href="/shipping" className="hover:text-white transition">Shipping Policy</a></li>
              <li><a href="/returns" className="hover:text-white transition">Return Policy</a></li>
              <li><a href="/privacy" className="hover:text-white transition">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Customer Care</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/faq" className="hover:text-white transition">FAQ</a></li>
              <li><a href="/track-order" className="hover:text-white transition">Track Order</a></li>
              <li><a href="/size-guide" className="hover:text-white transition">Size Guide</a></li>
              <li><a href="/careers" className="hover:text-white transition">Careers</a></li>
            
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              <p>&copy; 2025 M A D. All rights reserved.</p>
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="/terms" className="hover:text-white transition">Terms of Service</a>
              <a href="/privacy" className="hover:text-white transition">Privacy Policy</a>
              <a href="/cookies" className="hover:text-white transition">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main Landing Page Component
const EcommerceLandingPage: FC = () => {
  // Product data from your database
  const products: Product[] = [
    {
      id: "3e42458c-3085-4dba-a63e-9a053c4af582",
      name: "Classic Cotton Tee",
      description: "A soft and breathable essential t-shirt made from 100% premium cotton.",
      price: "₹29.99",
      offerPrice: "₹24.99",
      image: "https://images.pexels.com/photos/9558601/pexels-photo-9558601.jpeg",
      brand: "PrimeWear",
      category: "T-Shirts",
      tags: ["basic", "cotton", "casual", "essential"]
    },
    {
      id: "99f51ed2-a8fc-4403-8c7e-ab4730021475",
      name: "V-Neck Premium Tee",
      description: "A comfortable v-neck t-shirt offering a classic and slightly dressier look.",
      price: "₹34.99",
      offerPrice: "₹29.99",
      image: "https://images.pexels.com/photos/769733/pexels-photo-769733.jpeg",
      brand: "UrbanThreads",
      category: "T-Shirts",
      tags: ["v-neck", "soft", "stylish", "versatile"]
    },
    {
      id: "7eddda04-edbf-4e4d-adcf-535be74bd02a",
      name: "Heavyweight Pocket Tee",
      description: "A durable heavyweight t-shirt with a classic chest pocket for everyday wear.",
      price: "₹39.99",
      offerPrice: "₹34.99",
      image: "https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg",
      brand: "StapleCo",
      category: "T-Shirts",
      tags: ["pocket", "heavyweight", "workwear", "durable"]
    },
    {
      id: "9a112b36-bc8c-45bf-9c94-eef4f9a10e17",
      name: "Performance Sport Shirt",
      description: "A moisture-wicking t-shirt designed for active lifestyles and workouts.",
      price: "₹49.99",
      offerPrice: "₹42.99",
      image: "https://images.pexels.com/photos/4677958/pexels-photo-4677958.jpeg",
      brand: "ActiveGear",
      category: "T-Shirts",
      tags: ["sport", "performance", "gym", "dry-fit"]
    },
    {
      id: "1b45f669-43ca-440b-8e6b-2425d3ea32fa",
      name: "Organic Crewneck Tee",
      description: "An eco-friendly t-shirt made from 100% GOTS certified organic cotton.",
      price: "₹45.00",
      offerPrice: "₹38.50",
      image: "https://images.pexels.com/photos/6030282/pexels-photo-6030282.jpeg",
      brand: "EarthTone",
      category: "T-Shirts",
      tags: ["organic", "eco-friendly", "sustainable", "crewneck"]
    },
    {
      id: "f639a534-0fab-4416-a32e-dff9cb124854",
      name: "Striped Long Sleeve Tee",
      description: "A comfortable long sleeve t-shirt featuring a timeless striped pattern.",
      price: "₹55.00",
      offerPrice: "₹47.99",
      image: "https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg",
      brand: "NauticalCo",
      category: "T-Shirts",
      tags: ["striped", "long-sleeve", "casual", "maritime"]
    },
    {
      id: "b179bf79-b589-457f-8939-9c92e1786dcc",
      name: "Henley Neck Shirt",
      description: "A stylish henley t-shirt with a buttoned placket for a relaxed, layered look.",
      price: "₹42.99",
      offerPrice: "₹36.99",
      image: "https://images.pexels.com/photos/842811/pexels-photo-842811.jpeg",
      brand: "RuggedWear",
      category: "T-Shirts",
      tags: ["henley", "buttons", "casual", "rugged"]
    },
    {
      id: "15bdb7a9-fd3f-4d3a-935a-c637ce041fc5",
      name: "Graphic Print Tee",
      description: "A soft cotton t-shirt featuring a unique and artistic graphic print.",
      price: "₹37.99",
      offerPrice: "₹32.50",
      image: "https://images.pexels.com/photos/1192607/pexels-photo-1192607.jpeg",
      brand: "InkThreads",
      category: "T-Shirts",
      tags: ["graphic", "print", "art", "statement"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Responsive Hero Banner */}
      <section className="w-full">
        {/* Desktop Banner */}
        <div className="hidden md:block w-full h-126 bg-gradient-to-r from-purple-600 to-blue-600 relative overflow-hidden">
          <img 
            src={banner} 
            alt="Fashion Sale - Desktop Banner"
            className="w-full h-full object-cover"
          />
         
        </div>

        {/* Mobile Banner */}
        <div className="block md:hidden w-full h-96 bg-gradient-to-b from-pink-500 to-red-500 relative overflow-hidden">
          <img 
            src={banner}
            alt="Fashion Sale - Mobile Banner"
            className="w-full h-full object-cover"
          />
      
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="px-4 py-8 md:px-8 md:py-12 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-8">
          
          
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="px-4 py-8 md:px-8 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-8">Shop By Category</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { name: "T-Shirts", icon: "👕" },
              { name: "Shirts", icon: "👔" },
              { name: "Jeans", icon: "👖" },
              { name: "Shoes", icon: "👟" },
              { name: "Accessories", icon: "🕶️" },
              { name: "Winter Wear", icon: "🧥" }
            ].map((category) => (
              <div key={category.name} className="text-center group cursor-pointer">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-gray-200 transition group-hover:scale-110">
                  <span className="text-2xl">{category.icon}</span>
                </div>
                <span className="text-sm font-medium text-gray-700">{category.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gray-900 text-white py-12">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated</h3>
          <p className="text-gray-300 mb-6">Subscribe to get updates on new arrivals and special offers</p>
          <div className="flex max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-l-lg text-gray-900 focus:outline-none"
            />
            <button className="bg-pink-500 px-6 py-3 rounded-r-lg font-semibold hover:bg-purple-700 transition">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default EcommerceLandingPage;