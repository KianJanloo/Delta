export interface IAddFavorite {
    house_id: number,
    user_id: number
}

export interface IFavorite {
    id: number;
    user_id: number;
    house_id: number;
    createdAt: string;
    updatedAt: string;
    house: {
        id: number;
        title: string;
        address: string;
        photos: string[];
        rate: number | null;
        price: string;
    };
}