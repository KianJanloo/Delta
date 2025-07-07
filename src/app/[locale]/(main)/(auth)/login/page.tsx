import AuthHeader from '@/components/auth/authHeader'
import RegisterForm from '@/components/auth/registerForm'
import TabContent from '@/components/auth/tabContent'
import React from 'react'
import { useTranslations } from 'next-intl'

const LoginPage = () => {
  const t = useTranslations('auth.loginPage');

  return (
    <div>
      <AuthHeader pageName={t('pageName')} />
      <TabContent registerElement={<RegisterForm />} defaultValue='login' />
    </div>
  )
}

export default LoginPage