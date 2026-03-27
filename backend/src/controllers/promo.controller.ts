import { Request, Response } from 'express';
import Promo from '../models/Promo';

export const getPromos = async (req: Request, res: Response) => {
  try {
    const promos = await Promo.find();
    res.json(promos);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch promos.' });
  }
};

export const createPromo = async (req: Request, res: Response) => {
  try {
    const promo = new Promo(req.body);
    await promo.save();
    res.status(201).json(promo);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create promo.', error: err });
  }
};

export const updatePromo = async (req: Request, res: Response) => {
  try {
    const promo = await Promo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!promo) return res.status(404).json({ message: 'Promo not found.' });
    res.json(promo);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update promo.', error: err });
  }
};

export const deletePromo = async (req: Request, res: Response) => {
  try {
    const promo = await Promo.findByIdAndDelete(req.params.id);
    if (!promo) return res.status(404).json({ message: 'Promo not found.' });
    res.json({ message: 'Promo deleted.' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete promo.', error: err });
  }
};
