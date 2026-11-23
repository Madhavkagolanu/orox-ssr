interface Product {
    id: string;
    name: string;
    price: number;
    image_url: string;
  }
  
  interface ProductGridProps {
    products: Product[];
    title?: string;
  }
  
  export default function ProductGrid({ products, title }: ProductGridProps) {
    return (
      <div className="mt-6">
        {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="border rounded-lg shadow hover:shadow-md transition p-3"
            >
              <img
                src={p.image_url}
                alt={p.name}
                className="w-full h-40 object-cover rounded"
              />
              <h3 className="mt-2 font-semibold">{p.name}</h3>
              <p className="text-gray-600">₹{p.price}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  