export const publicRoutes = ["/", "/login", "/verifyCode", "/completeRegister"];

const dashboardSubRoutes = [
  "",
  "favorites",
  "profile",
  "payments",
  "manage-reserves",
  "notifications",
  "my-comments",
  "seller",
  "seller/profile",
  "seller/manage-houses",
  "seller/manage-houses/my-houses",
  "seller/manage-houses/add-houses",
  "seller/manage-reserves",
  "seller/payments",
  "seller/manage-comments",
  "seller/notifications",
];

export const privateRoutes = dashboardSubRoutes.map(
  (sub) => `/dashboard${sub ? `/${sub}` : ""}`
);

export const authRoutes = ["/login", "/verifyCode", "/completeRegister"];
