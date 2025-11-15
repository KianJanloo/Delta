'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { 
  HomeIcon, 
  TrophyIcon, 
  ClockIcon, 
  SmileIcon,
  Users,
  Target,
  Heart,
  Award,
  TrendingUp,
  Shield,
  Sparkles
} from 'lucide-react'
import { BlurFade } from '@/components/magicui/blur-fade'
import Image from 'next/image'
import arrow from '@/assets/arrow.svg'

const AboutComponent = () => {
  const t = useTranslations('about')

  const stats = [
    {
      icon: <HomeIcon className="w-8 h-8 text-primary" />,
      value: t('stats.activeHouses'),
      label: t('stats.activeHousesLabel'),
      color: 'bg-primary/10'
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      value: t('stats.happyCustomers'),
      label: t('stats.happyCustomersLabel'),
      color: 'bg-accent/10'
    },
    {
      icon: <TrophyIcon className="w-8 h-8 text-primary" />,
      value: t('stats.yearsExperience'),
      label: t('stats.yearsExperienceLabel'),
      color: 'bg-primary/10'
    },
    {
      icon: <Award className="w-8 h-8 text-primary" />,
      value: t('stats.awards'),
      label: t('stats.awardsLabel'),
      color: 'bg-accent/10'
    }
  ]

  const values = [
    {
      icon: <Heart className="w-10 h-10 text-primary" />,
      title: t('values.trust.title'),
      description: t('values.trust.description'),
      color: 'bg-danger/10'
    },
    {
      icon: <Shield className="w-10 h-10 text-primary" />,
      title: t('values.security.title'),
      description: t('values.security.description'),
      color: 'bg-primary/10'
    },
    {
      icon: <TrendingUp className="w-10 h-10 text-primary" />,
      title: t('values.innovation.title'),
      description: t('values.innovation.description'),
      color: 'bg-accent/10'
    },
    {
      icon: <Sparkles className="w-10 h-10 text-primary" />,
      title: t('values.excellence.title'),
      description: t('values.excellence.description'),
      color: 'bg-primary/10'
    }
  ]

  const features = [
    {
      icon: <ClockIcon className="w-10 h-10 text-primary" />,
      title: t('features.support.title'),
      description: t('features.support.description')
    },
    {
      icon: <Target className="w-10 h-10 text-primary" />,
      title: t('features.accuracy.title'),
      description: t('features.accuracy.description')
    },
    {
      icon: <SmileIcon className="w-10 h-10 text-primary" />,
      title: t('features.satisfaction.title'),
      description: t('features.satisfaction.description')
    }
  ]

  return (
    <div className="w-full flex flex-col gap-16 px-8 py-8">
      <BlurFade delay={0.1}>
        <div className="flex justify-center items-center gap-2 py-4 text-primary">
          <Image
            src={arrow}
            className="w-16 h-16 rotate-180 text-primary hidden dark:inline"
            alt="arrow"
          />
          <div className="flex gap-1 rotate-180 justify-center items-center dark:hidden">
            <svg
              width="48"
              height="17"
              viewBox="0 0 48 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="fill-primary"
                d="M45 10.1598C46.3333 9.38998 46.3333 7.46548 45 6.69568L39 3.23158C37.6667 2.46178 36 3.42403 36 4.96363L36 11.8918C36 13.4314 37.6667 14.3937 39 13.6239L45 10.1598Z"
              />
              <path
                d="M23.75 9.72677C24.75 9.14942 24.75 7.70605 23.75 7.1287L19.25 4.53062C18.25 3.95327 17 4.67496 17 5.82966L17 11.0258C17 12.1805 18.25 12.9022 19.25 12.3248L23.75 9.72677Z"
                className="fill-primary"
                fillOpacity="0.5"
              />
              <path
                d="M6.5 9.29376C7.16667 8.90886 7.16667 7.94661 6.5 7.56171L3.5 5.82966C2.83333 5.44476 2 5.92588 2 6.69568L2 10.1598C2 10.9296 2.83333 11.4107 3.5 11.0258L6.5 9.29376Z"
                className="fill-primary"
                fillOpacity="0.25"
              />
            </svg>
          </div>
          <span className="text-sm font-semibold">{t('title')}</span>
          <div className="flex gap-1 justify-center items-center dark:hidden">
            <svg
              width="48"
              height="17"
              viewBox="0 0 48 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M45 10.1598C46.3333 9.38998 46.3333 7.46548 45 6.69568L39 3.23158C37.6667 2.46178 36 3.42403 36 4.96363L36 11.8918C36 13.4314 37.6667 14.3937 39 13.6239L45 10.1598Z"
                className="fill-primary"
              />
              <path
                d="M23.75 9.72677C24.75 9.14942 24.75 7.70605 23.75 7.1287L19.25 4.53062C18.25 3.95327 17 4.67496 17 5.82966L17 11.0258C17 12.1805 18.25 12.9022 19.25 12.3248L23.75 9.72677Z"
                className="fill-primary"
                fillOpacity="0.5"
              />
              <path
                d="M6.5 9.29376C7.16667 8.90886 7.16667 7.94661 6.5 7.56171L3.5 5.82966C2.83333 5.44476 2 5.92588 2 6.69568L2 10.1598C2 10.9296 2.83333 11.4107 3.5 11.0258L6.5 9.29376Z"
                className="fill-primary"
                fillOpacity="0.25"
              />
            </svg>
          </div>
          <Image
            src={arrow}
            className="w-16 h-16 text-primary hidden dark:inline"
            alt="arrow"
          />
        </div>
      </BlurFade>

      <BlurFade delay={0.2}>
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-foreground">
            {t('hero.title')}
          </h1>
          <p className="text-lg md:text-xl text-subText leading-relaxed">
            {t('hero.description')}
          </p>
        </div>
      </BlurFade>

      <BlurFade delay={0.3}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`${stat.color} rounded-2xl p-6 flex flex-col items-center gap-4 text-center border border-border/50 hover:shadow-lg transition-all duration-300`}
            >
              <div className="p-3 rounded-xl bg-background">
                {stat.icon}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-3xl font-bold text-foreground">{stat.value}</span>
                <span className="text-sm text-subText">{stat.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </BlurFade>

      <BlurFade delay={0.4}>
        <div className="bg-secondary-light2 rounded-[32px] p-8 md:p-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-foreground">
              {t('story.title')}
            </h2>
            <div className="space-y-4 text-subText leading-relaxed">
              <p className="text-base md:text-lg">{t('story.paragraph1')}</p>
              <p className="text-base md:text-lg">{t('story.paragraph2')}</p>
              <p className="text-base md:text-lg">{t('story.paragraph3')}</p>
            </div>
          </div>
        </div>
      </BlurFade>

      <BlurFade delay={0.5}>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-foreground">
            {t('values.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`${value.color} rounded-2xl p-6 flex flex-col gap-4 border border-border/50 hover:shadow-lg transition-all duration-300`}
              >
                <div className="p-3 rounded-xl bg-background w-fit">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground">{value.title}</h3>
                <p className="text-sm text-subText leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </BlurFade>

      <BlurFade delay={0.6}>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-foreground">
            {t('features.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-secondary-light2 rounded-2xl p-6 flex flex-col gap-4 border border-border/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="p-3 rounded-xl bg-primary/10 w-fit">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                <p className="text-sm text-subText leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </BlurFade>

      <BlurFade delay={0.7}>
        <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-[32px] p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
            {t('cta.title')}
          </h2>
          <p className="text-lg text-subText mb-6 max-w-2xl mx-auto">
            {t('cta.description')}
          </p>
        </div>
      </BlurFade>
    </div>
  )
}

export default AboutComponent
