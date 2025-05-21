
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

// Map of branches and their respective subjects by semester
export const branchSubjectMap: Record<string, Record<string, Partial<Subject>[]>> = {
  'CSE': {
    '1': [
      { name: 'Chemistry', credit: 4 },
      { name: 'Mathematics-I', credit: 4 },
      { name: 'Basic Electrical Engineering', credit: 3 },
      { name: 'English Communication', credit: 2 },
      { name: 'Engineering Graphics', credit: 3 }
    ],
    '2': [
      { name: 'Physics', credit: 4 },
      { name: 'Mathematics-II', credit: 4 },
      { name: 'Programming in C', credit: 3 },
      { name: 'Basic Electronics', credit: 3 },
      { name: 'Environmental Science', credit: 2 }
    ],
    '3': [
      { name: 'Data Structures & Algorithms', credit: 4 },
      { name: 'Digital Logic Design', credit: 3 },
      { name: 'Discrete Mathematics', credit: 3 },
      { name: 'Object Oriented Programming', credit: 4 },
      { name: 'Software Engineering', credit: 3 }
    ],
    '4': [
      { name: 'Computer Architecture', credit: 4 },
      { name: 'Operating Systems', credit: 4 },
      { name: 'Theory of Computation', credit: 3 },
      { name: 'Database Management Systems', credit: 4 },
      { name: 'Design & Analysis of Algorithms', credit: 3 }
    ],
    '5': [
      { name: 'Computer Networks', credit: 4 },
      { name: 'Machine Learning', credit: 3 },
      { name: 'Web Technologies', credit: 3 },
      { name: 'Professional Elective-I', credit: 3 },
      { name: 'Open Elective-I', credit: 3 }
    ],
    '6': [
      { name: 'Artificial Intelligence', credit: 4 },
      { name: 'Compiler Design', credit: 3 },
      { name: 'Cloud Computing', credit: 3 },
      { name: 'Professional Elective-II', credit: 3 },
      { name: 'Open Elective-II', credit: 3 }
    ],
    '7': [
      { name: 'Big Data Analytics', credit: 4 },
      { name: 'Information Security', credit: 3 },
      { name: 'Professional Elective-III', credit: 3 },
      { name: 'Professional Elective-IV', credit: 3 },
      { name: 'Project-I', credit: 2 }
    ],
    '8': [
      { name: 'Blockchain Technology', credit: 3 },
      { name: 'Professional Elective-V', credit: 3 },
      { name: 'Professional Elective-VI', credit: 3 },
      { name: 'Project-II', credit: 6 }
    ]
  },
  'ECE': {
    '1': [
      { name: 'Physics', credit: 4 },
      { name: 'Mathematics-I', credit: 4 },
      { name: 'Basic Electrical Engineering', credit: 3 },
      { name: 'English Communication', credit: 2 },
      { name: 'Engineering Graphics', credit: 3 }
    ],
    '2': [
      { name: 'Chemistry', credit: 4 },
      { name: 'Mathematics-II', credit: 4 },
      { name: 'Programming in C', credit: 3 },
      { name: 'Basic Electronics', credit: 3 },
      { name: 'Environmental Science', credit: 2 }
    ],
    '3': [
      { name: 'Digital Electronics', credit: 4 },
      { name: 'Signals & Systems', credit: 4 },
      { name: 'Network Theory', credit: 3 },
      { name: 'Electronic Devices', credit: 3 },
      { name: 'Data Structures', credit: 3 }
    ],
    '4': [
      { name: 'Analog Circuits', credit: 4 },
      { name: 'Electromagnetic Field Theory', credit: 4 },
      { name: 'Control Systems', credit: 3 },
      { name: 'Communication Systems', credit: 4 },
      { name: 'Microprocessors', credit: 3 }
    ],
    '5': [
      { name: 'Digital Signal Processing', credit: 4 },
      { name: 'VLSI Design', credit: 4 },
      { name: 'Microwave Engineering', credit: 3 },
      { name: 'Professional Elective-I', credit: 3 },
      { name: 'Open Elective-I', credit: 3 }
    ],
    '6': [
      { name: 'Antenna & Wave Propagation', credit: 4 },
      { name: 'Embedded Systems', credit: 3 },
      { name: 'Wireless Communication', credit: 3 },
      { name: 'Professional Elective-II', credit: 3 },
      { name: 'Open Elective-II', credit: 3 }
    ],
    '7': [
      { name: 'Satellite Communication', credit: 3 },
      { name: 'Digital Image Processing', credit: 4 },
      { name: 'Professional Elective-III', credit: 3 },
      { name: 'Professional Elective-IV', credit: 3 },
      { name: 'Project-I', credit: 2 }
    ],
    '8': [
      { name: 'Optical Communication', credit: 3 },
      { name: 'Professional Elective-V', credit: 3 },
      { name: 'Professional Elective-VI', credit: 3 },
      { name: 'Project-II', credit: 6 }
    ]
  },
  'EEE': {
    '1': [
      { name: 'Chemistry', credit: 4 },
      { name: 'Mathematics-I', credit: 4 },
      { name: 'Basic Electrical Engineering', credit: 3 },
      { name: 'English Communication', credit: 2 },
      { name: 'Engineering Graphics', credit: 3 }
    ],
    '2': [
      { name: 'Physics', credit: 4 },
      { name: 'Mathematics-II', credit: 4 },
      { name: 'Programming in C', credit: 3 },
      { name: 'Basic Electronics', credit: 3 },
      { name: 'Environmental Science', credit: 2 }
    ],
    '3': [
      { name: 'Electrical Machines-I', credit: 4 },
      { name: 'Network Theory', credit: 3 },
      { name: 'Electromagnetic Fields', credit: 3 },
      { name: 'Digital Electronics', credit: 3 },
      { name: 'Signals & Systems', credit: 3 }
    ],
    '4': [
      { name: 'Electrical Machines-II', credit: 4 },
      { name: 'Power Systems-I', credit: 4 },
      { name: 'Control Systems', credit: 3 },
      { name: 'Analog Electronics', credit: 3 },
      { name: 'Numerical Methods', credit: 3 }
    ],
    '5': [
      { name: 'Power Systems-II', credit: 4 },
      { name: 'Power Electronics', credit: 4 },
      { name: 'Microprocessors', credit: 3 },
      { name: 'Professional Elective-I', credit: 3 },
      { name: 'Open Elective-I', credit: 3 }
    ],
    '6': [
      { name: 'High Voltage Engineering', credit: 3 },
      { name: 'Electrical Drives', credit: 4 },
      { name: 'Digital Signal Processing', credit: 3 },
      { name: 'Professional Elective-II', credit: 3 },
      { name: 'Open Elective-II', credit: 3 }
    ],
    '7': [
      { name: 'Power System Protection', credit: 4 },
      { name: 'Renewable Energy Sources', credit: 3 },
      { name: 'Professional Elective-III', credit: 3 },
      { name: 'Professional Elective-IV', credit: 3 },
      { name: 'Project-I', credit: 2 }
    ],
    '8': [
      { name: 'Smart Grid', credit: 3 },
      { name: 'Professional Elective-V', credit: 3 },
      { name: 'Professional Elective-VI', credit: 3 },
      { name: 'Project-II', credit: 6 }
    ]
  },
  'ME': {
    '1': [
      { name: 'Physics', credit: 4 },
      { name: 'Mathematics-I', credit: 4 },
      { name: 'Basic Electrical Engineering', credit: 3 },
      { name: 'English Communication', credit: 2 },
      { name: 'Engineering Graphics', credit: 3 }
    ],
    '2': [
      { name: 'Chemistry', credit: 4 },
      { name: 'Mathematics-II', credit: 4 },
      { name: 'Programming in C', credit: 3 },
      { name: 'Basic Electronics', credit: 3 },
      { name: 'Environmental Science', credit: 2 }
    ],
    '3': [
      { name: 'Engineering Mechanics', credit: 4 },
      { name: 'Thermodynamics', credit: 4 },
      { name: 'Materials Science', credit: 3 },
      { name: 'Manufacturing Processes-I', credit: 3 },
      { name: 'Machine Drawing', credit: 3 }
    ],
    '4': [
      { name: 'Strength of Materials', credit: 4 },
      { name: 'Fluid Mechanics', credit: 4 },
      { name: 'Manufacturing Processes-II', credit: 3 },
      { name: 'Kinematics of Machinery', credit: 3 },
      { name: 'Numerical Methods', credit: 3 }
    ],
    '5': [
      { name: 'Heat Transfer', credit: 4 },
      { name: 'Dynamics of Machinery', credit: 4 },
      { name: 'Design of Machine Elements', credit: 3 },
      { name: 'Professional Elective-I', credit: 3 },
      { name: 'Open Elective-I', credit: 3 }
    ],
    '6': [
      { name: 'IC Engines & Gas Turbines', credit: 3 },
      { name: 'Mechatronics', credit: 3 },
      { name: 'Industrial Engineering', credit: 4 },
      { name: 'Professional Elective-II', credit: 3 },
      { name: 'Open Elective-II', credit: 3 }
    ],
    '7': [
      { name: 'Automobile Engineering', credit: 3 },
      { name: 'CAD/CAM', credit: 4 },
      { name: 'Professional Elective-III', credit: 3 },
      { name: 'Professional Elective-IV', credit: 3 },
      { name: 'Project-I', credit: 2 }
    ],
    '8': [
      { name: 'Robotics', credit: 3 },
      { name: 'Professional Elective-V', credit: 3 },
      { name: 'Professional Elective-VI', credit: 3 },
      { name: 'Project-II', credit: 6 }
    ]
  },
  'CE': {
    '1': [
      { name: 'Chemistry', credit: 4 },
      { name: 'Mathematics-I', credit: 4 },
      { name: 'Basic Electrical Engineering', credit: 3 },
      { name: 'English Communication', credit: 2 },
      { name: 'Engineering Graphics', credit: 3 }
    ],
    '2': [
      { name: 'Physics', credit: 4 },
      { name: 'Mathematics-II', credit: 4 },
      { name: 'Programming in C', credit: 3 },
      { name: 'Basic Electronics', credit: 3 },
      { name: 'Environmental Science', credit: 2 }
    ],
    '3': [
      { name: 'Engineering Mechanics', credit: 4 },
      { name: 'Building Materials', credit: 3 },
      { name: 'Surveying', credit: 4 },
      { name: 'Fluid Mechanics', credit: 3 },
      { name: 'Structural Analysis-I', credit: 3 }
    ],
    '4': [
      { name: 'Concrete Technology', credit: 3 },
      { name: 'Structural Analysis-II', credit: 3 },
      { name: 'Geotechnical Engineering-I', credit: 4 },
      { name: 'Hydraulic Engineering', credit: 4 },
      { name: 'Transportation Engineering-I', credit: 3 }
    ],
    '5': [
      { name: 'Design of Concrete Structures', credit: 4 },
      { name: 'Geotechnical Engineering-II', credit: 4 },
      { name: 'Transportation Engineering-II', credit: 3 },
      { name: 'Professional Elective-I', credit: 3 },
      { name: 'Open Elective-I', credit: 3 }
    ],
    '6': [
      { name: 'Design of Steel Structures', credit: 4 },
      { name: 'Environmental Engineering', credit: 4 },
      { name: 'Construction Management', credit: 3 },
      { name: 'Professional Elective-II', credit: 3 },
      { name: 'Open Elective-II', credit: 3 }
    ],
    '7': [
      { name: 'Advanced Structural Design', credit: 4 },
      { name: 'Water Resources Engineering', credit: 3 },
      { name: 'Professional Elective-III', credit: 3 },
      { name: 'Professional Elective-IV', credit: 3 },
      { name: 'Project-I', credit: 2 }
    ],
    '8': [
      { name: 'Earthquake Engineering', credit: 3 },
      { name: 'Professional Elective-V', credit: 3 },
      { name: 'Professional Elective-VI', credit: 3 },
      { name: 'Project-II', credit: 6 }
    ]
  }
};

