// Auth APIs
export * from './auth/login';
export * from './auth/register';
export * from './auth/verifyEmail';
export * from './auth/completeRegistration';
export * from './auth/logout';
export * from './auth/refresh';

// Forget Password APIs
export * from './forget-password/sendCodePassword';
export * from './forget-password/verifyRequest';
export * from './forget-password/resetPassword';

// Booking APIs
export * from './booking/getAllBookings';
export * from './booking/getBookingById';
export * from './booking/getCustomersBookings';
export * from './booking/createBook';
export * from './booking/updateBooking';
export * from './booking/deleteBooking';
export * from './booking/changeStatusBook';

// Dashboard APIs
export * from './dashboard/getDashboardSummary';
export * from './dashboard/getMarketTrends';

// Favorites APIs
export * from './favorites/addFavorite';
export * from './favorites/getFavoritesByUserId';
export * from './favorites/removeFavorite';

// Houses APIs
export * from './houses/createHouse';
export * from './houses/editHouse';
export * from './houses/deleteHouse';
export * from './houses/getMyHouses';
export * from './houses/uploadPhotos';
export * from './houses/checkAvailability';
export * from './houses/geoSearch';
export * from './houses/getByRating';

// Locations APIs
export * from './locations/createLocation';
export * from './locations/editLocation';
export * from './locations/getAllLocations';
export * from './locations/getLocationById';
export * from './locations/removeLocation';

// Payment APIs
export * from './payment/createPayment';
export * from './payment/getPayments';
export * from './payment/getPaymentById';
export * from './payment/verifyPayment';

// Notifications APIs
export * from './notifications/getNotifications';
export * from './notifications/markAsRead';
export * from './notifications/sendNotification';

// Profile APIs
export * from './profile/getProfileById';
export * from './profile/editProfile';
export * from './profile/uploadPicture';
export * from './profile/security';

// Seller Finance APIs
export * from './seller-finance/getAllCustomersPayments';
export * from './seller-finance/getDashboardFinance';

// Contact Us APIs
export * from './contact-us/createContactMessage';

// Seller Upgrade APIs
export * from './seller-upgrade/upgradeToSeller';
export * from './seller-upgrade/verifySellerUpgrade';

// Comments APIs
export * from './comments/getComments';
export * from './comments/createComment';
export * from './comments/deleteComment';
export * from './comments/updateComment';

// Categories APIs
export * from './categories/getAllCategories';
export * from './categories/getCategory';
export * from './categories/deleteCategory';
export * from './categories/updateCategory';

// Discount APIs
export * from './discount/getAllDiscounts';
export * from './discount/findDiscount';

// Properties APIs
export * from './properties/getProperties';

// Saved Searches APIs
export * from './saved-searches/getAllSavedSearches';
export * from './saved-searches/createSavedSearch';
export * from './saved-searches/deleteSavedSearch';

// Comparison APIs
export * from './comparison/getComparison';
