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
  discountedPrice?: number;
  categories?: TCategories;
}