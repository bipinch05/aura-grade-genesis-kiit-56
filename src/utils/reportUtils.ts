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
  // First, create a separate container that won't be attached to the DOM
  const reportContainer = document.createElement('div');
  reportContainer.innerHTML = generateReportHTML(data, type);
  
  // Temporarily append to document body to ensure proper rendering
  // but keep it hidden from view
  reportContainer.style.position = 'absolute';
  reportContainer.style.left = '-9999px';
  reportContainer.style.top = '-9999px';
  document.body.appendChild(reportContainer);
  
  // Give browser time to render the content before capturing it
  setTimeout(() => {
    // Set options for PDF with more conservative settings
    const options = {
      margin: 10, // Add some margin to prevent cutoff
      filename: `${data.studentName}_${type === 'sgpa' ? 'SGPA' : 'CGPA'}_Report.pdf`,
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: { 
        scale: 1.5, // Lower scale for better performance
        useCORS: true, 
        logging: true, // Enable logging for debugging
        allowTaint: true, // Allow cross-origin images
        removeContainer: true // Clean up the temporary container
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      }
    };
    
    // Generate PDF with promise chain for better error handling
    html2pdf()
      .from(reportContainer)
      .set(options)
      .save()
      .then(() => {
        // Clean up - remove the temporary container
        if (document.body.contains(reportContainer)) {
          document.body.removeChild(reportContainer);
        }
        console.log('PDF generation completed successfully');
      })
      .catch((error) => {
        console.error('PDF generation error:', error);
        // Clean up even if there's an error
        if (document.body.contains(reportContainer)) {
          document.body.removeChild(reportContainer);
        }
      });
  }, 500); // 500ms delay to ensure DOM rendering
};

