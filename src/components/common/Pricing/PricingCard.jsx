import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const PricingCard = ({ isYearly, title, monthlyPrice, yearlyPrice, description, features, actionLabel, popular, exclusive, userType }) => {
  const price = isYearly && yearlyPrice ? yearlyPrice : monthlyPrice;
  const period = isYearly ? '/year' : monthlyPrice !== undefined ? '/month' : '';

  // Framer Motion variants for desktop only
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { scale: 1.05, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      transition={{ duration: 0.5 }}
      className="relative flex-shrink-0 sm:motion-safe" // Apply motion only on sm and above
    >
      {(popular || exclusive) && (
        <div className="absolute  -top-3 left-1/2 transform -translate-x-1/2 mt-3 sm:mt-0 z-10  ">
          <div className={cn(
            'px-3 py-1 text-white text-xs font-bold rounded-full shadow flex items-center',
            popular ? 'bg-brand' : 'bg-brand'
          )}>
            <Star className="w-3 h-3 mr-1" />
            {popular ? 'POPULAR' : 'EXCLUSIVE'}
          </div>
        </div>
      )}
      <Card
        className={cn(
          'w-64 flex flex-col justify-between py-1 h-full',
          popular ? 'border-2 border-brand shadow-lg' : 'border border-gray-200 dark:border-gray-700',
          exclusive && 'animate-background-shine bg-white dark:bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%]'
        )}
      >
        <div>
          <CardHeader className="pb-4 pt-8 text-center">
            <CardTitle className={cn(
              'text-xl font-bold',
              popular ? 'text-brand' : 'text-gray-800 dark:text-gray-200'
            )}>
              {title}
            </CardTitle>
            <div className="flex justify-center items-baseline mt-4">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                {price !== undefined ? `$${price}` : 'Custom'}
              </h3>
              {price !== undefined && (
                <span className="text-sm text-brand ml-1">{period}</span>
              )}
            </div>
            <CardDescription className="mt-3 text-gray-600 dark:text-gray-300 text-sm">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 px-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-center gap-2',
                  !feature.available && 'line-through text-gray-500'
                )}
              >
                <CheckCircle2
                  size={16}
                  className={cn(
                    'flex-shrink-0',
                    feature.available ? 'text-green-400' : 'text-gray-400'
                  )}
                />
                <p className="text-sm text-gray-700 dark:text-gray-300">{feature.text}</p>
              </div>
            ))}
          </CardContent>
        </div>
        <CardFooter className="mt-4 p-6 pt-0">
          <Button
            className="w-full h-10 text-base font-medium rounded-lg bg-brand text-white focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
          >
            {actionLabel}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

PricingCard.propTypes = {
  isYearly: PropTypes.bool,
  title: PropTypes.string.isRequired,
  monthlyPrice: PropTypes.number,
  yearlyPrice: PropTypes.number,
  description: PropTypes.string.isRequired,
  features: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      available: PropTypes.bool.isRequired,
    })
  ).isRequired,
  actionLabel: PropTypes.string.isRequired,
  popular: PropTypes.bool,
  exclusive: PropTypes.bool,
  userType: PropTypes.oneOf(['User', 'Recruiter']).isRequired,
};

export default PricingCard;