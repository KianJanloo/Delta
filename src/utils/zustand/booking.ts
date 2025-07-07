import { IHouse } from "@/types/houses-type/house-type";
import { create } from "zustand";
import Cookies from "js-cookie";

interface IBooking {
    book?: IBook | null;
    setHouse: (house: IHouse | null) => void;
    setReservedDates: (startDate: string, endDate: string) => void;
    setCountPassengers?: (count: number) => void;
    addPassenger?: (passenger: IPassenger) => void;
    removeBooking?: () => void;
    setSharedMobile?: (mobile: string) => void;
    setSharedEmail?: (email: string) => void;
    setStep?: (step: number) => void;
    updatePassenger?: (passenger: IPassenger) => void;
    setDiscount?: (discount: string) => void;
}

export interface IBook {
    house?: IHouse | null;
    reservedDates?: [string, string] | null;
    countPassengers?: number;
    passengers?: IPassenger[];
    sharedEmail?: string;
    sharedMobile?: string;
    step?: number;
    discount?: string;
}

export interface IPassenger {
    firstName: string;
    lastName: string;
    gender?: string;
    birthDate?: Date;
    nationalId: string;
}

const getBook = Cookies.get("book");

const useBooking = create<IBooking>((set) => ({
    book: getBook ? JSON.parse(getBook) : null,
    setHouse: (house) => set((state) => ({ book: { ...state.book, house } })),
    setReservedDates: (startDate, endDate) => set((state) => ({
        book: { ...state.book, reservedDates: [startDate, endDate] }
    })),
    setCountPassengers: (count) => set((state) => ({
        book: { ...state.book, countPassengers: count }
    })),
    addPassenger: (passenger) => set((state) => ({
        book: { ...state.book, passengers: [...(state.book?.passengers || []), passenger] }
    })),
    removeBooking: () => set(() => ({ book: null })),
    setSharedMobile: (mobile) => set((state) => ({
        book: { ...state.book, sharedMobile: mobile }
    })),
    setSharedEmail: (email) => set((state) => ({
        book: { ...state.book, sharedEmail: email }
    })),
    setStep: (step) => set((state) => ({
        book: { ...state.book, step }
    })),
    updatePassenger: (passenger) => set((state) => ({
        book: { ...state.book, passengers: state.book?.passengers?.map(p => p.nationalId === passenger.nationalId ? passenger : p) || [] }
    })),
    setDiscount: (discount) => set((state) => ({
        book: { ...state.book, discount }
    }))
}));

useBooking.subscribe((state) => {
    const book = state.book;
    if (book) {
        Cookies.set("book", JSON.stringify(book), { expires: 7 });
    } else {
        Cookies.remove("book");
    }
});

export { useBooking }