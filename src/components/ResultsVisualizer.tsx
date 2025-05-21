
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Subject } from '@/utils/calculationUtils';

interface ResultsVisualizerProps {
  sgpa: number;
  cgpa: number;
  subjects: Subject[];
}

const ResultsVisualizer: React.FC<ResultsVisualizerProps> = ({ sgpa, cgpa, subjects }) => {
  // Calculate additional metrics
  const validSubjects = subjects.filter(s => s.grade !== '');
  const totalCredits = validSubjects.reduce((sum, subject) => sum + subject.credit, 0);
  const gradeCounts = validSubjects.reduce((counts: Record<string, number>, subject) => {
    counts[subject.grade] = (counts[subject.grade] || 0) + 1;
    return counts;
  }, {});
  
  const getGradeColor = (grade: string): string => {
    switch(grade) {
      case 'O': return 'bg-emerald-500';
      case 'E': return 'bg-green-500';
      case 'A': return 'bg-blue-500';
      case 'B': return 'bg-yellow-500';
      case 'C': return 'bg-orange-500';
      case 'D': return 'bg-red-400';
      case 'F': return 'bg-red-600';
      default: return 'bg-gray-500';
    }
  };
  
  const getPerformanceText = (gpa: number): string => {
    if (gpa >= 9.5) return "Outstanding";
    if (gpa >= 9.0) return "Excellent";
    if (gpa >= 8.0) return "Very Good";
    if (gpa >= 7.0) return "Good";
    if (gpa >= 6.0) return "Above Average";
    if (gpa >= 5.0) return "Average";
    return "Needs Improvement";
  };
  
  const getPerformanceColor = (gpa: number): string => {
    if (gpa >= 9.0) return "text-emerald-400";
    if (gpa >= 8.0) return "text-green-400";
    if (gpa >= 7.0) return "text-blue-400";
    if (gpa >= 6.0) return "text-yellow-400";
    if (gpa >= 5.0) return "text-orange-400";
    return "text-red-400";
  };
  
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass-card h-full border-primary/20">
          <CardHeader>
            <CardTitle className="gradient-text text-xl">Grade Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="10"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="10"
                      strokeDasharray={`${(sgpa / 10) * 283} 283`}
                      strokeDashoffset="0"
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                    <defs>
                      <linearGradient id="gradient" gradientTransform="rotate(90)">
                        <stop offset="0%" stopColor="#C084FC" />
                        <stop offset="100%" stopColor="#67E8F9" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span 
                      className="text-3xl font-bold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      {sgpa.toFixed(2)}
                    </motion.span>
                    <span className="text-xs text-muted-foreground">SGPA</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="bg-secondary/30 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold">{totalCredits}</div>
                  <div className="text-xs text-muted-foreground">Total Credits</div>
                </div>
                <div className="bg-secondary/30 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold">{validSubjects.length}</div>
                  <div className="text-xs text-muted-foreground">Subjects</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Performance</div>
                <div className={`text-xl font-bold ${getPerformanceColor(sgpa)}`}>
                  {getPerformanceText(sgpa)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="glass-card h-full border-primary/20">
          <CardHeader>
            <CardTitle className="gradient-text text-xl">Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.keys(gradeCounts).length > 0 ? (
              <div className="space-y-3">
                {['O', 'E', 'A', 'B', 'C', 'D', 'F'].map(grade => (
                  gradeCounts[grade] > 0 && (
                    <div key={grade} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Grade {grade}</span>
                        <span>{gradeCounts[grade]} {gradeCounts[grade] === 1 ? 'subject' : 'subjects'}</span>
                      </div>
                      <div className="w-full h-2 bg-secondary/20 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${getGradeColor(grade)}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(gradeCounts[grade] / validSubjects.length) * 100}%` }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                        ></motion.div>
                      </div>
                    </div>
                  )
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <p>No grades added yet</p>
                <p className="text-sm">Add subjects and grades to see distribution</p>
              </div>
            )}
            
            {cgpa > 0 && (
              <motion.div 
                className="mt-6 bg-secondary/30 rounded-lg p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">CGPA</span>
                  <span className="text-2xl font-bold">{cgpa.toFixed(2)}</span>
                </div>
                <div className="mt-2 w-full h-2 bg-secondary/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-accent"
                    initial={{ width: 0 }}
                    animate={{ width: `${(cgpa / 10) * 100}%` }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  ></motion.div>
                </div>
                <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                  <span>0</span>
                  <span>5</span>
                  <span>10</span>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResultsVisualizer;
