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
    status: "confirmed" | "waiting" | "cancelled";
    paymentStatus: "paid" | "waiting" | "cancelled" | "confirmed";
    propertyType?: string;
    houseId: string;
    traveler_details: IPassenger[];
}