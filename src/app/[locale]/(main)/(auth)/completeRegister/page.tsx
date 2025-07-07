import AuthHeader from '@/components/auth/authHeader'
import CompleteRegisterForm from '@/components/auth/completeRegisterForm'
import TabContent from '@/components/auth/tabContent'
import React from 'react'
import { useTranslations } from 'next-intl'

const CompleteRegister = () => {
    const t = useTranslations('auth.completeRegisterPage');

    return (
        <div>
            <AuthHeader pageName={t('pageName')} />
            <TabContent defaultValue="register" registerElement={<CompleteRegisterForm />} />
        </div>
    )
}

export default CompleteRegister