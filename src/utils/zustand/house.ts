import { create } from "zustand";
import { ICreateHouse } from "@/types/houses-type/house-type";
import Cookies from "js-cookie";

interface HouseState {
  data: Partial<ICreateHouse>;
  setData: (values: Partial<ICreateHouse>) => void;
  reset: () => void;
}

interface HouseIdState {
  houseId: null | number;
  setHouseId: (id: number) => void;
  deleteHouseId: () => void;
}

const getHouse = Cookies.get("house");
const getHouseId = Cookies.get("houseId");

export const useHouseStore = create<HouseState>((set) => ({
  data: getHouse ? JSON.parse(getHouse) : {},
  setData: (values) => set((state) => ({ data: { ...state.data, ...values } })),
  reset: () => set({ data: {} }),
}));

export const useHouseIdStore = create<HouseIdState>((set) => ({
  houseId: getHouseId ? JSON.parse(getHouseId) : null,
  setHouseId: (id: number) => set({ houseId: id }),
  deleteHouseId: () => set({ houseId: null }),
}));

useHouseStore.subscribe((state) => {
  const house = state.data;
  if (house) {
    Cookies.set("house", JSON.stringify(house), { expires: 7 });
  } else {
    Cookies.remove("house");
  }
});

useHouseIdStore.subscribe((state) => {
  const houseId = state.houseId;
  if (houseId) {
    Cookies.set("houseId", JSON.stringify(houseId), { expires: 7 });
  } else {
    Cookies.remove("houseId");
  }
});
