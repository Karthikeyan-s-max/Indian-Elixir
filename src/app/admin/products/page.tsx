"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2 } from "lucide-react";
import ProductFormModal, { ProductFormValues } from "@/components/admin/ProductFormModal";
import { formatINR } from "@/lib/utils";

type Product = {
  id: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  status: "ACTIVE" | "INACTIVE";
  category: string | null;
  images: { url: string }[];
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ProductFormValues | undefined>(undefined);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data.products ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openAdd() {
    setEditing(undefined);
    setModalOpen(true);
  }

  function openEdit(p: Product) {
    setEditing({
      id: p.id,
      name: p.name,
      description: p.description,
      price: Number(p.price),
      stock: p.stock,
      category: p.category ?? "",
      status: p.status,
    });
    setModalOpen(true);
  }

  async function toggleStatus(p: Product) {
    await fetch(`/api/admin/products/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: p.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" }),
    });
    load();
  }

  async function remove(p: Product) {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/products/${p.id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-forest">Products</h1>
          <p className="mt-1 text-ink-muted">Add, edit, and manage catalog visibility.</p>
        </div>
        <button onClick={openAdd} className="btn-copper">
          <Plus className="h-4 w-4" /> Add product
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-forest/5 bg-white shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-forest/5 text-xs font-bold uppercase tracking-wide text-forest">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-ink/40">Loading...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-ink/40">No products yet.</td></tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-t border-cream-line">
                  <td className="flex items-center gap-3 px-4 py-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-forest-50">
                      <Image src={p.images[0]?.url ?? "/logo.png"} alt={p.name} fill className="object-cover" />
                    </div>
                    <span className="font-medium text-ink">{p.name}</span>
                  </td>
                  <td className="px-4 py-3">{formatINR(Number(p.price))}</td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleStatus(p)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        p.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-ink/10 text-ink/50"
                      }`}
                    >
                      {p.status}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(p)} className="mr-2 rounded p-1.5 hover:bg-forest/5">
                      <Pencil className="h-4 w-4 text-forest" />
                    </button>
                    <button onClick={() => remove(p)} className="rounded p-1.5 hover:bg-red-50">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <ProductFormModal
          initial={editing}
          onClose={() => setModalOpen(false)}
          onSaved={() => {
            setModalOpen(false);
            load();
          }}
        />
      )}
    </div>
  );
}
