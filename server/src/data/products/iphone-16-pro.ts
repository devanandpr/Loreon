import { Product } from "../../types/product";

const iphone16Pro: Product = {
    id: "8",
    slug: "iphone-16-pro",

    name: "iPhone 16 Pro",
    brand: "Apple",
    category: "Mobile",

    price: 699,
    originalPrice: 799,

    rating: 4.9,
    reviews: 1648,

    image: "/images/products/iphone-16-pro.png",

    description: "Apple's flagship smartphone featuring the latest A-series chip, advanced camera system, and premium titanium design.",

    badge: "Flagship",

    stock: 50,
    features: [
        "A18 Bionic Chip for Unmatched Performance",
        "Pro Camera System with Advanced Computational Photography",
        "Titanium Frame for Enhanced Durability and Premium Feel",
        "iOS 18 with New Features and Optimizations",
    ],

    isFeatured: true,
    
};

export default iphone16Pro;