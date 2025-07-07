import { IBook, IPassenger } from "@/utils/zustand/booking";

export interface IFirstStep {
    book: IBook,
    handleCurrentStepIncrease: () => void,
    addPassenger?: (passenger: IPassenger) => void;
    setSharedMobile?: (mobile: string) => void;
    setSharedEmail?: (email: string) => void;
    removeBooking?: () => void;
}

export interface IAddPassenger {
    book: IBook;
    addPassenger?: (passenger: IPassenger) => void;
}

export interface ISharedInfo {
    book: IBook;
    setSharedMobile?: (mobile: string) => void;
    setSharedEmail?: (email: string) => void;
}

export interface IShared {
    email: string;
    mobile: string;
}

export interface IPriceSection {
    book: IBook;
    removeBooking?: () => void;
}

export interface ISecondStep {
    handleCurrentStepIncrease: () => void,
    handleCurrentSteDecrease: () => void,
    book: IBook
}

export interface ITablePassengers {
    book: IBook;
}