
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from '@/components/Navbar';
import SGPACalculator from '@/components/SGPACalculator';
import CGPACalculator from '@/components/CGPACalculator';
import ResultsVisualizer from '@/components/ResultsVisualizer';
import { Subject } from '@/utils/calculationUtils';
import { Toaster } from "@/components/ui/sonner";
import { Loader2 } from 'lucide-react';

const Index = () => {
  const [calculatedSGPA, setCalculatedSGPA] = useState(0);
  const [calculatedCGPA, setCalculatedCGPA] = useState(0);
  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([]);
  const [branch, setBranch] = useState('');
  const [semester, setSemester] = useState('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  // Background particle effect
  const particleVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/95 overflow-hidden relative">
      {/* Loading overlay for PDF generation */}
      {isGeneratingPDF && (
        <div className="fixed inset-0 bg-black/80 z-[9999] flex flex-col items-center justify-center backdrop-blur-sm">
          <div className="bg-card p-8 rounded-xl border border-primary/30 shadow-xl flex flex-col items-center max-w-md text-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary mb-6" />
            <h3 className="text-2xl font-semibold mb-2">Generating PDF Report</h3>
            <p className="text-muted-foreground mb-6">
              Please wait while we create your document. This will download automatically when complete.
            </p>
            <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.5 }}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/20"
            style={{
              width: Math.random() * 80 + 10,
              height: Math.random() * 80 + 10,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            variants={particleVariants}
            animate="animate"
            transition={{ delay: i * 0.2 }}
          />
        ))}
      </div>
      
      <Navbar />
      <Toaster position="top-center" />
      
      <div className="container px-4 py-8 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="relative">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2 inline-block relative z-10">
              KIIT SGPA/CGPA Calculator
              <motion.div 
                className="absolute -bottom-1 left-0 h-1 bg-gradient-to-r from-primary/80 to-accent/80"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
            Calculate your Semester Grade Point Average (SGPA) and Cumulative Grade Point Average (CGPA) with this advanced calculator. 
            Generate beautiful reports to track your academic progress.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-6xl mx-auto bg-secondary/10 p-0.5 rounded-lg glass-card mb-12"
        >
          <div className="backdrop-blur-xl p-6 rounded-lg">
            <Tabs defaultValue="sgpa" className="w-full">
              <TabsList className="grid grid-cols-2 mb-8">
                <TabsTrigger value="sgpa" className="text-base font-medium">
                  SGPA Calculator
                </TabsTrigger>
                <TabsTrigger value="cgpa" className="text-base font-medium">
                  CGPA Calculator
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="sgpa" className="mt-0">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
                  <div>
                    <SGPACalculator 
                      setCalculatedSGPA={setCalculatedSGPA}
                      setSelectedSubjects={setSelectedSubjects}
                      branch={branch}
                      semester={semester}
                      setBranch={setBranch}
                      setSemester={setSemester}
                      isGeneratingPDF={isGeneratingPDF}
                      setIsGeneratingPDF={setIsGeneratingPDF}
                    />
                  </div>
                  <div>
                    <ResultsVisualizer 
                      sgpa={calculatedSGPA}
                      cgpa={calculatedCGPA}
                      subjects={selectedSubjects}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="cgpa" className="mt-0">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
                  <div>
                    <CGPACalculator 
                      setCalculatedCGPA={setCalculatedCGPA}
                      branch={branch}
                      subjects={selectedSubjects}
                      sgpa={calculatedSGPA}
                      semester={semester}
                      isGeneratingPDF={isGeneratingPDF}
                      setIsGeneratingPDF={setIsGeneratingPDF}
                    />
                  </div>
                  <div>
                    <ResultsVisualizer 
                      sgpa={calculatedSGPA}
                      cgpa={calculatedCGPA}
                      subjects={selectedSubjects}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-sm text-muted-foreground mt-12"
        >
          <p className="mb-1">© {new Date().getFullYear()} KIIT-CONNECT. All rights reserved.</p>
          <p>This calculator uses the official KIIT University grading system.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
