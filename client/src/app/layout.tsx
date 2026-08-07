import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets:["latin"],
  display:"swap",
});

export const metadata: Metadata = {
  title:{
    default:"Loreon",
    template:"%s | Loreon",
  },
  description:
    "Premium electronics, accessories and lifestyle products built with Next.js.",
  keywords:[
    "Loreon",
    "Electronics",
    "Ecommerce",
    "Next.js",
    "Headphones",
    "Gaming",
  ],
};

export default function RootLayout({
  children,
}:{
  children:React.ReactNode;
}){
  return(
    <html lang="en">
      <body
        className={`${inter.className} bg-black text-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}