// Generate subjects by branch and semester
export const generateSubjectsByBranch = (branch: string, semester: string = ''): Partial<Subject>[] => {
  if (!branch) return [];
  
  if (semester && branchSubjectMap[branch] && branchSubjectMap[branch][semester]) {
    return branchSubjectMap[branch][semester] || [];
  }
  
  // If no specific semester or branch not found, return default subjects
  const defaultSubjects = [
    { name: 'Subject 1', credit: 3 },
    { name: 'Subject 2', credit: 3 },
    { name: 'Subject 3', credit: 4 },
    { name: 'Subject 4', credit: 3 },
    { name: 'Subject 5', credit: 2 }
  ];
  
  return defaultSubjects;
};

// Get performance message based on SGPA
export const getPerformanceMessage = (sgpa: number): { message: string; color: string } => {
  if (sgpa >= 9.5) return { message: "Outstanding!", color: "text-green-400" };
  if (sgpa >= 8.5) return { message: "Excellent!", color: "text-emerald-400" };
  if (sgpa >= 7.5) return { message: "Very Good", color: "text-lime-400" };
  if (sgpa >= 6.5) return { message: "Good", color: "text-yellow-400" };
  if (sgpa >= 5.5) return { message: "Average", color: "text-amber-400" };
  if (sgpa >= 5.0) return { message: "Pass", color: "text-orange-400" };
  return { message: "Needs Improvement", color: "text-rose-500" };
};

export const branches = [
  'CSE', 'ECE', 'EEE', 'ME', 'CE', 'IT', 'CIVIL', 'BIOTECH'
];

export const semesters = [
  '1', '2', '3', '4', '5', '6', '7', '8'
];
