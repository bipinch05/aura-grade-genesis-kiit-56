
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
  console.log("Starting PDF generation process");
  
  // Create a completely isolated iframe for PDF generation
  const iframe = document.createElement('iframe');
  iframe.style.visibility = 'hidden';
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.width = '0';
  iframe.height = '0';
  iframe.style.border = 'none';
  document.body.appendChild(iframe);
  
  // Generate HTML content
  const htmlContent = generateReportHTML(data, type);
  
  // Wait for iframe to load then write content
  iframe.onload = () => {
    try {
      // Access iframe document and write content
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) {
        console.error("Cannot access iframe document");
        document.body.removeChild(iframe);
        return;
      }
      
      // Write the complete HTML document to the iframe
      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();
      
      console.log("HTML content written to iframe, waiting for render");
      
      // Wait for content to render before generating PDF
      setTimeout(() => {
        try {
          console.log("Attempting to generate PDF from iframe content");
          
          // Configure PDF options
          const opt = {
            margin: 10,
            filename: `${data.studentName}_${type === 'sgpa' ? 'SGPA' : 'CGPA'}_Report.pdf`,
            image: { type: 'jpeg', quality: 0.95 },
            html2canvas: { 
              scale: 2,
              useCORS: true,
              backgroundColor: '#ffffff'
            },
            jsPDF: { 
              unit: 'mm', 
              format: 'a4', 
              orientation: 'portrait'
            }
          };
          
          // Get the body element of the iframe
          const element = iframeDoc.body;
          
          // Generate PDF
          html2pdf().from(element).set(opt).save().then(() => {
            console.log("PDF generated and saved successfully");
            
            // Clean up - remove iframe after slight delay to ensure PDF generation completes
            setTimeout(() => {
              if (document.body.contains(iframe)) {
                document.body.removeChild(iframe);
              }
            }, 1000);
          }).catch(error => {
            console.error("Error in final PDF generation:", error);
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
          });
          
        } catch (error) {
          console.error("Error during PDF generation process:", error);
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }
      }, 3000); // Longer wait time for content rendering
    } catch (error) {
      console.error("Error in iframe setup:", error);
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }
  };
  
  // Handle iframe load errors
  iframe.onerror = () => {
    console.error("iframe failed to load");
    if (document.body.contains(iframe)) {
      document.body.removeChild(iframe);
    }
  };
};

const generateReportHTML = (data: ReportData, type: 'sgpa' | 'cgpa'): string => {
  // Create a complete standalone HTML document with light theme
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${data.studentName} - ${type === 'sgpa' ? 'SGPA' : 'CGPA'} Report</title>
      <style>
        /* Reset and base styles */
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: Arial, Helvetica, sans-serif;
        }
        
        body {
          background-color: #ffffff;
          color: #333333;
          font-size: 12pt;
          line-height: 1.5;
          padding: 20mm;
        }
        
        .report-container {
          max-width: 100%;
        }
        
        /* Header styles */
        .header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
          padding-bottom: 15px;
          border-bottom: 2px solid #e0e0e0;
        }
        
        .logo {
          font-size: 24pt;
          font-weight: bold;
        }
        
        .logo-primary {
          color: #6C63FF;
        }
        
        .logo-secondary {
          color: #5271FF;
        }
        
        .subtitle {
          font-size: 12pt;
          color: #666666;
        }
        
        .date-info {
          text-align: right;
        }
        
        /* Info card styles */
        .info-card {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 25px;
          border: 1px solid #e0e0e0;
        }
        
        .card-title {
          color: #6C63FF;
          font-size: 18pt;
          margin-bottom: 15px;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        
        .info-item {
          margin: 8px 0;
        }
        
        .info-label {
          color: #666666;
          font-weight: normal;
        }
        
        .info-value {
          font-weight: bold;
        }
        
        /* Table styles */
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 15px 0;
        }
        
        th {
          background-color: #f0f0f0;
          color: #333333;
          padding: 12px 8px;
          text-align: left;
          border-bottom: 2px solid #dddddd;
        }
        
        td {
          padding: 10px 8px;
          border-bottom: 1px solid #eeeeee;
        }
        
        tr:nth-child(even) {
          background-color: #f8f9fa;
        }
        
        /* Grade badge styles */
        .grade-badge {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 4px;
          font-weight: bold;
          text-align: center;
        }
        
        /* Result box styles */
        .result-box {
          background: linear-gradient(135deg, #6C63FF, #5271FF);
          color: white;
          padding: 15px 60px;
          border-radius: 50px;
          text-align: center;
          margin: 30px auto;
          width: fit-content;
        }
        
        .result-label {
          font-size: 16pt;
          color: white;
        }
        
        .result-value {
          font-size: 48pt;
          color: white;
          font-weight: bold;
        }
        
        /* Progress bar styles */
        .progress-container {
          margin: 30px auto;
          width: 80%;
        }
        
        .progress-bar {
          height: 10px;
          background: #eeeeee;
          border-radius: 5px;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(to right, #5271FF, #6C63FF);
        }
        
        .progress-markers {
          display: flex;
          justify-content: space-between;
          margin-top: 5px;
          color: #666666;
        }
        
        /* Footer styles */
        .footer {
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
          text-align: center;
          font-size: 10pt;
          color: #666666;
          margin-top: 40px;
        }
      </style>
    </head>
    <body>
      <div class="report-container">
        <div class="header">
          <div>
            <div class="logo">
              <span class="logo-primary">KIIT</span><span class="logo-secondary">-CONNECT</span>
            </div>
            <p class="subtitle">Academic Performance Report</p>
          </div>
          <div class="date-info">
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
            <p style="color: #6C63FF; font-weight: bold;">${type === 'sgpa' ? 'SGPA' : 'CGPA'} Report</p>
          </div>
        </div>
        
        <div class="info-card">
          <h2 class="card-title">Student Information</h2>
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
        
        ${type === 'sgpa' ? generateSGPAContent(data) : generateCGPAContent(data)}
        
        <div class="footer">
          <p>This is an automatically generated report by KIIT-CONNECT.</p>
          <p>For official grades and transcripts, please contact the university examination department.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const generateSGPAContent = (data: ReportData): string => {
  let html = `
    <div class="info-card">
      <h2 class="card-title">Semester Performance</h2>
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
    
    let gradeColor = '#999999';
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
          <span class="grade-badge" style="background-color: ${gradeColor}; color: white;">
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
  
  return html;
};

const generateCGPAContent = (data: ReportData): string => {
  let html = `
    <div class="info-card">
      <h2 class="card-title">Academic Performance Summary</h2>
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
  
  if (data.allSemesters) {
    data.allSemesters.forEach(semester => {
      let sgpaColor = '#999999';
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
            <span class="grade-badge" style="background-color: ${sgpaColor}; color: white;">
              ${semester.sgpa.toFixed(2)}
            </span>
          </td>
        </tr>
      `;
    });
  }
  
  html += `
        </tbody>
      </table>
    </div>
    
    <div class="result-box">
      <p class="result-label">Cumulative Grade Point Average (CGPA)</p>
      <h2 class="result-value">${(data.cgpa || 0).toFixed(2)}</h2>
    </div>
    
    <div class="progress-container">
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${Math.min(100, (data.cgpa || 0) * 10)}%;"></div>
      </div>
      <div class="progress-markers">
        <span>0</span>
        <span>2.5</span>
        <span>5.0</span>
        <span>7.5</span>
        <span>10.0</span>
      </div>
    </div>
  `;
  
  return html;
};
