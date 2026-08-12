import { Product } from "../../types/product";

const appleWatch: Product = {
    id: "3",
    slug: "apple-watch-series-10",

    name: "Apple Watch Series 10",
    brand: "Apple",
    category: "Wearables",

    price: 249,
    originalPrice: 299,

    rating: 4.8,
    reviews: 651,

    image: "/images/products/apple-watch-series-10.png",

    description: "Stay connected, active, and healthy with Apple's latest smartwatch featuring advanced health tracking and premium design.",

    badge: "New",
    stock: 99,

  features: [
    "Advanced Health and Fitness Tracking",
    "Seamless Apple Ecosystem Integration",
    "Life-Saving Safety Features",
    "Always-On Retina Display & Design",
  ],

    isFeatured: true,

};

export default appleWatch;