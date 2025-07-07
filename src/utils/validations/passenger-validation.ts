import { z } from "zod";

export const passengerValidation = z.object({
    firstName: z.string({ required_error: "نام باید وارد شود" })
        .min(1, "نام باید وارد شود")
        .max(50, "نام باید کمتر از ۵۰ کاراکتر باشد"),
    lastName: z.string({ required_error: "نام خانوادگی باید وارد شود" })
        .min(1, "نام خانوادگی باید وارد شود")
        .max(50, "نام خانوادگی باید کمتر از ۵۰ کاراکتر باشد"),
    nationalId: z.string({ required_error: "کد ملی باید وارد شود" })
        .min(1, "کد ملی باید وارد شود")
        .min(10, "کد ملی باید ۱۰ کاراکتر باشد")
        .max(10, "کد ملی باید ۱۰ کاراکتر باشد")
})