import { Product } from "../../types/product";

const macbookAir: Product = {
    id: "5",
    slug: "macbook-air-m4",

    name: "MacBook Air M4",
    brand: "Apple",
    category: "Laptops",

    price: 899,
    originalPrice: 999,

    rating: 4.9,
    reviews: 832,

    image: "/images/products/macbook-air-m4.png",

    description: "The ultra-thin MacBook Air powered by the Apple M4 chip delivers exceptional speed, battery life, and portability.",

    badge: "Editor's Choice",

    isFeatured: true,
    stock: 0,
    features: []
};

export default macbookAir;