import { z } from "zod";

export const SendPasswordValidation = z.object({
  email: z
    .string({ required_error: " لطفا ایمیل خود را وارد کنید " })
    .email(" لطفا ایمیل صحیح را وارد کنید ")
    .min(1, " لطفا ایمیل خود را وارد کنید "),
});
