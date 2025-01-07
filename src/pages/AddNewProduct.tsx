import { AddProductForm } from "@/components/seller/products/AddProductForm";

export default function AddNewProduct() {
  return (
    <div className="container max-w-2xl py-6 space-y-6 animate-fadeIn">
      <h1 className="text-2xl font-semibold tracking-tight">Add New Product</h1>
      <AddProductForm />
    </div>
  );
}