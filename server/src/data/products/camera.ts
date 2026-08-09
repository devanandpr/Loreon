import { Product } from "@/types/product";

const camera: Product = {
    id: "2",
    slug: "sony-alpha-dslr-camera",

    name: "Sony Alpha DSLR Camera",
    brand: "Sony",
    category: "Cameras",

    price: 149,
    originalPrice: 179,

    rating: 4.6,
    reviews: 287,

    image: "/images/products/camera.png",

    description: "Capture stunning photos and videos with a lightweight DSLR featuring fast autofocus and exceptional image quality.",

    badge: "Popular",

    isFeatured: true,
    stock: 0,
    features: []
};

export default camera;