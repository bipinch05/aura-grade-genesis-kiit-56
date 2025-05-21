
import html2pdf from 'html2pdf.js';
import { Subject, Semester } from './calculationUtils';

export interface ReportData {
  studentName: string;
  rollNumber: string;
  branch: string;
  semester: string;
  subjects: Subject[];
  sgpa: number;
  allSemesters?: Semester[];
  cgpa?: number;
}

export const generatePDF = (data: ReportData, type: 'sgpa' | 'cgpa'): void => {
  // Create the report content
  const html = generateReportHTML(data, type);
  
  // Create a dedicated container for the PDF
  const container = document.createElement('div');
  container.style.width = '210mm';
  container.style.backgroundColor = '#111';
  container.style.position = 'absolute';
  container.style.top = '-9999px';
  container.style.left = '-9999px';
  container.innerHTML = html;
  
  // Append to document body to render it
  document.body.appendChild(container);
  
  // Configure html2pdf options
  const opt = {
    margin: 10,
    filename: `${data.studentName}_${type === 'sgpa' ? 'SGPA' : 'CGPA'}_Report.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#111'
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait' 
    }
  };

  // Use a generous timeout to ensure the container is fully rendered
  setTimeout(() => {
    // Generate PDF
    html2pdf().from(container).set(opt).save().then(() => {
      console.log('PDF generation completed successfully');
      // Clean up
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    }).catch(error => {
      console.error('PDF generation error:', error);
      // Clean up even on error
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    });
  }, 1000);
};

const generateReportHTML = (data: ReportData, type: 'sgpa' | 'cgpa'): string => {
  // Base styles
  const styles = `
    * {
      box-sizing: border-box;
      font-family: 'Arial', sans-serif;
    }
    body {
      margin: 0;
      padding: 0;
      background-color: #111;
      color: #fff;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
      background-color: #111;
    }
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .title {
      font-size: 24px;
      font-weight: 700;
      margin: 0;
    }
    .subtitle {
      font-size: 12px;
      color: #999;
      margin: 0;
    }
    .info-card {
      background: rgba(255, 255, 255, 0.05);
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 25px;
    }
    .info-title {
      margin-top: 0;
      margin-bottom: 15px;
      font-size: 18px;
      color: #C084FC;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }
    .info-item {
      margin: 8px 0;
      font-size: 14px;
    }
    .info-label {
      color: #999;
    }
    .info-value {
      font-weight: 500;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.2);
    }
    td {
      padding: 10px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    tr:nth-child(even) {
      background: rgba(0, 0, 0, 0.1);
    }
    .grade-badge {
      display: inline-block;
      padding: 5px 10px;
      color: #000;
      font-weight: 600;
      border-radius: 4px;
      font-size: 12px;
    }
    .result-box {
      background: linear-gradient(135deg, #9b87f5, #0EA5E9);
      padding: 15px 60px;
      border-radius: 100px;
      text-align: center;
      margin: 30px auto;
      width: fit-content;
    }
    .result-label {
      margin: 0;
      font-size: 16px;
      color: #fff;
      font-weight: 500;
    }
    .result-value {
      margin: 10px 0 0;
      font-size: 48px;
      color: #fff;
      font-weight: 700;
    }
    .footer {
      padding-top: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      text-align: center;
      font-size: 12px;
      color: #999;
      margin-top: 40px;
    }
  `;

  // Start building the HTML
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>${styles}</style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div>
            <h1 class="title">
              <span style="color: #C084FC;">KIIT</span>
              <span style="color: #67E8F9;">-CONNECT</span>
            </h1>
            <p class="subtitle">Academic Performance Report</p>
          </div>
          <div style="text-align: right;">
            <p class="info-item">Generated on: ${new Date().toLocaleDateString()}</p>
            <p class="info-item" style="color: #C084FC;">${type === 'sgpa' ? 'SGPA' : 'CGPA'} Report</p>
          </div>
        </div>
        
        <div class="info-card">
          <h2 class="info-title">Student Information</h2>
          <div class="info-grid">
            <div>
              <p class="info-item">
                <span class="info-label">Name:</span> 
                <span class="info-value">${data.studentName}</span>
              </p>
              <p class="info-item">
                <span class="info-label">Roll Number:</span> 
                <span class="info-value">${data.rollNumber}</span>
              </p>
            </div>
            <div>
              <p class="info-item">
                <span class="info-label">Branch:</span> 
                <span class="info-value">${data.branch}</span>
              </p>
              <p class="info-item">
                <span class="info-label">Semester:</span> 
                <span class="info-value">${data.semester}</span>
              </p>
            </div>
          </div>
        </div>
  `;
  
  // SGPA specific content
  if (type === 'sgpa') {
    html += `
      <div class="info-card">
        <h2 class="info-title">Semester Performance</h2>
        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th style="text-align: center;">Credits</th>
              <th style="text-align: center;">Grade</th>
              <th style="text-align: center;">Grade Points</th>
            </tr>
          </thead>
          <tbody>
    `;
    
    data.subjects.forEach(subject => {
      const gradePoint = subject.grade ? 
        ['O', 'E', 'A', 'B', 'C', 'D', 'F'].indexOf(subject.grade) >= 0 ? 
          (10 - ['O', 'E', 'A', 'B', 'C', 'D', 'F'].indexOf(subject.grade)) : 0 : 0;
      
      let gradeColor = '#999';
      if (subject.grade === 'O' || subject.grade === 'E') gradeColor = '#4ade80';
      else if (subject.grade === 'A') gradeColor = '#22d3ee';
      else if (subject.grade === 'B') gradeColor = '#fb923c';
      else if (subject.grade === 'C' || subject.grade === 'D') gradeColor = '#f87171';
      else if (subject.grade === 'F') gradeColor = '#f43f5e';
      
      html += `
        <tr>
          <td>${subject.name}</td>
          <td style="text-align: center;">${subject.credit}</td>
          <td style="text-align: center;">
            <span class="grade-badge" style="background-color: ${gradeColor};">
              ${subject.grade}
            </span>
          </td>
          <td style="text-align: center;">${gradePoint}</td>
        </tr>
      `;
    });
    
    html += `
          </tbody>
        </table>
      </div>
      
      <div class="result-box">
        <p class="result-label">Semester Grade Point Average (SGPA)</p>
        <h2 class="result-value">${data.sgpa.toFixed(2)}</h2>
      </div>
    `;
  } 
  // CGPA specific content
  else if (type === 'cgpa' && data.allSemesters) {
    html += `
      <div class="info-card">
        <h2 class="info-title">Academic Performance Summary</h2>
        <table>
          <thead>
            <tr>
              <th>Semester</th>
              <th style="text-align: center;">Credits</th>
              <th style="text-align: center;">SGPA</th>
            </tr>
          </thead>
          <tbody>
    `;
    
    data.allSemesters.forEach(semester => {
      let sgpaColor = '#999';
      if (semester.sgpa >= 9.0) sgpaColor = '#4ade80';
      else if (semester.sgpa >= 8.0) sgpaColor = '#22d3ee';
      else if (semester.sgpa >= 7.0) sgpaColor = '#fb923c';
      else if (semester.sgpa >= 6.0) sgpaColor = '#f87171';
      else sgpaColor = '#f43f5e';
      
      html += `
        <tr>
          <td>${semester.name}</td>
          <td style="text-align: center;">${semester.credits}</td>
          <td style="text-align: center;">
            <span class="grade-badge" style="background-color: ${sgpaColor};">
              ${semester.sgpa.toFixed(2)}
            </span>
          </td>
        </tr>
      `;
    });
    
    html += `
          </tbody>
        </table>
      </div>
      
      <div class="result-box">
        <p class="result-label">Cumulative Grade Point Average (CGPA)</p>
        <h2 class="result-value">${(data.cgpa || 0).toFixed(2)}</h2>
      </div>
      
      <div style="margin: 30px auto; width: 80%;">
        <div style="height: 10px; background: rgba(255, 255, 255, 0.1); border-radius: 5px; overflow: hidden;">
          <div style="height: 100%; width: ${Math.min(100, (data.cgpa || 0) * 10)}%; background: linear-gradient(to right, #0EA5E9, #9b87f5);"></div>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 5px; font-size: 12px; color: #999;">
          <span>0</span>
          <span>2.5</span>
          <span>5.0</span>
          <span>7.5</span>
          <span>10.0</span>
        </div>
      </div>
    `;
  }
  
  // Common footer
  html += `
        <div class="footer">
          <p style="margin: 0;">This is an automatically generated report by KIIT-CONNECT.</p>
          <p style="margin: 5px 0 0;">For official grades and transcripts, please contact the university examination department.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return html;
};
