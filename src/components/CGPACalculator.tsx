
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Trash2, Download, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { calculateCGPA, Semester } from '@/utils/calculationUtils';
import { generatePDF, ReportData } from '@/utils/reportUtils';
import { v4 as uuidv4 } from '@/utils/uuidUtils';

interface CGPACalculatorProps {
  setCalculatedCGPA: (cgpa: number) => void;
  branch: string;
  subjects: any[];
  sgpa: number;
  semester: string;
  isGeneratingPDF: boolean;
  setIsGeneratingPDF: (isGenerating: boolean) => void;
}

const CGPACalculator: React.FC<CGPACalculatorProps> = ({ 
  setCalculatedCGPA,
  branch,
  subjects,
  sgpa,
  semester,
  isGeneratingPDF,
  setIsGeneratingPDF
}) => {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [studentName, setStudentName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  
  // Add current semester to the list when SGPA is calculated
  useEffect(() => {
    if (sgpa > 0 && semester && !semesters.some(s => s.name === `Semester ${semester}`)) {
      const totalCredits = subjects.reduce((sum, s) => sum + s.credit, 0);
      
      setSemesters([
        ...semesters,
        {
          id: uuidv4(),
          name: `Semester ${semester}`,
          sgpa: sgpa,
          credits: totalCredits
        }
      ]);
    }
  }, [sgpa, semester, subjects, semesters]);
  
  // Update CGPA when semesters change
  useEffect(() => {
    const cgpa = calculateCGPA(semesters);
    setCalculatedCGPA(cgpa);
  }, [semesters, setCalculatedCGPA]);
  
  const handleAddSemester = () => {
    setSemesters([
      ...semesters,
      { id: uuidv4(), name: '', sgpa: 0, credits: 0 }
    ]);
  };
  
  const handleRemoveSemester = (id: string) => {
    setSemesters(semesters.filter(semester => semester.id !== id));
  };
  
  const handleSemesterChange = (id: string, field: keyof Semester, value: string | number) => {
    setSemesters(semesters.map(semester => 
      semester.id === id 
        ? { ...semester, [field]: typeof value === 'string' && field === 'sgpa' || field === 'credits' 
            ? parseFloat(value as string) 
            : value 
          } 
        : semester
    ));
  };
  
  const handleGenerateReport = () => {
    if (!studentName || !rollNumber) {
      toast.error("Missing Information", {
        description: "Please enter student name and roll number"
      });
      return;
    }
    
    if (semesters.some(s => !s.name || s.sgpa === 0)) {
      toast.error("Incomplete Semester Data", {
        description: "Please fill in all semester names and SGPAs"
      });
      return;
    }
    
    setIsGeneratingPDF(true);
    toast.info("Generating PDF", {
      description: "Please wait while we generate your report..."
    });
    
    const reportData: ReportData = {
      studentName,
      rollNumber,
      branch,
      semester: "All",
      subjects: [],
      sgpa: 0,
      allSemesters: semesters,
      cgpa: calculateCGPA(semesters)
    };
    
    try {
      generatePDF(reportData, 'cgpa');
      
      // Set a timeout to change the state back after some time
      setTimeout(() => {
        setIsGeneratingPDF(false);
        toast.success("Success!", {
          description: "CGPA report generated successfully"
        });
      }, 2000);
    } catch (error) {
      setIsGeneratingPDF(false);
      toast.error("Error", {
        description: "Failed to generate PDF. Please try again."
      });
      console.error("PDF generation error:", error);
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
  };
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-4xl mx-auto"
    >
      <motion.div variants={itemVariants} className="mb-8">
        <Card className="glass-card border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl gradient-text">Student Information</CardTitle>
            <CardDescription>Enter your details to personalize your report</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="studentName">Student Name</Label>
                <Input
                  id="studentName"
                  placeholder="Enter your name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="bg-secondary/50 border-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rollNumber">Roll Number</Label>
                <Input
                  id="rollNumber"
                  placeholder="Enter your roll number"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className="bg-secondary/50 border-primary/20"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label>Branch</Label>
                <div className="bg-secondary/50 border border-primary/20 rounded-md px-3 py-2 text-muted-foreground">
                  {branch || 'No branch selected'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={itemVariants} className="mb-8">
        <Card className="glass-card border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl gradient-text">Semester Information</CardTitle>
            <CardDescription>Enter your semesters, credits, and SGPAs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {semesters.map((semester, index) => (
              <motion.div
                key={semester.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="grid grid-cols-12 gap-3 items-center bg-secondary/20 p-3 rounded-lg"
              >
                <div className="col-span-4 sm:col-span-5">
                  <Input
                    placeholder="Semester Name"
                    value={semester.name}
                    onChange={(e) => handleSemesterChange(semester.id, 'name', e.target.value)}
                    className="bg-secondary/50 border-primary/20"
                  />
                </div>
                <div className="col-span-3 sm:col-span-3">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Credits"
                    value={semester.credits || ''}
                    onChange={(e) => handleSemesterChange(semester.id, 'credits', e.target.value)}
                    className="bg-secondary/50 border-primary/20"
                  />
                </div>
                <div className="col-span-3 sm:col-span-3">
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    step="0.01"
                    placeholder="SGPA"
                    value={semester.sgpa || ''}
                    onChange={(e) => handleSemesterChange(semester.id, 'sgpa', e.target.value)}
                    className="bg-secondary/50 border-primary/20"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1 flex justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveSemester(semester.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive/80"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
            
            <Button
              variant="outline"
              onClick={handleAddSemester}
              className="w-full mt-2 border-dashed border-primary/50 hover:border-primary hover:bg-primary/10"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Semester
            </Button>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
              onClick={handleGenerateReport}
              disabled={isGeneratingPDF}
            >
              {isGeneratingPDF ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Generate CGPA Report
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default CGPACalculator;
