export interface ICreatePayment {
  amount: number,
  description: string,
  callbackUrl: string,
  bookingId: number
}