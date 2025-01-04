import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";

const FEATURED_PRODUCTS = [
  {
    id: "p1",
    title: "Premium Smartphone",
    price: 250000,
    image: "/placeholder.svg",
  },
  {
    id: "p2",
    title: "Wireless Headphones",
    price: 45000,
    image: "/placeholder.svg",
  },
  {
    id: "p3",
    title: "Smart Watch",
    price: 75000,
    image: "/placeholder.svg",
  },
  {
    id: "p4",
    title: "Laptop Pro",
    price: 850000,
    image: "/placeholder.svg",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">Featured Products</h2>
            <p className="text-muted-foreground">
              Discover our handpicked selection of premium items.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {FEATURED_PRODUCTS.map((product) => (
              <ProductCard
                key={product.id}
                title={product.title}
                price={product.price}
                image={product.image}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;