const generateReportHTML = (data: ReportData, type: 'sgpa' | 'cgpa'): string => {
  // Common header with adjusted padding for full bleed
  let html = `
    <div style="
      font-family: 'Poppins', sans-serif;
      max-width: 100%;
      margin: 0;
      padding: 30px;
      background: linear-gradient(135deg, #111, #1a1a1a);
      color: #fff;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
      position: relative;
    ">
      <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      ">
        <div style="display: flex; align-items: center;">
          <div style="
            position: relative;
            width: 40px;
            height: 40px;
            margin-right: 15px;
          ">
            <div style="
              position: absolute;
              inset: 0;
              background-color: #C084FC;
              border-radius: 5px;
              transform: rotate(45deg);
            "></div>
            <div style="
              position: absolute;
              inset: 5px;
              background-color: #1a1a1a;
              border-radius: 3px;
              transform: rotate(45deg);
            "></div>
            <div style="
              position: absolute;
              inset: 10px;
              background-color: #67E8F9;
              border-radius: 1px;
              transform: rotate(45deg);
            "></div>
          </div>
          <div>
            <h1 style="margin: 0; font-size: 24px; font-weight: 700;">
              <span style="color: #C084FC;">KIIT</span>
              <span style="color: #67E8F9;">-CONNECT</span>
            </h1>
            <p style="margin: 0; font-size: 12px; color: #999;">Academic Performance Report</p>
          </div>
        </div>
        <div style="text-align: right;">
          <p style="margin: 0; font-size: 14px;">Generated on: ${new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</p>
          <p style="margin: 0; font-size: 14px; color: #C084FC;">${type === 'sgpa' ? 'SGPA' : 'CGPA'} Report</p>
        </div>
      </div>
      
      <div style="
        background: rgba(255, 255, 255, 0.05);
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 25px;
      ">
        <h2 style="margin-top: 0; margin-bottom: 15px; font-size: 18px; color: #C084FC;">Student Information</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div>
            <p style="margin: 8px 0; font-size: 14px;">
              <span style="color: #999;">Name:</span> 
              <span style="font-weight: 500;">${data.studentName}</span>
            </p>
            <p style="margin: 8px 0; font-size: 14px;">
              <span style="color: #999;">Roll Number:</span> 
              <span style="font-weight: 500;">${data.rollNumber}</span>
            </p>
          </div>
          <div>
            <p style="margin: 8px 0; font-size: 14px;">
              <span style="color: #999;">Branch:</span> 
              <span style="font-weight: 500;">${data.branch}</span>
            </p>
            <p style="margin: 8px 0; font-size: 14px;">
              <span style="color: #999;">Semester:</span> 
              <span style="font-weight: 500;">${data.semester}</span>
            </p>
          </div>
        </div>
      </div>
  `;
  
  // SGPA specific content
  if (type === 'sgpa') {
    html += `
      <div style="
        background: rgba(255, 255, 255, 0.05);
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 25px;
        flex-grow: 1;
      ">
        <h2 style="margin-top: 0; margin-bottom: 15px; font-size: 18px; color: #C084FC;">Semester Performance</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: rgba(0, 0, 0, 0.2);">
              <th style="padding: 10px; text-align: left; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">Subject</th>
              <th style="padding: 10px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">Credits</th>
              <th style="padding: 10px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">Grade</th>
              <th style="padding: 10px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">Grade Points</th>
            </tr>
          </thead>
          <tbody>
    `;
    
    data.subjects.forEach((subject, index) => {
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
        <tr style="background: ${index % 2 === 0 ? 'transparent' : 'rgba(0, 0, 0, 0.1)'};">
          <td style="padding: 10px; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">${subject.name}</td>
          <td style="padding: 10px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">${subject.credit}</td>
          <td style="padding: 10px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
            <span style="
              display: inline-block;
              padding: 5px 10px;
              background-color: ${gradeColor};
              color: #000;
              font-weight: 600;
              border-radius: 4px;
              font-size: 12px;
            ">${subject.grade}</span>
          </td>
          <td style="padding: 10px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">${gradePoint}</td>
        </tr>
      `;
    });
    
    html += `
          </tbody>
        </table>
      </div>
      
      <div style="
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 20px;
        margin-bottom: 30px;
      ">
        <div style="
          background: linear-gradient(135deg, #9b87f5, #0EA5E9);
          padding: 15px 60px;
          border-radius: 100px;
          text-align: center;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
          position: relative;
          overflow: hidden;
        ">
          <div style="
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(155, 135, 245, 0.3), rgba(14, 165, 233, 0.3));
            filter: blur(20px);
            z-index: 0;
          "></div>
          <div style="position: relative; z-index: 1;">
            <p style="margin: 0; font-size: 16px; color: #fff; font-weight: 500; text-shadow: 0 1px 3px rgba(0,0,0,0.2);">Semester Grade Point Average (SGPA)</p>
            <h2 style="margin: 10px 0 0; font-size: 48px; color: #fff; font-weight: 700; text-shadow: 0 2px 5px rgba(0,0,0,0.3);">${data.sgpa.toFixed(2)}</h2>
          </div>
        </div>
      </div>
    `;
  } 
  // CGPA specific content
  else if (type === 'cgpa' && data.allSemesters) {
    html += `
      <div style="
        background: rgba(255, 255, 255, 0.05);
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 25px;
        flex-grow: 1;
      ">
        <h2 style="margin-top: 0; margin-bottom: 15px; font-size: 18px; color: #C084FC;">Academic Performance Summary</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: rgba(0, 0, 0, 0.2);">
              <th style="padding: 10px; text-align: left; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">Semester</th>
              <th style="padding: 10px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">Credits</th>
              <th style="padding: 10px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">SGPA</th>
            </tr>
          </thead>
          <tbody>
    `;
    
    data.allSemesters.forEach((semester, index) => {
      let sgpaColor = '#999';
      if (semester.sgpa >= 9.0) sgpaColor = '#4ade80';
      else if (semester.sgpa >= 8.0) sgpaColor = '#22d3ee';
      else if (semester.sgpa >= 7.0) sgpaColor = '#fb923c';
      else if (semester.sgpa >= 6.0) sgpaColor = '#f87171';
      else sgpaColor = '#f43f5e';
      
      html += `
        <tr style="background: ${index % 2 === 0 ? 'transparent' : 'rgba(0, 0, 0, 0.1)'};">
          <td style="padding: 10px; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">${semester.name}</td>
          <td style="padding: 10px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">${semester.credits}</td>
          <td style="padding: 10px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
            <span style="
              display: inline-block;
              padding: 5px 10px;
              background-color: ${sgpaColor};
              color: #000;
              font-weight: 600;
              border-radius: 4px;
              font-size: 12px;
            ">${semester.sgpa.toFixed(2)}</span>
          </td>
        </tr>
      `;
    });
    
    html += `
          </tbody>
        </table>
      </div>
      
      <div style="
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 20px;
        margin-bottom: 30px;
      ">
        <div style="
          background: linear-gradient(135deg, #9b87f5, #0EA5E9);
          padding: 15px 60px;
          border-radius: 100px;
          text-align: center;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
          position: relative;
          overflow: hidden;
        ">
          <div style="
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(155, 135, 245, 0.3), rgba(14, 165, 233, 0.3));
            filter: blur(20px);
            z-index: 0;
          "></div>
          <div style="position: relative; z-index: 1;">
            <p style="margin: 0; font-size: 16px; color: #fff; font-weight: 500; text-shadow: 0 1px 3px rgba(0,0,0,0.2);">Cumulative Grade Point Average (CGPA)</p>
            <h2 style="margin: 10px 0 0; font-size: 48px; color: #fff; font-weight: 700; text-shadow: 0 2px 5px rgba(0,0,0,0.3);">${(data.cgpa || 0).toFixed(2)}</h2>
          </div>
        </div>
      </div>
      
      <div style="margin-top: 20px; margin-bottom: 30px; text-align: center;">
        <div style="
          width: 80%;
          margin: 0 auto;
          height: 10px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 5px;
          overflow: hidden;
        ">
          <div style="
            height: 100%;
            width: ${Math.min(100, (data.cgpa || 0) * 10)}%;
            background: linear-gradient(to right, #0EA5E9, #9b87f5);
          "></div>
        </div>
        <div style="
          display: flex;
          justify-content: space-between;
          width: 80%;
          margin: 5px auto 0;
          font-size: 12px;
          color: #999;
        ">
          <span>0</span>
          <span>2.5</span>
          <span>5.0</span>
          <span>7.5</span>
          <span>10.0</span>
        </div>
      </div>
    `;
  }
  
  // Common footer - moved up to avoid white space
  html += `
      <div style="
        padding-top: 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        text-align: center;
        font-size: 12px;
        color: #999;
        margin-top: auto;
        margin-bottom: 0;
      ">
        <p style="margin: 0;">This is an automatically generated report by KIIT-CONNECT.</p>
        <p style="margin: 5px 0 0;">For official grades and transcripts, please contact the university examination department.</p>
      </div>
    </div>
  `;
  
  return html;
};
