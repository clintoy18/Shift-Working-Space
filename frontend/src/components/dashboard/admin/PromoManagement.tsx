import React, { useEffect, useState } from "react";
import { PromoService } from "@/services/PromoService";
import { IPromo } from "@interfaces/models/IPromo";

const emptyPromo: Partial<IPromo> = {
  name: "",
  code: "",
  description: "",
  discountType: "percent",
  discountValue: 0,
  startDate: "",
  endDate: "",
  isActive: true,
};

const PromoManagement: React.FC = () => {
  const [promos, setPromos] = useState<IPromo[]>([]);
  const [form, setForm] = useState<Partial<IPromo>>(emptyPromo);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPromos = async () => {
    setLoading(true);
    try {
      const data = await PromoService.getPromos();
      setPromos(data);
    } catch (e) {
      setError("Failed to fetch promos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (editingId) {
        await PromoService.updatePromo(editingId, form);
      } else {
        await PromoService.createPromo(form);
      }
      setForm(emptyPromo);
      setEditingId(null);
      fetchPromos();
    } catch (e) {
      setError("Failed to save promo");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (promo: IPromo) => {
    setForm({ ...promo });
    setEditingId(promo.id);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this promo?")) return;
    setLoading(true);
    setError(null);
    try {
      await PromoService.deletePromo(id);
      fetchPromos();
    } catch (e) {
      setError("Failed to delete promo");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm(emptyPromo);
    setEditingId(null);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Promo Management</h3>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
        <input name="name" value={form.name || ""} onChange={handleChange} placeholder="Promo Name" className="border p-2 rounded" required />
        <input name="code" value={form.code || ""} onChange={handleChange} placeholder="Code" className="border p-2 rounded" required disabled={!!editingId} />
        <textarea name="description" value={form.description || ""} onChange={handleChange} placeholder="Description" className="border p-2 rounded col-span-1 md:col-span-2" />
        <select name="discountType" value={form.discountType || "percent"} onChange={handleChange} className="border p-2 rounded">
          <option value="percent">Percent (%)</option>
          <option value="fixed">Fixed Amount</option>
        </select>
        <input name="discountValue" type="number" value={form.discountValue || 0} onChange={handleChange} placeholder="Discount Value" className="border p-2 rounded" required min={0} />
        <input name="startDate" type="date" value={form.startDate ? form.startDate.slice(0,10) : ""} onChange={handleChange} className="border p-2 rounded" required />
        <input name="endDate" type="date" value={form.endDate ? form.endDate.slice(0,10) : ""} onChange={handleChange} className="border p-2 rounded" required />
        <label className="flex items-center gap-2">
          <input name="isActive" type="checkbox" checked={form.isActive ?? true} onChange={handleChange} />
          Active
        </label>
        <div className="flex gap-2 mt-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
            {editingId ? "Update" : "Create"}
          </button>
          {editingId && (
            <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={handleCancel} disabled={loading}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-2 py-2 border">Name</th>
              <th className="px-2 py-2 border">Code</th>
              <th className="px-2 py-2 border">Type</th>
              <th className="px-2 py-2 border">Value</th>
              <th className="px-2 py-2 border">Start</th>
              <th className="px-2 py-2 border">End</th>
              <th className="px-2 py-2 border">Active</th>
              <th className="px-2 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {promos.map((promo) => (
              <tr key={promo.id} className="border-b">
                <td className="px-2 py-2 border">{promo.name}</td>
                <td className="px-2 py-2 border">{promo.code}</td>
                <td className="px-2 py-2 border">{promo.discountType}</td>
                <td className="px-2 py-2 border">{promo.discountType === 'percent' ? `${promo.discountValue}%` : `₱${promo.discountValue}`}</td>
                <td className="px-2 py-2 border">{promo.startDate.slice(0,10)}</td>
                <td className="px-2 py-2 border">{promo.endDate.slice(0,10)}</td>
                <td className="px-2 py-2 border text-center">{promo.isActive ? '✅' : '❌'}</td>
                <td className="px-2 py-2 border flex gap-2">
                  <button className="text-blue-600 underline" onClick={() => handleEdit(promo)} disabled={loading}>Edit</button>
                  <button className="text-red-600 underline" onClick={() => handleDelete(promo.id)} disabled={loading}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PromoManagement;
