import { Routes } from "@/types/routes-type/routes-type";
import {
  BellDot,
  Coins,
  FileText,
  Heart,
  Home,
  House,
  HousePlus,
  LayoutDashboard,
  ListChecks,
  Mail,
  MapPin,
  Percent,
  PlusCircle,
  Settings,
  Share2,
  SquaresSubtract,
  Tag,
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
  {
    label: "manageComments",
    href: "/dashboard/seller/manage-comments",
    icon: SquaresSubtract,
  },
  { label: "notifications", href: "/dashboard/notifications", icon: BellDot },
] as Routes[];

export const adminRoutes = [
  { label: "adminOverview", href: "/dashboard/admin", icon: LayoutDashboard },
  { label: "adminUsers", href: "/dashboard/admin/users", icon: Users2 },
  {
    label: "adminProperties",
    href: "/dashboard/admin/properties",
    icon: House,
  },
  {
    label: "adminBookings",
    href: "/dashboard/admin/bookings",
    icon: ListChecks,
  },
  { label: "adminPayments", href: "/dashboard/admin/payments", icon: Coins },
  {
    label: "adminDocuments",
    href: "/dashboard/admin/documents",
    icon: FileText,
  },
  { label: "adminCategories", href: "/dashboard/admin/categories", icon: Tag },
  { label: "adminLocations", href: "/dashboard/admin/locations", icon: MapPin },
  {
    label: "adminDiscountCodes",
    href: "/dashboard/admin/discount-codes",
    icon: Percent,
  },
  {
    label: "adminSocialMedias",
    href: "/dashboard/admin/social-medias",
    icon: Share2,
  },
  { label: "adminContact", href: "/dashboard/admin/contact-us", icon: Mail },
] as Routes[];
