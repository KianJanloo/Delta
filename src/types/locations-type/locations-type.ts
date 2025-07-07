export interface ILocation {
    id: string,
    area_name: string,
    lat: string | null,
    lng: string | null
}

export interface ICreateLocation {
  area_name: string,
  lat: number,
  lng: number
}