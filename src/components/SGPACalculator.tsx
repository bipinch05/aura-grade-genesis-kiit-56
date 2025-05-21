
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Trash2, Download, FileCheck, BarChart, BookOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Subject, 
  calculateSGPA, 
  generateSubjectsByBranch, 
  getGradeColor, 
  GradeType, 
  branches, 
  semesters,
  branchSubjectMap 
} from '@/utils/calculationUtils';
import { generatePDF, ReportData } from '@/utils/reportUtils';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from '@/utils/uuidUtils';

interface SGPACalculatorProps {
  setCalculatedSGPA: (sgpa: number) => void;
  setSelectedSubjects: (subjects: Subject[]) => void;
  branch: string;
  semester: string;
  setBranch: (branch: string) => void;
  setSemester: (semester: string) => void;
}

const SGPACalculator: React.FC<SGPACalculatorProps> = ({ 
  setCalculatedSGPA, 
  setSelectedSubjects,
  branch,
  semester,
  setBranch,
  setSemester
}) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [studentName, setStudentName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  
  // Populate subjects when branch and semester change
  useEffect(() => {
    if (branch && semester) {
      const generatedSubjects = generateSubjectsByBranch(branch, semester).map(subj => ({
        id: uuidv4(),
        name: subj.name || '',
        credit: subj.credit || 3,
        grade: '' as GradeType | '',
      }));
      setSubjects(generatedSubjects);
    }
  }, [branch, semester]);
  
  // Update parent component when subjects change
  useEffect(() => {
    const validSubjects = subjects.filter(s => s.grade !== '');
    const sgpa = calculateSGPA(validSubjects);
    setCalculatedSGPA(sgpa);
    setSelectedSubjects(subjects);
  }, [subjects, setCalculatedSGPA, setSelectedSubjects]);
  
  const handleAddSubject = () => {
    setSubjects([...subjects, { id: uuidv4(), name: '', credit: 3, grade: '' }]);
  };
  
  const handleRemoveSubject = (id: string) => {
    setSubjects(subjects.filter(subject => subject.id !== id));
  };
  
  const handleSubjectChange = (id: string, field: keyof Subject, value: string | number) => {
    setSubjects(subjects.map(subject => 
      subject.id === id ? { ...subject, [field]: value } : subject
    ));
  };
  
  const handleGenerateReport = () => {
    if (!studentName || !rollNumber) {
      toast({
        title: "Missing Information",
        description: "Please enter student name and roll number",
        variant: "destructive"
      });
      return;
    }
    
    if (subjects.some(s => !s.name || s.grade === '')) {
      toast({
        title: "Incomplete Subject Data",
        description: "Please fill in all subject names and grades",
        variant: "destructive"
      });
      return;
    }
    
    const reportData: ReportData = {
      studentName,
      rollNumber,
      branch,
      semester,
      subjects,
      sgpa: calculateSGPA(subjects),
    };
    
    generatePDF(reportData, 'sgpa');
    toast({
      title: "Success!",
      description: "SGPA report generated and downloaded successfully"
    });
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
        <Card className="glass-card border-primary/20 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent"></div>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-2xl">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="gradient-text">Student Information</span>
            </CardTitle>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <Select value={branch} onValueChange={(value) => {
                  setBranch(value);
                  // Reset subjects when branch changes
                  if (semester) {
                    const newSubjects = generateSubjectsByBranch(value, semester).map(subj => ({
                      id: uuidv4(),
                      name: subj.name || '',
                      credit: subj.credit || 3,
                      grade: '' as GradeType | '',
                    }));
                    setSubjects(newSubjects);
                  }
                }}>
                  <SelectTrigger id="branch" className="bg-secondary/50 border-primary/20">
                    <SelectValue placeholder="Select your branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Select value={semester} onValueChange={(value) => {
                  setSemester(value);
                  // Update subjects when semester changes if branch is selected
                  if (branch) {
                    const newSubjects = generateSubjectsByBranch(branch, value).map(subj => ({
                      id: uuidv4(),
                      name: subj.name || '',
                      credit: subj.credit || 3,
                      grade: '' as GradeType | '',
                    }));
                    setSubjects(newSubjects);
                  }
                }}>
                  <SelectTrigger id="semester" className="bg-secondary/50 border-primary/20">
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((s) => (
                      <SelectItem key={s} value={s}>
                        Semester {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={itemVariants} className="mb-8">
        <Card className="glass-card border-primary/20 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-primary"></div>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-2xl">
              <BarChart className="h-5 w-5 text-accent" />
              <span className="gradient-text">Subject Information</span>
            </CardTitle>
            <CardDescription>Enter your subjects, credits, and grades</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {subjects.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                <p>Please select a branch and semester to load subjects</p>
              </div>
            )}
            
            {subjects.map((subject, index) => (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="grid grid-cols-12 gap-3 items-center bg-secondary/20 p-3 rounded-lg backdrop-blur-sm"
              >
                <div className="col-span-5 sm:col-span-5">
                  <Input
                    placeholder="Subject Name"
                    value={subject.name}
                    onChange={(e) => handleSubjectChange(subject.id, 'name', e.target.value)}
                    className="bg-secondary/50 border-primary/20"
                  />
                </div>
                <div className="col-span-2 sm:col-span-2">
                  <Select
                    value={String(subject.credit)}
                    onValueChange={(value) => handleSubjectChange(subject.id, 'credit', parseInt(value))}
                  >
                    <SelectTrigger className="bg-secondary/50 border-primary/20">
                      <SelectValue placeholder="Credits" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((credit) => (
                        <SelectItem key={credit} value={String(credit)}>
                          {credit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-3 sm:col-span-3">
                  <Select
                    value={subject.grade}
                    onValueChange={(value) => handleSubjectChange(subject.id, 'grade', value as GradeType)}
                  >
                    <SelectTrigger className="bg-secondary/50 border-primary/20">
                      <SelectValue placeholder="Grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {['O', 'E', 'A', 'B', 'C', 'D', 'F'].map((grade) => (
                        <SelectItem key={grade} value={grade} className="flex items-center">
                          <div className={`w-8 h-6 rounded ${getGradeColor(grade as GradeType)} mr-2 flex items-center justify-center text-black font-semibold`}>
                            {grade}
                          </div>
                          <span>
                            {grade === 'O' ? '10' : 
                             grade === 'E' ? '9' : 
                             grade === 'A' ? '8' : 
                             grade === 'B' ? '7' : 
                             grade === 'C' ? '6' : 
                             grade === 'D' ? '5' : '0'}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 sm:col-span-2 flex justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveSubject(subject.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
            
            <Button
              variant="outline"
              onClick={handleAddSubject}
              className="w-full mt-2 border-dashed border-primary/50 hover:border-primary hover:bg-primary/10"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Subject
            </Button>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity flex gap-2 items-center"
              onClick={handleGenerateReport}
            >
              <FileCheck className="h-4 w-4" />
              Generate SGPA Report
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default SGPACalculator;
