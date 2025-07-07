export const discountPrice = (price: number, discount: number) => {
    const discountValue = discount || 0;
    return price - (price * discountValue / 100);
}