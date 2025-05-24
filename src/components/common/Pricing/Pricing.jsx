'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Zap, Star, BadgeCheck, Sparkles } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const PricingHeader = ({ title, subtitle }) => (
  <motion.section 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="text-center mb-12"
  >
    <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
      {title}
    </h2>
    <p className="text-xl text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
      {subtitle}
    </p>
  </motion.section>
);

const PricingSwitch = ({ isYearly, setIsYearly }) => (
  <div className="flex justify-center mb-12">
    <div className="relative bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
      <Tabs 
        defaultValue="monthly" 
        className="relative"
        onValueChange={(value) => setIsYearly(value === 'yearly')}
      >
        <TabsList className="relative bg-transparent p-0 h-auto">
          <TabsTrigger 
            value="monthly" 
            className="relative z-10 px-6 py-2 text-sm font-medium rounded-full data-[state=active]:text-white"
          >
            Monthly
          </TabsTrigger>
          <TabsTrigger 
            value="yearly" 
            className="relative z-10 px-6 py-2 text-sm font-medium rounded-full data-[state=active]:text-white"
          >
            <div className="flex items-center gap-1">
              Yearly 
              <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">
                Save 10%
              </span>
            </div>
          </TabsTrigger>
        </TabsList>
        <motion.div
          layout
          className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          animate={{ x: isYearly ? '100%' : '0%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </Tabs>
    </div>
  </div>
);

const PricingCard = ({ 
  isYearly, 
  title, 
  monthlyPrice, 
  yearlyPrice, 
  description, 
  features, 
  actionLabel, 
  popular, 
  exclusive,
  highlight
}) => {
  const price = isYearly && yearlyPrice !== undefined ? yearlyPrice : monthlyPrice;
  const period = isYearly ? '/year' : monthlyPrice !== undefined ? '/month' : '';
  
  const yearlySavings = isYearly && yearlyPrice && monthlyPrice ? 
    Math.round((1 - yearlyPrice / (monthlyPrice * 12)) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="relative"
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
          <div className="px-4 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center">
            <Star className="w-3 h-3 mr-1" />
            MOST POPULAR
          </div>
        </div>
      )}
      
      {exclusive && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
          <div className="px-4 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center">
            <Sparkles className="w-3 h-3 mr-1" />
            EXCLUSIVE
          </div>
        </div>
      )}
      
      <Card
        className={cn(
          'w-full max-w-sm flex flex-col justify-between py-1 mx-auto sm:mx-0 h-full',
          popular ? 'border-2 border-blue-500 shadow-lg' : 'border border-gray-200 dark:border-gray-700',
          exclusive && 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-900',
          highlight && 'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900'
        )}
      >
        <div>
          <CardHeader className="pb-6 pt-8">
            <CardTitle className={cn(
              "text-2xl font-bold text-center",
              popular ? "text-blue-600 dark:text-blue-400" : "text-gray-800 dark:text-gray-200",
              exclusive && "text-orange-600 dark:text-orange-400"
            )}>
              {title}
            </CardTitle>
            
            <div className="flex justify-center items-end mt-6">
              <h3 className="text-4xl font-bold text-gray-900 dark:text-white">
                {price !== undefined ? `$${price}` : 'Custom'}
              </h3>
              {price !== undefined && (
                <span className="text-lg text-gray-500 dark:text-gray-400 ml-1 mb-1">
                  {period}
                </span>
              )}
            </div>
            
            {isYearly && yearlySavings > 0 && (
              <p className="text-center text-green-600 dark:text-green-400 text-sm mt-2">
                Save {yearlySavings}% annually
              </p>
            )}
            
            <CardDescription className="text-center mt-4 text-gray-600 dark:text-gray-300">
              {description}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex flex-col gap-3">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={cn(
                  'flex items-start gap-3 p-2 rounded-lg',
                  !feature.available ? 'opacity-60' : 'bg-white dark:bg-gray-800/50'
                )}
              >
                <div className={cn(
                  'p-1 rounded-full',
                  feature.available ? 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400' : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                )}>
                  <CheckCircle2 size={16} />
                </div>
                <p className={cn(
                  'text-sm',
                  feature.available ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-500 line-through'
                )}>
                  {feature.text}
                </p>
              </div>
            ))}
          </CardContent>
        </div>
        
        <CardFooter className="mt-4 p-6 pt-0">
          <Button
            className={cn(
              "w-full h-12 text-lg font-medium rounded-xl",
              popular ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" : 
              exclusive ? "bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600" :
              "bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-800"
            )}
            size="lg"
          >
            {actionLabel}
            {popular && <Zap className="w-4 h-4 ml-2 fill-current" />}
            {exclusive && <BadgeCheck className="w-4 h-4 ml-2" />}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const PricingSection = ({ title, plans, isYearly }) => (
  <div className="mb-16">
    <h3 className="text-2xl font-bold text-center mb-8 text-gray-800 dark:text-white">
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {plans.map((plan, index) => (
        <PricingCard 
          key={plan.title} 
          {...plan} 
          isYearly={isYearly} 
          highlight={index === 1}
        />
      ))}
    </div>
  </div>
);

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);

  const userPricingTiers = [
    {
      title: 'Basic',
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: 'Essential features for job seekers',
      features: [
        { text: 'Apply to 5 jobs per day', available: true },
        { text: 'Basic job search filters', available: true },
        { text: 'Email notifications', available: true },
        { text: 'AI resume enhancer', available: false },
        { text: 'Top applicant priority', available: false },
      ],
      actionLabel: 'Get Started',
      userType: 'User',
    },
    {
      title: 'Standard',
      monthlyPrice: 10,
      yearlyPrice: 108, // 10% discount
      description: 'Enhanced access for active job seekers',
      features: [
        { text: 'Apply to 20 jobs per day', available: true },
        { text: 'Advanced job search filters', available: true },
        { text: 'Cancel anytime', available: true },
        { text: 'Priority customer support', available: true },
        { text: 'AI resume enhancer', available: false },
        { text: 'Top applicant priority', available: false },
      ],
      actionLabel: 'Upgrade Now',
      popular: true,
      userType: 'User',
    },
    {
      title: 'Premium',
      monthlyPrice: 50,
      yearlyPrice: 540, // 10% discount
      description: 'Unlimited applications with AI enhancements',
      features: [
        { text: 'Unlimited job applications', available: true },
        { text: 'AI resume enhancer', available: true },
        { text: 'Top applicant priority', available: true },
        { text: 'Dedicated career advisor', available: true },
        { text: 'Exclusive job listings', available: true },
        { text: 'Interview preparation tools', available: true },
      ],
      actionLabel: 'Get Premium',
      userType: 'User',
    },
  ];

  const recruiterPricingTiers = [
    {
      title: 'Basic',
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: 'Get started with job postings',
      features: [
        { text: 'Post 1 job per day', available: true },
        { text: 'Basic candidate management', available: true },
        { text: 'Email notifications', available: true },
        { text: 'AI job description', available: false },
        { text: 'Candidate endorsements', available: false },
      ],
      actionLabel: 'Start Posting',
      userType: 'Recruiter',
    },
    {
      title: 'Standard',
      monthlyPrice: 25,
      yearlyPrice: 270, // 10% discount
      description: 'Ideal for small hiring teams',
      features: [
        { text: 'Post 5 jobs per day', available: true },
        { text: 'Advanced candidate management', available: true },
        { text: 'Cancel anytime', available: true },
        { text: 'Priority customer support', available: true },
        { text: 'Basic AI job description', available: true },
        { text: 'Candidate endorsements ($3 each)', available: true },
      ],
      actionLabel: 'Choose Standard',
      popular: true,
      userType: 'Recruiter',
    },
    {
      title: 'Premium',
      monthlyPrice: 50,
      yearlyPrice: 540, // 10% discount
      description: 'Advanced tools for large hiring teams',
      features: [
        { text: 'Post 20 jobs per day', available: true },
        { text: 'Advanced AI job description', available: true },
        { text: 'Free candidate endorsements', available: true },
        { text: 'Talent analytics dashboard', available: true },
        { text: 'Dedicated account manager', available: true },
        { text: 'Branded career page', available: true },
      ],
      actionLabel: 'Go Premium',
      userType: 'Recruiter',
    },
    {
      title: 'Enterprise',
      description: 'Tailored solutions for your needs',
      features: [
        { text: 'Custom job posting limits', available: true },
        { text: 'Advanced AI job description', available: true },
        { text: 'Unlimited free endorsements', available: true },
        { text: 'API access', available: true },
        { text: 'White-glove onboarding', available: true },
        { text: 'Dedicated support team', available: true },
      ],
      actionLabel: 'Contact Sales',
      exclusive: true,
      userType: 'Recruiter',
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <PricingHeader 
        title="Simple, Transparent Pricing" 
        subtitle="Choose the perfect plan for your needs. No hidden fees, cancel anytime." 
      />
      
      <PricingSwitch isYearly={isYearly} setIsYearly={setIsYearly} />
      
      <PricingSection 
        title="For Job Seekers" 
        plans={userPricingTiers} 
        isYearly={isYearly} 
      />
      
      <PricingSection 
        title="For Recruiters & Employers" 
        plans={recruiterPricingTiers} 
        isYearly={isYearly} 
      />
      
      <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl text-center">
        <h3 className="text-xl font-semibold mb-4">Need help deciding?</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Compare features or contact our sales team to find the best solution for you.
        </p>
        <Button variant="outline" className="border-blue-500 text-blue-600 dark:text-blue-400">
          Compare Plans
        </Button>
      </div>
    </div>
  );
};

export default Pricing;