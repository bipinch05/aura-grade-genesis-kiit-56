
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
  
  // Create the report content
  const html = generateReportHTML(data, type);
  
  // Create wrapper div that will be invisible but present in DOM
  const container = document.createElement('div');
  container.id = 'pdf-container-hidden';
  container.style.position = 'fixed';
  container.style.top = '-9999px';
  container.style.left = '-9999px';
  container.style.height = '297mm';  // A4 height
  container.style.width = '210mm';   // A4 width
  container.style.padding = '0';
  container.style.backgroundColor = '#111'; // Ensure background color
  container.style.overflow = 'hidden';
  container.style.zIndex = '-1000';
  container.style.visibility = 'hidden';
  
  // Add container to body
  document.body.appendChild(container);
  
  // Set inner HTML after appending to body
  container.innerHTML = html;
  
  console.log("Container added to document, starting rendering");

  // Force a browser repaint for container elements
  setTimeout(() => {
    console.log("Creating PDF from content");
    
    // Configure html2pdf options with increased scale for better quality
    const opt = {
      margin: 10,
      filename: `${data.studentName}_${type === 'sgpa' ? 'SGPA' : 'CGPA'}_Report.pdf`,
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: true,
        backgroundColor: '#111',
        // Important: Explicitly set bounds to the container
        windowWidth: 210 * 2.83, // Convert mm to px at 96dpi (210mm ≈ 794px)
        windowHeight: 297 * 2.83, // Convert mm to px at 96dpi (297mm ≈ 1123px)
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: false,
        precision: 16
      },
      pagebreak: { mode: 'avoid-all' }
    };

    // Generate PDF with explicit promise handling
    html2pdf()
      .from(container)
      .set(opt)
      .outputPdf('dataurlstring')
      .then((pdfDataUri) => {
        console.log("PDF data URI generated successfully, length: ", pdfDataUri.length);
        
        // Create a blob from the data URI
        const byteString = atob(pdfDataUri.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        
        const blob = new Blob([ab], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        // Create a download link and trigger it
        const link = document.createElement('a');
        link.href = url;
        link.download = `${data.studentName}_${type === 'sgpa' ? 'SGPA' : 'CGPA'}_Report.pdf`;
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        setTimeout(() => {
          URL.revokeObjectURL(url);
          document.body.removeChild(link);
          if (document.body.contains(container)) {
            document.body.removeChild(container);
          }
          console.log("PDF generation completed successfully");
        }, 100);
      })
      .catch(error => {
        console.error("PDF generation error:", error);
        // Clean up even on error
        if (document.body.contains(container)) {
          document.body.removeChild(container);
        }
      });
  }, 2000); // Increased timeout to ensure rendering completes
};

