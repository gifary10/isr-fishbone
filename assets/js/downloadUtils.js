// downloadUtils.js
/**
 * Utility functions for downloading analysis results
 * @version 1.4.1
 * @license MIT
 */

import { 
  calculatePriorityByCategory, 
  getCommonCasePatterns 
} from './correlationUtils.js';
import { formatCategoryName } from './fishboneUtils.js';

// Preload necessary libraries
const preloadScripts = () => {
  return Promise.all([
    new Promise((resolve, reject) => {
      if (window.jspdf) return resolve();
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load jsPDF'));
      document.head.appendChild(script);
    }),
    new Promise((resolve, reject) => {
      if (window.html2canvas) return resolve();
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load html2canvas'));
      document.head.appendChild(script);
    })
  ]);
};

/**
 * Download the entire results page as a PDF
 */
export async function downloadResultsAsPDF(filename = 'fishbone-analysis-results') {
  try {
    await preloadScripts();
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    const container = document.documentElement;
    
    if (!container) throw new Error('Container element not found');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fullFilename = `${filename}-${timestamp}.pdf`;

    const options = {
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
      scrollX: 0,
      scrollY: 0,
      windowHeight: document.documentElement.scrollHeight,
      windowWidth: document.documentElement.scrollWidth
    };

    const canvas = await html2canvas(container, options);
    
    const imgWidth = doc.internal.pageSize.getWidth() - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const pageHeight = doc.internal.pageSize.getHeight() - 20;
    
    let heightLeft = imgHeight;
    let position = 0;
    
    doc.addImage(canvas, 'PNG', 10, 10, imgWidth, imgHeight, undefined, 'FAST');
    
    while (heightLeft >= 0) {
      position = heightLeft - pageHeight;
      doc.addPage();
      doc.addImage(canvas, 'PNG', 10, -position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
    }

    doc.save(fullFilename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

/**
 * Download the fishbone diagram as PNG
 */
export async function downloadDiagramAsPNG(filename = 'fishbone-diagram') {
  try {
    await preloadScripts();
    const diagramContainer = document.getElementById('fishboneDiagram');
    if (!diagramContainer) throw new Error('Fishbone diagram container not found');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fullFilename = `${filename}-${timestamp}.png`;

    const canvas = await html2canvas(diagramContainer, {
      scale: 2,
      logging: false,
      useCORS: true,
      backgroundColor: '#f8f9fa'
    });

    const link = document.createElement('a');
    link.download = fullFilename;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error generating PNG:', error);
    throw error;
  }
}

/**
 * Generate structured PDF report
 */
export async function generateStructuredReport(
  analysisData, allData, creatorName = '', supervisorName = '', filename = 'fishbone-analysis-report'
) {
  try {
    await preloadScripts();
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    const LINE_HEIGHT = 6; 
    const PAGE_HEIGHT = doc.internal.pageSize.getHeight();
    const MARGIN_X = 20;
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fullFilename = `${filename}-${timestamp}.pdf`;
    let yPos = 20;

    const checkPageBreak = (extra = 15) => {
      if (yPos + extra > PAGE_HEIGHT - 20) {
        doc.addPage();
        yPos = 20;
      }
    };

    // === Header ===
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text('Fishbone Analysis Report', 105, yPos, { align: 'center' });
    yPos += LINE_HEIGHT * 2;

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, yPos, { align: 'center' });
    yPos += LINE_HEIGHT * 2;

    // === Summary ===
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text('1. Analysis Summary', MARGIN_X - 5, yPos);
    yPos += LINE_HEIGHT * 2;

    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);

    let totalCauses = 0;
    let criticalCount = 0;
    const categoryCounts = {};
    for (const [category, causeIds] of Object.entries(analysisData)) {
      if (!Array.isArray(causeIds)) continue;
      categoryCounts[category] = causeIds.length;
      totalCauses += causeIds.length;
      for (const causeId of causeIds) {
        const cause = allData[category]?.find(item => item?.id === causeId);
        if (cause?.priority?.toLowerCase() === 'critical') criticalCount++;
      }
    }

    doc.text(`Total Causes Identified: ${totalCauses}`, MARGIN_X, yPos);
    yPos += LINE_HEIGHT;
    doc.text(`Critical Priority Causes: ${criticalCount}`, MARGIN_X, yPos);
    yPos += LINE_HEIGHT;
    doc.text(`Categories with Causes: ${Object.keys(categoryCounts).length}`, MARGIN_X, yPos);
    yPos += LINE_HEIGHT * 2;

    // === Priority Distribution Table ===
    const priorityByCategory = calculatePriorityByCategory(analysisData, allData);
    if (priorityByCategory && Object.keys(priorityByCategory).length > 0) {
      doc.setFontSize(14);
      doc.text('2. Priority Distribution by Category', MARGIN_X - 5, yPos);
      yPos += LINE_HEIGHT * 2;

      doc.setFontSize(11);
      let tableX = MARGIN_X;

      doc.setTextColor(255, 255, 255);
      doc.setFillColor(58, 58, 60);
      doc.rect(tableX, yPos, 170, LINE_HEIGHT, 'F');
      doc.text('Category', tableX + 5, yPos + 4);
      doc.text('Critical', tableX + 60, yPos + 4);
      doc.text('High', tableX + 90, yPos + 4);
      doc.text('Medium', tableX + 120, yPos + 4);
      doc.text('Low', tableX + 150, yPos + 4);
      yPos += LINE_HEIGHT;

      doc.setTextColor(0, 0, 0);
      for (const [category, counts] of Object.entries(priorityByCategory)) {
        checkPageBreak();
        doc.setFillColor(240, 240, 240);
        doc.rect(tableX, yPos, 170, LINE_HEIGHT, 'F');
        doc.text(formatCategoryName(category), tableX + 5, yPos + 4);
        doc.text(counts.Critical.toString(), tableX + 60, yPos + 4);
        doc.text(counts.High.toString(), tableX + 90, yPos + 4);
        doc.text(counts.Medium.toString(), tableX + 120, yPos + 4);
        doc.text(counts.Low.toString(), tableX + 150, yPos + 4);
        yPos += LINE_HEIGHT;
      }
      yPos += LINE_HEIGHT;
    }

    // === Detailed Causes ===
    doc.setFontSize(14);
    doc.text('3. Detailed Causes', MARGIN_X - 5, yPos);
    yPos += LINE_HEIGHT * 2;

    for (const [category, causeIds] of Object.entries(analysisData)) {
      if (!Array.isArray(causeIds)) continue;
      checkPageBreak();
      doc.setFontSize(12);
      doc.setTextColor(40, 40, 40);
      doc.text(`${formatCategoryName(category)} (${causeIds.length} causes)`, MARGIN_X, yPos);
      yPos += LINE_HEIGHT;

      for (const causeId of causeIds) {
        const cause = allData[category]?.find(item => item?.id === causeId);
        if (!cause) continue;
        checkPageBreak();

        doc.setTextColor(40, 40, 40);
        doc.setFont(undefined, 'bold');
        doc.text(`${cause.cause} [${cause.priority || 'Medium'}]`, MARGIN_X + 5, yPos);
        doc.setFont(undefined, 'normal');
        yPos += LINE_HEIGHT;

        doc.setTextColor(80, 80, 80);
        doc.text(`Category: ${formatCategoryName(category)}`, MARGIN_X + 5, yPos);
        yPos += LINE_HEIGHT;

        const descriptionLines = doc.splitTextToSize(cause.description || 'No description available', 170);
        doc.text(descriptionLines, MARGIN_X + 5, yPos);
        yPos += descriptionLines.length * (LINE_HEIGHT - 1) + 3;

        if (Array.isArray(cause.solutions)) {
          doc.setTextColor(40, 40, 40);
          doc.text('Solutions:', MARGIN_X + 5, yPos);
          yPos += LINE_HEIGHT;

          doc.setTextColor(80, 80, 80);
          cause.solutions.forEach(solution => {
            if (typeof solution === 'string' && solution.trim()) {
              const solutionLines = doc.splitTextToSize(solution.trim(), 170);
              doc.text(solutionLines, MARGIN_X + 10, yPos);
              yPos += solutionLines.length * (LINE_HEIGHT - 1) + 3;
            }
          });
        }
        yPos += LINE_HEIGHT;
      }
      yPos += LINE_HEIGHT;
    }

    // === Case Patterns ===
    const casePatterns = getCommonCasePatterns(analysisData, allData);
    if (casePatterns.length > 0) {
      doc.setFontSize(14);
      doc.text('4. Common Case Patterns', MARGIN_X - 5, yPos);
      yPos += LINE_HEIGHT * 2;
      doc.setFontSize(11);
      doc.setTextColor(80, 80, 80);

      casePatterns.forEach(pattern => {
        checkPageBreak();
        doc.text(`• ${pattern.keyword} (appears in ${pattern.count} cases)`, MARGIN_X, yPos);
        yPos += LINE_HEIGHT;
      });
    }

    // === Approval Section ===
    if (creatorName || supervisorName) {
      if (yPos > 220) {
        doc.addPage();
        yPos = 20;
      } else {
        yPos = 220;
      }
      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
      doc.text('5. Approval', MARGIN_X - 5, yPos);
      yPos += LINE_HEIGHT * 2;

      const tableX = MARGIN_X;
      const tableWidth = 170;
      const colWidth = tableWidth / 2;

      doc.setFillColor(58, 58, 60);
      doc.rect(tableX, yPos, tableWidth, LINE_HEIGHT + 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.text('Prepared by', tableX + 5, yPos + 5);
      doc.text('Approved by', tableX + colWidth + 5, yPos + 5);
      yPos += LINE_HEIGHT + 2;

      doc.setFillColor(240, 240, 240);
      doc.rect(tableX, yPos, colWidth, 30, 'F');
      doc.rect(tableX + colWidth, yPos, colWidth, 30, 'F');
      doc.setTextColor(0, 0, 0);

      doc.text(creatorName || '-', tableX + 5, yPos + 10);
      doc.line(tableX + 5, yPos + 15, tableX + colWidth - 5, yPos + 15);
      doc.setFontSize(10);
      doc.text('(Signature)', tableX + 5, yPos + 22);

      doc.setFontSize(11);
      doc.text(supervisorName || '-', tableX + colWidth + 5, yPos + 10);
      doc.line(tableX + colWidth + 5, yPos + 15, tableX + tableWidth - 5, yPos + 15);
      doc.setFontSize(10);
      doc.text('(Signature)', tableX + colWidth + 5, yPos + 22);

      yPos += 35;
      doc.setFillColor(220, 220, 220);
      doc.rect(tableX, yPos, tableWidth, LINE_HEIGHT + 2, 'F');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text('Date:', tableX + 5, yPos + 5);
      doc.line(tableX + 20, yPos + 5, tableX + colWidth - 5, yPos + 5);
      doc.text('Date:', tableX + colWidth + 5, yPos + 5);
      doc.line(tableX + colWidth + 20, yPos + 5, tableX + tableWidth - 5, yPos + 5);
    }

    // === Footer ===
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('Generated by Fishbone Analysis Tool', 105, PAGE_HEIGHT - 10, { align: 'center' });

    doc.save(fullFilename);
  } catch (error) {
    console.error('Error generating structured report:', error);
    throw error;
  }
}