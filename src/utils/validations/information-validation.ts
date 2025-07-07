import { z } from "zod";

export const informationValidation = z.object({
    firstName: z.string({ required_error: "نام خود را وارد کنید" }).min(1, { message: "نام خود را وارد کنید" }),
    lastName: z.string({ required_error: "نام خانوادگی خود را وارد کنید" }).min(1, { message: "نام خانوادگی خود را وارد کنید" }),
    phoneNumber: z.string({ required_error: "شماره تلفن خود را وارد کنید" }).min(11, { message: "شماره تلفن خود را به درستی وارد کنید" }),
    email: z.string({ required_error: "ایمیل خود را وارد کنید" }).email({ message: "ایمیل خود را وارد کنید" }),
})