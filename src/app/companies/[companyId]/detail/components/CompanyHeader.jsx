import { motion } from 'framer-motion';
import { Twitter, Facebook, Instagram, Linkedin, ExternalLink, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default function CompanyHeader({ company }) {
  // Debug the company.logo value
  console.log('Company logo URL:', company.logo);

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative text-white rounded-xl p-6 sm:p-8 shadow-lg overflow-hidden"
      style={{
        backgroundImage: company.cover_photo
          ? `url(${company.cover_photo})`
          : 'linear-gradient(to right, #60a5fa, #3b82f6)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative flex flex-col sm:flex-row items-center gap-6">
        <Avatar className="w-20 h-20 sm:w-24 sm:h-24 ring-4 ring-white/20">
          <AvatarImage
            src={company.logo || '/images/default-logo.png'} // Simplified logic
            alt={`${company.name || 'Company'} logo`}
            onError={() => console.log('AvatarImage failed to load:', company.logo)} // Debug image load errors
          />
          <AvatarFallback className="bg-blue-500 text-white text-2xl">
            {company.name?.[0] || 'C'}
          </AvatarFallback>
        </Avatar>
        <div className="text-center sm:text-left flex-1">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {company.name || 'Unknown Company'}
          </h1>
          <p className="mt-2 text-white/80 text-sm sm:text-base">
            {company.industry || 'N/A'} | {company.country || 'N/A'}
          </p>
          <div className="flex justify-center sm:justify-start gap-4 mt-4">
            {company.linkedin && (
              <a href={company.linkedin} className="text-white/80 hover:text-white transition">
                <Linkedin size={20} />
              </a>
            )}
            <a href="#" className="text-white/80 hover:text-white transition">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-white/80 hover:text-white transition">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-white/80 hover:text-white transition">
              <Instagram size={20} />
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            className="bg-white/10 text-white border-white/20 hover:bg-white/20 flex items-center gap-2 text-sm sm:text-base"
          >
            <Plus size={16} /> Follow
          </Button>
          {company.website_url && (
            <Button
              asChild
              className="bg-white text-blue-600 hover:bg-blue-50 flex items-center gap-2 text-sm sm:text-base font-semibold"
            >
              <a href={company.website_url} target="_blank" rel="noopener noreferrer">
                Visit Website <ExternalLink size={16} />
              </a>
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}