import AuthHeader from '@/components/auth/authHeader'
import RegisterForm from '@/components/auth/registerForm'
import TabContent from '@/components/auth/tabContent'
import VerifyPasswordForm from '@/components/auth/verifyPasswordForm'
import React from 'react'

const VerifyPassword = () => {
  return (
    <div>
      <AuthHeader pageName={" تغییر رمز عبور "} />
      <TabContent registerElement={<RegisterForm />} forgetPasswordElement={<VerifyPasswordForm />} defaultValue='forget-password' />
    </div>
  )
}

export default VerifyPassword
