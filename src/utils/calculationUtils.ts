
// Grade point mapping
export const gradeToPoint = {
  'O': 10,
  'E': 9,
  'A': 8,
  'B': 7,
  'C': 6,
  'D': 5,
  'F': 0
};

export type GradeType = keyof typeof gradeToPoint;

export interface Subject {
  id: string;
  name: string;
  credit: number;
  grade: GradeType | '';
}

export interface Semester {
  id: string;
  name: string;
  sgpa: number;
  credits: number;
}

// Calculate SGPA
export const calculateSGPA = (subjects: Subject[]): number => {
  if (subjects.length === 0 || subjects.some(subject => subject.grade === '')) {
    return 0;
  }
  
  const totalCredits = subjects.reduce((sum, subject) => sum + subject.credit, 0);
  const totalGradePoints = subjects.reduce((sum, subject) => 
    sum + (subject.credit * gradeToPoint[subject.grade as GradeType]), 0);
  
  return totalCredits > 0 ? parseFloat((totalGradePoints / totalCredits).toFixed(2)) : 0;
};

// Calculate CGPA
export const calculateCGPA = (semesters: Semester[]): number => {
  if (semesters.length === 0) {
    return 0;
  }
  
  const totalCredits = semesters.reduce((sum, semester) => sum + semester.credits, 0);
  const totalGradePoints = semesters.reduce((sum, semester) => 
    sum + (semester.credits * semester.sgpa), 0);
  
  return totalCredits > 0 ? parseFloat((totalGradePoints / totalCredits).toFixed(2)) : 0;
};

// Get grade color based on grade points
export const getGradeColor = (grade: GradeType | ''): string => {
  if (grade === '') return 'bg-gray-700';
  
  const point = gradeToPoint[grade];
  if (point >= 9) return 'bg-gradient-to-r from-emerald-500 to-green-500';
  if (point >= 8) return 'bg-gradient-to-r from-green-500 to-lime-500';
  if (point >= 7) return 'bg-gradient-to-r from-lime-500 to-yellow-500';
  if (point >= 6) return 'bg-gradient-to-r from-yellow-500 to-amber-500';
  if (point >= 5) return 'bg-gradient-to-r from-amber-500 to-orange-500';
  return 'bg-gradient-to-r from-red-500 to-rose-500';
};

// Generate random subject names based on branch
export const generateSubjectsByBranch = (branch: string): Partial<Subject>[] => {
  const subjectsByBranch: Record<string, string[]> = {
    'CSE': [
      'Computer Networks', 'Design & Analysis of Algorithms', 'Software Engineering',
      'Database Management Systems', 'Operating Systems', 'Computer Architecture',
      'Web Development', 'Machine Learning', 'Artificial Intelligence'
    ],
    'ECE': [
      'Digital Electronics', 'Analog Circuits', 'Communication Systems',
      'Microprocessors', 'Signal Processing', 'Control Systems',
      'VLSI Design', 'Embedded Systems', 'Antenna & Wave Propagation'
    ],
    'EEE': [
      'Power Systems', 'Electrical Machines', 'Control Systems',
      'Power Electronics', 'Signals & Systems', 'Electrical Measurements',
      'High Voltage Engineering', 'Digital Signal Processing', 'Renewable Energy'
    ],
    'ME': [
      'Thermodynamics', 'Fluid Mechanics', 'Machine Design',
      'Manufacturing Processes', 'Heat Transfer', 'Strength of Materials',
      'Automobile Engineering', 'Robotics', 'CAD/CAM'
    ],
    'CE': [
      'Structural Analysis', 'Geotechnical Engineering', 'Transportation Engineering',
      'Environmental Engineering', 'Hydraulics', 'Surveying',
      'Construction Management', 'Concrete Technology', 'Steel Structures'
    ]
  };

  // Default to CSE if branch not found
  const subjects = subjectsByBranch[branch] || subjectsByBranch['CSE'];
  
  // Get 5 random subjects
  const randomSubjects = [...subjects].sort(() => 0.5 - Math.random()).slice(0, 5);
  
  return randomSubjects.map(name => ({
    name,
    credit: Math.floor(Math.random() * 3) + 1, // Random credit from 1-3
  }));
};

export const branches = [
  'CSE', 'ECE', 'EEE', 'ME', 'CE', 'IT', 'CIVIL', 'BIOTECH'
];

export const semesters = [
  '1', '2', '3', '4', '5', '6', '7', '8'
];
