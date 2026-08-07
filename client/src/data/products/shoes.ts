import { Product } from "@/types/product";

const shoes: Product = {
    id: "7",
    slug: "nike-running-shoes",

    name: "Nike Running Shoes",
    brand: "Nike",
    category: "Shoes",

    price: 119,
    originalPrice: 149,

    rating: 4.7,
    reviews: 374,

    image: "/images/products/shoes.png",

    description: "Comfortable performance running shoes engineered for everyday training with lightweight cushioning.",

    badge: "Trending",

    isFeatured: true,
    stock: 0,
    features: []
};

export default shoes;