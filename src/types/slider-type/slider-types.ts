export interface ISlider {
    items: TItems[];
    view: '1' | '2';
    loading: boolean;
}

export interface ISliderPhotos {
    photos: string[];
    imageClassName?: string;
}

type TItems = {
    photos?: string[]
    rate?: string;
    title?: string;
    address?: string;
    rooms?: number;
    bathrooms?: number;
    parking?: number;
    transaction_type?: string;
    price?: string;
    id?: string;
    discountedPrice?: number;
    categories?: TCategories;
}

export type TCategories = {
    id: number;
    name: string;
}