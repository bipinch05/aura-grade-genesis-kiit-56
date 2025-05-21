
import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  variant?: 'default' | 'report';
}

const Logo: React.FC<LogoProps> = ({ size = 'md', animated = true, variant = 'default' }) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  const logoVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  const logoIconVariants = {
    hover: { 
      rotate: 360,
      scale: 1.1,
      transition: { duration: 0.8, ease: "easeInOut" }
    },
    initial: {
      rotate: 0,
      scale: 1
    },
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };

  return (
    <motion.div
      className={`flex items-center gap-2 font-bold ${variant === 'report' ? 'justify-center' : ''}`}
      initial={animated ? "hidden" : "visible"}
      animate="visible"
      variants={logoVariants}
    >
      <motion.div 
        className="relative"
        initial="initial"
        animate="pulse"
        whileHover="hover"
        variants={logoIconVariants}
      >
        <div className={`${size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-12 h-12' : 'w-8 h-8'} relative`}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/70 rounded-lg transform rotate-45 shadow-lg"></div>
          <div className="absolute inset-1 bg-background rounded-lg transform rotate-45"></div>
          <div className="absolute inset-2 bg-gradient-to-tr from-accent to-accent/70 rounded-lg transform rotate-45"></div>
        </div>
      </motion.div>
      <div className={`font-bold ${sizeClasses[size]}`}>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80">KIIT</span>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/80">-CONNECT</span>
      </div>
    </motion.div>
  );
};

export default Logo;
