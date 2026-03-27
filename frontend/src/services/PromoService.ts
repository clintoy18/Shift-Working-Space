import { IPromo } from "@interfaces/models/IPromo";
import { api } from "@/lib/api";

export const PromoService = {
  async getPromos(): Promise<IPromo[]> {
    const res = await api.get("/promo");
    return res.data;
  },
  async createPromo(data: Partial<IPromo>): Promise<IPromo> {
    const res = await api.post("/promo", data);
    return res.data;
  },
  async updatePromo(id: string, data: Partial<IPromo>): Promise<IPromo> {
    const res = await api.put(`/promo/${id}`, data);
    return res.data;
  },
  async deletePromo(id: string): Promise<void> {
    await api.delete(`/promo/${id}`);
  },
};
