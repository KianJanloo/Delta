import { create } from "zustand"
import { ICreateHouse } from "@/types/houses-type/house-type"
import Cookies from "js-cookie";

interface HouseState {
  data: Partial<ICreateHouse>
  setData: (values: Partial<ICreateHouse>) => void
  reset: () => void
}

const getHouse = Cookies.get("house");

export const useHouseStore = create<HouseState>((set) => ({
  data: getHouse ? JSON.parse(getHouse) : {},
  setData: (values) => set((state) => ({ data: { ...state.data, ...values } })),
  reset: () => set({ data: {} }),
}))

useHouseStore.subscribe((state) => {
  const house = state.data;
  if (house) {
    Cookies.set("house", JSON.stringify(house), { expires: 7 });
  } else {
    Cookies.remove("house");
  }
});