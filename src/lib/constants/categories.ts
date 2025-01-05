export const PRODUCT_CATEGORIES = [
  "All",
  "Home & Furniture",
  "Building Materials & Hardware",
  "Automotive & Transportation",
  "Health & Wellness",
  "Office & School Supplies",
  "Sports & Outdoor Gear",
  "Services & Digital Goods",
  "Properties",
  "Business",
  "Agricultural",
  "Arts, Crafts",
  "Clothing & Fashion",
  "Electronics & Appliances",
  "Beauty & Personal Care",
  "Containers"
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];