import AuthHeader from '@/components/auth/authHeader'
import TabContent from '@/components/auth/tabContent'
import VerifyForm from '@/components/auth/verifyForm'
import React from 'react'
import { useTranslations } from 'next-intl'

const VerifyCode = () => {
    const t = useTranslations('auth.verifyPage');

    return (
        <div>
            <AuthHeader pageName={t('pageName')} />
            <TabContent defaultValue="register" registerElement={<VerifyForm />} />
        </div>
    )
}

export default VerifyCode