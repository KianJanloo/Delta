export interface IDashboardSummary {
    "houses": number,
    "users": {
        "userCount": number,
        "sellers": number,
        "buyers": number,
        "admins": number
    },
    "bookings": {
        "bookingCount": number,
        "conformedBookings": number,
        "canceledBookings": number,
        "pendingBookings": number
    },
    "comments": number,
    "averageRating": string
}