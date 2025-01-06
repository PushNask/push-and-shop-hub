import { FeaturedProducts } from "@/components/FeaturedProducts";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
        <section className="space-y-4">
          <h1 className="text-4xl font-bold">Welcome to PushNshop</h1>
          <p className="text-muted-foreground text-lg">
            Discover amazing products from verified sellers across Cameroon
          </p>
        </section>

        <FeaturedProducts />
      </main>
      <Footer />
    </div>
  );
}