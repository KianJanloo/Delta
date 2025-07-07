export interface IHouse {
    id: string,
    title: string,
    address: string,
    photos: string[],
    rate: string,
    price: string,
    tags: string[],
    last_updated: string,
    capacity: number,
    location: {
        lat: number,
        lng: number
    },
    categories: {
        id: number,
        name: string
    },
    bathrooms: number,
    parking: number,
    rooms: number,
    yard_type: string,
    num_comments: number,
    transaction_type: "" | "rental" | "mortgage" | "reservation" | "direct_purchase",
    sellerId: string,
    sellerName: string,
    caption: null,
    isFavorite: boolean
}

export interface ICreateHouse {
    title: string,
    address: string,
    photos: string[],
    price: string,
    tags: string[],
    capacity: number,
    location: {
        lat: number,
        lng: number
    },
    categories: {
        id: number,
        name: string
    },
    bathrooms: number,
    parking: number,
    rooms: number,
    yard_type: string,
    transaction_type: string,
    caption: string
}

export interface ICreateHouseValues {
    title: string,
    address: string,
    photos: string[],
    price: string,
    tags: string[],
    capacity: number,
    location: {
        lat: number,
        lng: number
    },
    category: string,
    bathrooms: number,
    parking: number,
    rooms: number,
    yard_type: string,
    transaction_type: string,
    caption: string
}