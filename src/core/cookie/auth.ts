'use server'

import { cookies } from "next/headers"

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7 // 7 days
}

export const setToken = async (token: string) => {
  const cookieStore = await cookies()
  cookieStore.set('token', token, COOKIE_OPTIONS)
}

export const getToken = async () => {
  const cookieStore = await cookies()
  return cookieStore.get('token')?.value
}

export const removeToken = async () => {
  const cookieStore = await cookies()
  cookieStore.delete('token')
}

export const clearAllCookies = async () => {
  const cookieStore = await cookies()
  const cookiesList = cookieStore.getAll()
  
  for (const cookie of cookiesList) {
    cookieStore.delete(cookie.name)
  }
}
