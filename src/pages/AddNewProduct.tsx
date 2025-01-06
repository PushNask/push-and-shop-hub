import { AddProductForm } from "@/components/seller/products/AddProductForm";

export default function AddNewProduct() {
  return (
    <div className="container max-w-2xl py-6 space-y-6 animate-fadeIn">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Add New Product</h1>
        <p className="text-muted-foreground">
          Fill in the details below to list your product on PushNshop.
        </p>
      </div>
      <AddProductForm />
    </div>
  );
}