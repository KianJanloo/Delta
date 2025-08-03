import { TCategories } from "../slider-type/slider-types";

export interface ICard {
  photos?: string[];
  rate?: string;
  title?: string;
  address?: string;
  view?: '1' | '2';
  rooms?: number;
  bathrooms?: number;
  parking?: number;
  transaction_type?: string;
  price?: string;
  id?: string;
  discount_id?: string;
  categories?: TCategories;
  discounted_price: string;
}