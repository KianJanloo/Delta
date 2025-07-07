import { z } from "zod";

export const houseSchema = z.object({
  title: z
    .string({ required_error: "عنوان الزامی است" })
    .min(1, "عنوان الزامی است"),
  address: z
    .string({ required_error: "آدرس الزامی است" })
    .min(1, "آدرس الزامی است"),
  photos: z
    .array(z.string({ required_error: "لینک عکس نامعتبر است" }))
    .min(1, "حداقل یک عکس نیاز است"),
  price: z
    .string({ required_error: "قیمت الزامی است" })
    .min(1, "قیمت الزامی است"),
  tags: z.array(z.string()).optional(),
  capacity: z.coerce
    .number({ required_error: "ظرفیت الزامی است" })
    .min(1, "ظرفیت نمی‌تواند کمتر از 1 باشد"),
  location: z.object({
    lat: z.number({ required_error: "مختصات عرض جغرافیایی الزامی است" }),
    lng: z.number({ required_error: "مختصات طول جغرافیایی الزامی است" }),
  }),
  category: z.string({ required_error: "نام دسته‌بندی الزامی است" }),
  bathrooms: z.coerce
    .number({ required_error: "تعداد سرویس بهداشتی الزامی است" })
    .min(0, "تعداد سرویس نمی‌تواند منفی باشد"),
  parking: z.coerce
    .number({ required_error: "تعداد پارکینگ الزامی است" })
    .min(0, "تعداد پارکینگ نمی‌تواند منفی باشد"),
  rooms: z.coerce
    .number({ required_error: "تعداد اتاق الزامی است" })
    .min(0, "تعداد اتاق نمی‌تواند منفی باشد"),
  yard_type: z
    .string({ required_error: "نوع حیاط الزامی است" })
    .min(1, "نوع حیاط الزامی است"),
  transaction_type: z
    .string({ required_error: "نوع معامله الزامی است" })
    .min(1, "نوع معامله الزامی است"),
  caption: z
    .string({ required_error: "توضیحات الزامی است" })
    .min(1, "توضیحات الزامی است"),
});
