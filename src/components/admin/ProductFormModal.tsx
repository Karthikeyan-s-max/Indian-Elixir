"use client";

import { useState } from "react";
import { X } from "lucide-react";

export type ProductFormValues = {
  id?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category?: string;
  status: "ACTIVE" | "INACTIVE";
  imagePreview?: string;
};

export default function ProductFormModal({
  initial,
  onClose,
  onSaved,
}: {
  initial?: ProductFormValues;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [values, setValues] = useState<ProductFormValues>(
    initial ?? { name: "", description: "", price: 0, stock: 0, category: "", status: "ACTIVE" }
  );
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageDataUri(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = { ...values, imageDataUri: imageDataUri ?? undefined };
    const url = values.id ? `/api/admin/products/${values.id}` : "/api/admin/products";
    const method = values.id ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
      return;
    }
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
      <div className="w-full max-w-lg rounded-xl2 bg-white p-6 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-forest">
            {values.id ? "Edit product" : "Add product"}
          </h2>
          <button onClick={onClose}><X className="h-5 w-5 text-ink/50" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-field">Product name</label>
            <input
              value={values.name}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="label-field">Description</label>
            <textarea
              value={values.description}
              onChange={(e) => setValues({ ...values, description: e.target.value })}
              className="input-field"
              rows={3}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Price (₹)</label>
              <input
                type="number"
                value={values.price}
                onChange={(e) => setValues({ ...values, price: Number(e.target.value) })}
                className="input-field"
                required
                min={0}
              />
            </div>
            <div>
              <label className="label-field">Stock</label>
              <input
                type="number"
                value={values.stock}
                onChange={(e) => setValues({ ...values, stock: Number(e.target.value) })}
                className="input-field"
                required
                min={0}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Category</label>
              <input
                value={values.category ?? ""}
                onChange={(e) => setValues({ ...values, category: e.target.value })}
                className="input-field"
                placeholder="oils / herbal"
              />
            </div>
            <div>
              <label className="label-field">Status</label>
              <select
                value={values.status}
                onChange={(e) => setValues({ ...values, status: e.target.value as "ACTIVE" | "INACTIVE" })}
                className="input-field"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label-field">Product image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="input-field" />
          </div>

          {error && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Saving..." : "Save product"}
          </button>
        </form>
      </div>
    </div>
  );
}
