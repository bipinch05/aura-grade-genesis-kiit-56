
import React from 'react';
import { motion } from 'framer-motion';
import Logo from './Logo';
import { Button } from "@/components/ui/button";

const Navbar: React.FC = () => {
  const navItems = [
    { label: 'Home', href: '#' },
    { label: 'Calculator', href: '#' },
    { label: 'Notes', href: '#' },
    { label: 'Help', href: '#' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
  };

  return (
    <motion.nav 
      className="w-full py-4 px-6 flex justify-between items-center glass-card"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Logo />
      
      <motion.div 
        className="hidden md:flex items-center gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {navItems.map((item, index) => (
          <motion.a
            key={index}
            href={item.href}
            className="text-gray-300 hover:text-primary transition-colors"
            variants={itemVariants}
          >
            {item.label}
          </motion.a>
        ))}
      </motion.div>
      
      <div className="flex items-center gap-3">
        <Button variant="outline" className="hidden md:block">
          Login
        </Button>
        <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
          Get Premium
        </Button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
