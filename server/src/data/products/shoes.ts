import { Product } from "../../types/product";

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

     stock: 459,
    features: [
        "Lightweight and Breathable Mesh Upper",
        "Responsive Cushioning for Long-Lasting Comfort",
        "Durable Rubber Outsole for Traction and Stability",
        "Sleek Design for Versatile Style",    
    ],

    isFeatured: true,
   
};

export default shoes;