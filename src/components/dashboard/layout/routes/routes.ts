import { Routes } from "@/types/routes-type/routes-type";
import {
  BellDot,
  Coins,
  Heart,
  Home,
  House,
  HousePlus,
  LayoutDashboard,
  ListChecks,
  Megaphone,
  PlusCircle,
  Settings,
  Settings2,
  ShieldCheck,
  SquaresSubtract,
  User,
  Users2,
} from "lucide-react";

export const routes = [
  { label: "dashboard", href: `/dashboard`, icon: Home },
  { label: "profile", href: "/dashboard/profile", icon: User },
  {
    label: "manageReserves",
    href: "/dashboard/manage-reserves",
    icon: PlusCircle,
  },
  { label: "favorites", href: "/dashboard/favorites", icon: Heart },
  { label: "payments", href: "/dashboard/payments", icon: Coins },
  { label: "notifications", href: "/dashboard/notifications", icon: BellDot },
] as Routes[];

export const sellerRoutes = [
  { label: "dashboard", href: "/dashboard/seller", icon: Home },
  { label: "profile", href: "/dashboard/profile", icon: User },
  {
    label: "manageHouses",
    href: "/dashboard/seller/manage-houses",
    icon: Settings,
    children: [
      {
        label: "myHouses",
        href: "/dashboard/seller/manage-houses/my-houses",
        icon: House,
      },
      {
        label: "addHouse",
        href: "/dashboard/seller/manage-houses/add-houses",
        icon: HousePlus,
      },
    ],
  },
  {
    label: "manageReserves",
    href: "/dashboard/seller/manage-reserves",
    icon: PlusCircle,
  },
  { label: "payments", href: "/dashboard/seller/payments", icon: Coins },
  { label: "manageComments", href: "/dashboard/seller/manage-comments", icon: SquaresSubtract },
  { label: "notifications", href: "/dashboard/notifications", icon: BellDot },
] as Routes[];

export const adminRoutes = [
  { label: "adminOverview", href: "/dashboard/admin", icon: LayoutDashboard },
  { label: "adminUsers", href: "/dashboard/admin/users", icon: Users2 },
  { label: "adminProperties", href: "/dashboard/admin/properties", icon: House },
  { label: "adminBookings", href: "/dashboard/admin/bookings", icon: ListChecks },
  { label: "adminPayments", href: "/dashboard/admin/payments", icon: Coins },
  { label: "adminContent", href: "/dashboard/admin/content", icon: Megaphone },
  { label: "adminModeration", href: "/dashboard/admin/moderation", icon: ShieldCheck },
  { label: "adminSettings", href: "/dashboard/admin/settings", icon: Settings2 },
] as Routes[];