const generateReportHTML = (data: ReportData, type: 'sgpa' | 'cgpa'): string => {
  // Base styles - with !important to override any conflicting styles
  const styles = `
    * {
      box-sizing: border-box !important;
      font-family: 'Arial', sans-serif !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    body {
      margin: 0 !important;
      padding: 0 !important;
      background-color: #111 !important;
      color: #fff !important;
      font-size: 12px !important;
      line-height: 1.5 !important;
    }
    .container {
      width: 190mm !important;
      margin: 0 auto !important;
      padding: 15mm !important;
      background-color: #111 !important;
    }
    .header {
      display: flex !important;
      justify-content: space-between !important;
      margin-bottom: 30px !important;
      padding-bottom: 20px !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
    }
    .title {
      font-size: 24px !important;
      font-weight: 700 !important;
      margin: 0 !important;
    }
    .subtitle {
      font-size: 12px !important;
      color: #999 !important;
      margin: 0 !important;
    }
    .info-card {
      background: rgba(30, 30, 30, 0.9) !important;
      padding: 20px !important;
      border-radius: 8px !important;
      margin-bottom: 25px !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
    }
    .info-title {
      margin-top: 0 !important;
      margin-bottom: 15px !important;
      font-size: 18px !important;
      color: #C084FC !important;
    }
    .info-grid {
      display: grid !important;
      grid-template-columns: 1fr 1fr !important;
      gap: 15px !important;
    }
    .info-item {
      margin: 8px 0 !important;
      font-size: 14px !important;
    }
    .info-label {
      color: #999 !important;
    }
    .info-value {
      font-weight: 500 !important;
    }
    table {
      width: 100% !important;
      border-collapse: collapse !important;
      margin: 15px 0 !important;
    }
    th {
      padding: 10px !important;
      text-align: left !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
      background: rgba(0, 0, 0, 0.2) !important;
      color: #fff !important;
      font-weight: 600 !important;
    }
    td {
      padding: 10px !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
      color: #fff !important;
    }
    tr:nth-child(even) {
      background: rgba(0, 0, 0, 0.1) !important;
    }
    .grade-badge {
      display: inline-block !important;
      padding: 5px 10px !important;
      color: #000 !important;
      font-weight: 600 !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      text-align: center !important;
    }
    .result-box {
      background: linear-gradient(135deg, #9b87f5, #0EA5E9) !important;
      padding: 15px 60px !important;
      border-radius: 100px !important;
      text-align: center !important;
      margin: 30px auto !important;
      width: fit-content !important;
    }
    .result-label {
      margin: 0 !important;
      font-size: 16px !important;
      color: #fff !important;
      font-weight: 500 !important;
    }
    .result-value {
      margin: 10px 0 0 !important;
      font-size: 48px !important;
      color: #fff !important;
      font-weight: 700 !important;
    }
    .footer {
      padding-top: 20px !important;
      border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
      text-align: center !important;
      font-size: 12px !important;
      color: #999 !important;
      margin-top: 40px !important;
    }
  `;

  // Start building the HTML as a complete standalone document
  let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${data.studentName} - ${type === 'sgpa' ? 'SGPA' : 'CGPA'} Report</title>
      <style>${styles}</style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div>
            <h1 class="title">
              <span style="color: #C084FC !important;">KIIT</span>
              <span style="color: #67E8F9 !important;">-CONNECT</span>
            </h1>
            <p class="subtitle">Academic Performance Report</p>
          </div>
          <div style="text-align: right;">
            <p class="info-item">Generated on: ${new Date().toLocaleDateString()}</p>
            <p class="info-item" style="color: #C084FC !important;">${type === 'sgpa' ? 'SGPA' : 'CGPA'} Report</p>
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
              <th style="text-align: center !important;">Credits</th>
              <th style="text-align: center !important;">Grade</th>
              <th style="text-align: center !important;">Grade Points</th>
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
          <td style="text-align: center !important;">${subject.credit}</td>
          <td style="text-align: center !important;">
            <span class="grade-badge" style="background-color: ${gradeColor} !important;">
              ${subject.grade}
            </span>
          </td>
          <td style="text-align: center !important;">${gradePoint}</td>
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
              <th style="text-align: center !important;">Credits</th>
              <th style="text-align: center !important;">SGPA</th>
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
          <td style="text-align: center !important;">${semester.credits}</td>
          <td style="text-align: center !important;">
            <span class="grade-badge" style="background-color: ${sgpaColor} !important;">
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
      
      <div style="margin: 30px auto !important; width: 80% !important;">
        <div style="height: 10px !important; background: rgba(255, 255, 255, 0.1) !important; border-radius: 5px !important; overflow: hidden !important;">
          <div style="height: 100% !important; width: ${Math.min(100, (data.cgpa || 0) * 10)}% !important; background: linear-gradient(to right, #0EA5E9, #9b87f5) !important;"></div>
        </div>
        <div style="display: flex !important; justify-content: space-between !important; margin-top: 5px !important; font-size: 12px !important; color: #999 !important;">
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
          <p style="margin: 0 !important;">This is an automatically generated report by KIIT-CONNECT.</p>
          <p style="margin: 5px 0 0 !important;">For official grades and transcripts, please contact the university examination department.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return html;
};
