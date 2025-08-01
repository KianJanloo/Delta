import { IPassenger } from "@/utils/zustand/booking";

export interface IReserveType {
    id: number;
    user_id: number;
    houseId: number;
    reservedDates: {
        value: string;
        inclusive: boolean;
    }[];
    traveler_details: IPassenger[];
    status: string;
    sharedEmail: string;
    sharedMobile: string;
    createdAt: string;
    updatedAt: string;
}

export interface Reservation {
    id: number;
    hotelName: string;
    date: string;
    price: string;
    guestCount: string;
    status: "confirmed" | "waiting" | "canceled";
    paymentStatus: "paid" | "waiting" | "canceled" | "confirmed";
    propertyType?: string;
    houseId: string;
    traveler_details: IPassenger[];
}