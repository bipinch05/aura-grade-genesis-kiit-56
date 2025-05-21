
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from '@/components/Navbar';
import SGPACalculator from '@/components/SGPACalculator';
import CGPACalculator from '@/components/CGPACalculator';
import ResultsVisualizer from '@/components/ResultsVisualizer';
import { Subject } from '@/utils/calculationUtils';

const Index = () => {
  const [calculatedSGPA, setCalculatedSGPA] = useState(0);
  const [calculatedCGPA, setCalculatedCGPA] = useState(0);
  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([]);
  const [branch, setBranch] = useState('');
  const [semester, setSemester] = useState('');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/95">
      <Navbar />
      
      <div className="container px-4 py-8 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold gradient-text animate-pulse-slow mb-2">
            KIIT SGPA/CGPA Calculator
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Calculate your Semester Grade Point Average (SGPA) and Cumulative Grade Point Average (CGPA) with this advanced calculator. Generate beautiful reports to track your academic progress.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-5xl mx-auto bg-secondary/10 p-0.5 rounded-lg glass-card mb-12"
        >
          <div className="p-6">
            <Tabs defaultValue="sgpa" className="w-full">
              <TabsList className="grid grid-cols-2 mb-8">
                <TabsTrigger value="sgpa" className="text-base">
                  SGPA Calculator
                </TabsTrigger>
                <TabsTrigger value="cgpa" className="text-base">
                  CGPA Calculator
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="sgpa" className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <SGPACalculator 
                      setCalculatedSGPA={setCalculatedSGPA}
                      setSelectedSubjects={setSelectedSubjects}
                      branch={branch}
                      semester={semester}
                      setBranch={setBranch}
                      setSemester={setSemester}
                    />
                  </div>
                  <div className="lg:col-span-1">
                    <div className="sticky top-4">
                      <ResultsVisualizer 
                        sgpa={calculatedSGPA}
                        cgpa={calculatedCGPA}
                        subjects={selectedSubjects}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="cgpa" className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <CGPACalculator 
                      setCalculatedCGPA={setCalculatedCGPA}
                      branch={branch}
                      subjects={selectedSubjects}
                      sgpa={calculatedSGPA}
                      semester={semester}
                    />
                  </div>
                  <div className="lg:col-span-1">
                    <div className="sticky top-4">
                      <ResultsVisualizer 
                        sgpa={calculatedSGPA}
                        cgpa={calculatedCGPA}
                        subjects={selectedSubjects}
                      />
                    </div>
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
          <p>© 2025 KIIT-CONNECT. All rights reserved.</p>
          <p>This calculator uses the official KIIT University grading system.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
