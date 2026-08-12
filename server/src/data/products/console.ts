import { Product } from "../../types/product";

const console: Product = {
    id: "6",
    slug: "playstation-5-console",

    name: "PlayStation 5 Console",
    brand: "Sony",
    category: "Gaming",

    price: 499,
    originalPrice: 549,

    rating: 4.9,
    reviews: 1205,

    image: "/images/products/console.png",

    description: "Experience lightning-fast loading, immersive gaming, and stunning 4K graphics with the PlayStation 5 console.",

    badge: "Hot",

    stock: 259,

    features: [
        "Ultra-High-Speed SSD",
        "Ray Tracing Technology",
        "4K Gaming Experience",
        "3D Audio Support",
    ],  

    isFeatured: true,
    
};

export default console;