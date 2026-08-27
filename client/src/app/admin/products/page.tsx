
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";

interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number | null;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  badge?: string | null;
  isFeatured: boolean;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

interface ProductForm {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: string;
  originalPrice: string;
  rating: string;
  reviews: string;
  image: string;
  description: string;
  badge: string;
  isFeatured: boolean;
  stock: string;
}

const emptyForm: ProductForm = {
  id: "",
  slug: "",
  name: "",
  brand: "",
  category: "",
  price: "",
  originalPrice: "",
  rating: "0",
  reviews: "0",
  image: "",
  description: "",
  badge: "",
  isFeatured: false,
  stock: "0",
};

export default function AdminProductsPage() {
  const { token, user } = useAuthStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editingProductId, setEditingProductId] = useState<string | null>(
    null
  );

  const [form, setForm] = useState<ProductForm>(emptyForm);

  // ========================================
  // GET PRODUCTS
  // ========================================

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/products"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch products"
        );
      }

      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // ADD PRODUCT
  // ========================================

  const handleAddProduct = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!token) {
      alert("Authentication required. Please login again.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(
        "http://localhost:5000/api/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: form.id,
            slug: form.slug,
            name: form.name,
            brand: form.brand,
            category: form.category,
            price: Number(form.price),
            originalPrice: form.originalPrice
              ? Number(form.originalPrice)
              : null,
            rating: Number(form.rating),
            reviews: Number(form.reviews),
            image: form.image,
            description: form.description,
            badge: form.badge || null,
            isFeatured: form.isFeatured,
            stock: Number(form.stock),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create product"
        );
      }

      alert("Product created successfully!");

      setForm({ ...emptyForm });
      setShowAddForm(false);

      await fetchProducts();
    } catch (error) {
      console.error("Error creating product:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to create product"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ========================================
  // START EDITING PRODUCT
  // ========================================

  const handleEditProduct = (product: Product) => {
    setEditingProductId(product.id);

    setForm({
      id: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: String(product.price),
      originalPrice:
        product.originalPrice !== null &&
        product.originalPrice !== undefined
          ? String(product.originalPrice)
          : "",
      rating: String(product.rating),
      reviews: String(product.reviews),
      image: product.image,
      description: product.description,
      badge: product.badge || "",
      isFeatured: product.isFeatured,
      stock: String(product.stock),
    });

    setShowAddForm(true);
  };

  // ========================================
  // UPDATE PRODUCT
  // ========================================

  const handleUpdateProduct = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!editingProductId) return;

    if (!token) {
      alert("Authentication required. Please login again.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(
        `http://localhost:5000/api/products/${editingProductId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            slug: form.slug,
            name: form.name,
            brand: form.brand,
            category: form.category,
            price: Number(form.price),
            originalPrice: form.originalPrice
              ? Number(form.originalPrice)
              : null,
            rating: Number(form.rating),
            reviews: Number(form.reviews),
            image: form.image,
            description: form.description,
            badge: form.badge || null,
            isFeatured: form.isFeatured,
            stock: Number(form.stock),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update product"
        );
      }

      alert("Product updated successfully!");

      setEditingProductId(null);
      setShowAddForm(false);
      setForm({ ...emptyForm });

      await fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update product"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ========================================
  // DELETE PRODUCT
  // ========================================

  const handleDeleteProduct = async (
    product: Product
  ) => {
    if (!token) {
      alert("Authentication required. Please login again.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${product.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete product"
        );
      }

      alert("Product deleted successfully!");

      await fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete product"
      );
    }
  };

  // ========================================
  // ACCESS CHECK
  // ========================================

  if (!token || !user) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Login Required
          </h1>

          <p className="text-zinc-500 mt-3">
            Please login to access the admin panel.
          </p>

          <Link
            href="/login"
            className="inline-block mt-6 bg-white text-black px-6 py-3 rounded-xl font-semibold"
          >
            Login
          </Link>
        </div>
      </main>
    );
  }

  if (user.role !== "ADMIN") {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold">
            Access Denied
          </h1>

          <p className="text-zinc-500 mt-3">
            You do not have permission to access the admin products page.
          </p>

          <Link
            href="/"
            className="inline-block mt-6 bg-white text-black px-6 py-3 rounded-xl font-semibold"
          >
            Back To Store
          </Link>
        </div>
      </main>
    );
  }

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">
            ⏳
          </div>

          <h1 className="text-2xl font-bold">
            Loading Products
          </h1>

          <p className="text-zinc-500 mt-2">
            Please wait...
          </p>
        </div>
      </main>
    );
  }

  // ========================================
  // ERROR
  // ========================================

  if (error) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Unable to Load Products
          </h1>

          <p className="text-red-400 mt-4">
            {error}
          </p>

          <button
            onClick={fetchProducts}
            className="mt-6 bg-white text-black px-6 py-3 rounded-xl font-semibold"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  // ========================================
  // PAGE
  // ========================================

  return (
    <main className="min-h-screen bg-black text-white">

      {/* Header */}

      <header className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">

          <Link
            href="/"
            className="text-2xl font-bold"
          >
            LOREON
          </Link>

          <div className="flex items-center gap-6">

            <Link
              href="/admin"
              className="text-zinc-400 hover:text-white transition"
            >
              Dashboard
            </Link>

            <Link
              href="/admin/orders"
              className="text-zinc-400 hover:text-white transition"
            >
              Orders
            </Link>

            <span className="text-zinc-500">
              Admin
            </span>

          </div>

        </div>
      </header>

      {/* Main */}

      <section className="max-w-7xl mx-auto px-6 py-12">

        {/* Page heading */}

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">

          <div>

            <p className="uppercase tracking-[0.3em] text-zinc-500 text-sm">
              Administration
            </p>

            <h1 className="text-4xl font-bold mt-3">
              Products
            </h1>

            <p className="text-zinc-400 mt-3">
              Manage your Loreon product inventory.
            </p>

          </div>

          <button
            onClick={() => {
              setEditingProductId(null);
              setForm({ ...emptyForm });
              setShowAddForm(true);
            }}
            className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-zinc-200 transition"
          >
            + Add Product
          </button>

        </div>

        {/* Stats */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">

            <p className="text-zinc-500 text-sm">
              Total Products
            </p>

            <p className="text-3xl font-bold mt-2">
              {products.length}
            </p>

          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">

            <p className="text-zinc-500 text-sm">
              In Stock
            </p>

            <p className="text-3xl font-bold mt-2">
              {
                products.filter(
                  (product) => product.stock > 0
                ).length
              }
            </p>

          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">

            <p className="text-zinc-500 text-sm">
              Out of Stock
            </p>

            <p className="text-3xl font-bold mt-2">
              {
                products.filter(
                  (product) => product.stock === 0
                ).length
              }
            </p>

          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">

            <p className="text-zinc-500 text-sm">
              Featured
            </p>

            <p className="text-3xl font-bold mt-2">
              {
                products.filter(
                  (product) => product.isFeatured
                ).length
              }
            </p>

          </div>

        </div>

        {/* Add / Edit Form */}

        {showAddForm && (
          <div className="mb-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

            <div className="flex items-center justify-between mb-6">

              <div>

                <h2 className="text-2xl font-bold">
                  {editingProductId
                    ? "Edit Product"
                    : "Add Product"}
                </h2>

                <p className="text-zinc-500 mt-1">
                  {editingProductId
                    ? "Update your product information."
                    : "Add a new product to Loreon."}
                </p>

              </div>

              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingProductId(null);
                  setForm({ ...emptyForm });
                }}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>

            </div>

            <form
              onSubmit={
                editingProductId
                  ? handleUpdateProduct
                  : handleAddProduct
              }
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >

              {/* Product ID */}

              <input
                required
                disabled={!!editingProductId}
                placeholder="Product ID"
                value={form.id}
                onChange={(e) =>
                  setForm({
                    ...form,
                    id: e.target.value,
                  })
                }
                className="bg-black border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-white disabled:opacity-50"
              />

              {/* Slug */}

              <input
                required
                placeholder="Slug"
                value={form.slug}
                onChange={(e) =>
                  setForm({
                    ...form,
                    slug: e.target.value,
                  })
                }
                className="bg-black border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-white"
              />

              {/* Name */}

              <input
                required
                placeholder="Product name"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                className="bg-black border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-white"
              />

              {/* Brand */}

              <input
                required
                placeholder="Brand"
                value={form.brand}
                onChange={(e) =>
                  setForm({
                    ...form,
                    brand: e.target.value,
                  })
                }
                className="bg-black border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-white"
              />

              {/* Category */}

              <input
                required
                placeholder="Category"
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value,
                  })
                }
                className="bg-black border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-white"
              />

              {/* Price */}

              <input
                required
                type="number"
                min="0"
                step="0.01"
                placeholder="Price"
                value={form.price}
                onChange={(e) =>
                  setForm({
                    ...form,
                    price: e.target.value,
                  })
                }
                className="bg-black border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-white"
              />

              {/* Original Price */}

              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Original price"
                value={form.originalPrice}
                onChange={(e) =>
                  setForm({
                    ...form,
                    originalPrice: e.target.value,
                  })
                }
                className="bg-black border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-white"
              />

              {/* Rating */}

              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                placeholder="Rating"
                value={form.rating}
                onChange={(e) =>
                  setForm({
                    ...form,
                    rating: e.target.value,
                  })
                }
                className="bg-black border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-white"
              />

              {/* Reviews */}

              <input
                type="number"
                min="0"
                placeholder="Reviews"
                value={form.reviews}
                onChange={(e) =>
                  setForm({
                    ...form,
                    reviews: e.target.value,
                  })
                }
                className="bg-black border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-white"
              />

              {/* Stock */}

              <input
                type="number"
                min="0"
                placeholder="Stock"
                value={form.stock}
                onChange={(e) =>
                  setForm({
                    ...form,
                    stock: e.target.value,
                  })
                }
                className="bg-black border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-white"
              />

              {/* Badge */}

              <input
                placeholder="Badge (optional)"
                value={form.badge}
                onChange={(e) =>
                  setForm({
                    ...form,
                    badge: e.target.value,
                  })
                }
                className="bg-black border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-white"
              />

              {/* Image */}

              <input
                required
                placeholder="Image URL"
                value={form.image}
                onChange={(e) =>
                  setForm({
                    ...form,
                    image: e.target.value,
                  })
                }
                className="md:col-span-2 bg-black border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-white"
              />

              {/* Description */}

              <textarea
                required
                placeholder="Product description"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                rows={5}
                className="md:col-span-2 bg-black border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-white resize-none"
              />

              {/* Featured */}

              <label className="md:col-span-2 flex items-center gap-3 cursor-pointer">

                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      isFeatured: e.target.checked,
                    })
                  }
                  className="w-4 h-4"
                />

                <span>
                  Mark as featured product
                </span>

              </label>

              {/* Form Buttons */}

              <div className="md:col-span-2 flex gap-4">

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-zinc-200 transition disabled:opacity-50"
                >
                  {isSubmitting
                    ? editingProductId
                      ? "Saving..."
                      : "Creating..."
                    : editingProductId
                      ? "Save Changes"
                      : "Create Product"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingProductId(null);
                    setForm({ ...emptyForm });
                  }}
                  className="border border-zinc-700 px-6 py-3 rounded-xl font-semibold hover:bg-zinc-800 transition"
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>
        )}

        {/* Product Table */}

        {products.length === 0 ? (

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">

            <h2 className="text-2xl font-bold">
              No Products
            </h2>

            <p className="text-zinc-500 mt-3">
              No products were found in the database.
            </p>

          </div>

        ) : (

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="border-b border-zinc-800">

                  <tr className="text-left text-sm text-zinc-500">

                    <th className="px-6 py-4">
                      Product
                    </th>

                    <th className="px-6 py-4">
                      Category
                    </th>

                    <th className="px-6 py-4">
                      Price
                    </th>

                    <th className="px-6 py-4">
                      Stock
                    </th>

                    <th className="px-6 py-4">
                      Featured
                    </th>

                    <th className="px-6 py-4">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {products.map((product) => (

                    <tr
                      key={product.id}
                      className="border-b border-zinc-800 last:border-b-0 hover:bg-zinc-800/40 transition"
                    >

                      {/* Product */}

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-4">

                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-16 rounded-xl object-cover bg-zinc-800"
                          />

                          <div>

                            <p className="font-semibold">
                              {product.name}
                            </p>

                            <p className="text-sm text-zinc-500 mt-1">
                              {product.brand}
                            </p>

                            {product.badge && (
                              <span className="inline-block mt-2 text-xs bg-zinc-800 px-2 py-1 rounded-md">
                                {product.badge}
                              </span>
                            )}

                          </div>

                        </div>

                      </td>

                      {/* Category */}

                      <td className="px-6 py-5">

                        <span className="text-zinc-300">
                          {product.category}
                        </span>

                      </td>

                      {/* Price */}

                      <td className="px-6 py-5">

                        <p className="font-semibold">
                          ₹{product.price.toFixed(2)}
                        </p>

                        {product.originalPrice && (
                          <p className="text-sm text-zinc-500 line-through">
                            ₹{product.originalPrice.toFixed(2)}
                          </p>
                        )}

                      </td>

                      {/* Stock */}

                      <td className="px-6 py-5">

                        {product.stock > 0 ? (

                          <span className="text-green-400">
                            {product.stock}
                          </span>

                        ) : (

                          <span className="text-red-400">
                            Out of stock
                          </span>

                        )}

                      </td>

                      {/* Featured */}

                      <td className="px-6 py-5">

                        {product.isFeatured ? (

                          <span className="text-yellow-400">
                            ★ Featured
                          </span>

                        ) : (

                          <span className="text-zinc-600">
                            —
                          </span>

                        )}

                      </td>

                      {/* Actions */}

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-4">

                          <button
                            onClick={() =>
                              handleEditProduct(product)
                            }
                            className="text-zinc-400 hover:text-white transition"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDeleteProduct(product)
                            }
                            className="text-red-400 hover:text-red-300 transition"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        )}

      </section>

    </main>
  );
}
