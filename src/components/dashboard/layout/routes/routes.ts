/* eslint-disable */

import { Routes } from "@/types/routes-type/routes-type";
import { BellDot, Coins, Heart, Home, House, HousePlus, PlusCircle, Settings, SquaresSubtract, User } from "lucide-react";

export const routes = [
  { label: "dashboard", href: `/dashboard`, icon: Home },
  { label: "profile", href: "/dashboard/profile", icon: User },
  { label: "manageReserves", href: "/dashboard/manage-reserves", icon: PlusCircle },
  { label: "favorites", href: "/dashboard/favorites", icon: Heart },
  { label: "payments", href: "/dashboard/payments", icon: Coins },
  { label: "notifications", href: "/dashboard/notifications", icon: BellDot },
] as Routes[]

export const sellerRoutes = [
  { label: "dashboard", href: "/dashboard/seller", icon: Home },
  { label: "profile", href: "/dashboard/profile", icon: User },
  {
    label: "manageHouses", href: "/dashboard/seller/manage-houses", icon: Settings, children: [
      { label: "myHouses", href: "/dashboard/seller/manage-houses/my-houses", icon: House },
      { label: "addHouse", href: "/dashboard/seller/manage-houses/add-houses", icon: HousePlus },
    ]
  },
  { label: "manageReserves", href: "/dashboard/seller/manage-reserves", icon: PlusCircle },
  { label: "payments", href: "/dashboard/seller/payments", icon: Coins },
  { label: "manageComments", href: "/dashboard/seller/manage-comments", icon: SquaresSubtract },
  { label: "notifications", href: "/dashboard/seller/notifications", icon: BellDot },
] as Routes[]