export interface IProfile {
    id: string,
    role: string,
    membershipDate: Date | null,
    email: string,
    phoneNumber: string | null,
    emailVerified: boolean,
    verificationCode: null | string,
    verificationCodeExpires: null | string,
    fullName: string,
    firstName: string,
    lastName: string,
    profilePicture: null | string,
    createdAt: string | Date,
    updatedAt: string | Date
}

export interface IEditProfile {
    email?: string,
    password?: string,
    role?: string,
    fullName?: string,
    firstName?: string,
    lastName?: string,
    phoneNumber?: string,
    profilePicture?: string | null
}

export interface IPublicProfile {
    id: string,
    role: string,
    profilePicture: string,
    name: string
}