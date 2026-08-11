import { Product } from "../../types/product";

const headphones: Product = {
  id: "1",
  slug: "headphones",

  name: "Acoustic Noise-Canceling Headphones",
  brand: "Sony",
  category: "Audio",

  price: 299,
  originalPrice: 349,

  rating: 4.8,
  reviews: 425,

  image: "/images/products/headphones.png",

  description:
    "Premium wireless headphones featuring industry-leading active noise cancellation, immersive sound quality, and all-day battery life.",

  badge: "Best Seller",

  stock: 24,

  features: [
    "Active Noise Cancellation",
    "40 Hour Battery",
    "Bluetooth 5.3",
    "Fast Charging",
    "Premium Leather Ear Cushions",
  ],

  colors: ["Black", "Silver", "Blue"],

  sizes: [],

  isFeatured: true,
};

export default headphones;