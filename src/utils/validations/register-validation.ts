import { z } from 'zod';

export const schemaRegisterValidation = z.object({
    email: z.string({ required_error: ' لطفا ایمیل خود را وارد کنید ' }).email({ message: 'ایمیل نادرست است' }).min(1, ' لطفا ایمیل خود را وارد کنید ')
});

export const schemaCompleteRegisterValidation = z.object({
    password: z.string({ required_error: ' لطفا رمز عبور خود را وارد کنید ' }).min(1, ' لطفا رمز عبور خود را وارد کنید '),
    phoneNumber: z.string({ required_error: ' لطفا شماره تلفن خود را وارد کنید ' }).min(10, ' شماره تلفن نادرست است ').max(10, " شماره تلفن نادرست است "),
});

