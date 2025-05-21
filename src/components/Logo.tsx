
import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', animated = true }) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  const logoVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      className="flex items-center gap-2 font-bold"
      initial={animated ? "hidden" : "visible"}
      animate="visible"
      variants={logoVariants}
    >
      <motion.div 
        className="relative"
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-8 h-8 relative">
          <div className="absolute inset-0 bg-primary/80 rounded transform rotate-45"></div>
          <div className="absolute inset-1 bg-background rounded transform rotate-45"></div>
          <div className="absolute inset-2 bg-accent/80 rounded transform rotate-45"></div>
        </div>
      </motion.div>
      <div className={`font-bold ${sizeClasses[size]}`}>
        <span className="text-primary">KIIT</span>
        <span className="text-accent">-CONNECT</span>
      </div>
    </motion.div>
  );
};

export default Logo;
