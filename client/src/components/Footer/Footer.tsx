import Link from "next/link";
import { site } from "@/constants/site";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-black">
      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid md:grid-cols-4 gap-10">

          <div>
            <h2 className="text-2xl font-bold tracking-widest">
              {site.name}
            </h2>

            <p className="text-zinc-400 mt-4 text-sm">
              {site.description}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Shop</h3>

            <div className="space-y-2 text-zinc-400 text-sm">

              <Link href="/">Home</Link>

              <br />

              <Link href="/">Products</Link>

              <br />

              <Link href="/">Categories</Link>

            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>

            <div className="space-y-2 text-zinc-400 text-sm">

              <Link href="/">About</Link>

              <br />

              <Link href="/">Contact</Link>

              <br />

              <Link href="/">Support</Link>

            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">
              Follow
            </h3>

            <p className="text-zinc-400 text-sm">
              Instagram
              <br />
              Facebook
              <br />
              X
            </p>
          </div>

        </div>

        <div className="border-t border-zinc-800 mt-10 pt-6 text-center text-zinc-500 text-sm">
          {site.copyright}
        </div>

      </div>
    </footer>
  );
}