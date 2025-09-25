import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Platform, Linking } from 'react-native';
import { MatchReport } from '../types/report';

export class PDFService {
  private static readonly HEADER_IMAGE_URL = 'https://cdn-ai.onspace.ai/onspace/project/image/EtDAY7PZMeUhLi67VxEHuX/Screenshot_2025-09-24_at_16.24.29.png';

  static async generatePDF(report: MatchReport): Promise<string> {
    try {
      // Convert photos to base64 if they exist
      const processedPhotos = await this.processPhotos(report.photos);
      
      const html = this.generateHTML(report, processedPhotos);
      
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
        margins: {
          top: 0,
          bottom: 20,
          left: 20,
          right: 20,
        },
      });

      if (Platform.OS === 'web') {
        // For web, open in new window for printing
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(html);
          printWindow.document.close();
          printWindow.print();
        }
      }

      return uri;
    } catch (error) {
      console.error('PDF Generation Error:', error);
      throw new Error('Failed to generate PDF. Please try again.');
    }
  }

  private static async processPhotos(photos: Array<{id: string, uri: string}>): Promise<Array<{id: string, base64: string}>> {
    const processedPhotos = [];
    
    for (const photo of photos) {
      try {
        // Read the image file and convert to base64
        const base64 = await FileSystem.readAsStringAsync(photo.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        
        // Determine MIME type
        const mimeType = photo.uri.toLowerCase().includes('.png') ? 'image/png' : 'image/jpeg';
        
        processedPhotos.push({
          id: photo.id,
          base64: `data:${mimeType};base64,${base64}`
        });
      } catch (error) {
        console.warn(`Failed to process photo ${photo.id}:`, error);
        // Skip this photo if processing fails
      }
    }
    
    return processedPhotos;
  }

  private static generateHTML(report: MatchReport, processedPhotos: Array<{id: string, base64: string}>): string {
    const problemAreas = report.functionalAreas.filter(area => area.status === 'ISSUE');
    
    const photosHTML = processedPhotos.length > 0 ? `
      <div class="section">
        <h2>Attached Photos</h2>
        <div class="photos-grid">
          ${processedPhotos.map(photo => `
            <div class="photo-item">
              <img src="${photo.base64}" alt="Match Photo" style="width: 250px; height: 250px; object-fit: cover; border-radius: 8px; border: 2px solid #ddd;" />
            </div>
          `).join('')}
        </div>
      </div>
    ` : '';

    const venueManagerHTML = report.matchInfo.venueManagerName ? `
      <div class="section venue-manager-section">
        <div class="venue-manager-box">
          <p class="venue-manager-title">Report prepared by:</p>
          <p class="venue-manager-name">${report.matchInfo.venueManagerName}</p>
        </div>
      </div>
    ` : '';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Match Report #${report.matchInfo.matchNumber}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
              font-size: 12px;
              line-height: 1.4;
              color: #000;
              background: white;
              margin: 0;
              padding: 0;
            }
            
            .header-image {
              width: 100%;
              height: 140px;
              object-fit: contain;
              object-position: center;
              display: block;
              margin: 0;
              padding: 0;
            }
            
            .container {
              padding: 10px 20px 0 20px;
            }
            
            .main-title {
              font-size: 24px;
              font-weight: bold;
              text-align: center;
              margin: 20px 0;
              color: #000;
            }
            
            .section {
              margin-bottom: 15px;
              page-break-inside: avoid;
            }
            
            .section h2 {
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 12px;
              padding: 8px 12px;
              background: #f0f4f8;
              border-left: 4px solid #007AFF;
              color: #000;
            }
            
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 8px;
              margin-bottom: 15px;
            }
            
            .info-item {
              display: flex;
              justify-content: space-between;
              padding: 6px 8px;
              border-bottom: 1px solid #eee;
            }
            
            .info-label {
              font-weight: 600;
              color: #000;
            }
            
            .info-value {
              color: #000;
            }
            
            .attendance-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 15px;
              margin-top: 10px;
            }
            
            .attendance-item {
              text-align: center;
              padding: 12px;
              background: #f8f9fa;
              border-radius: 6px;
            }
            
            .attendance-number {
              font-size: 20px;
              font-weight: bold;
              color: #007AFF;
              display: block;
            }
            
            .attendance-label {
              font-size: 11px;
              color: #000;
              margin-top: 4px;
            }
            
            .problem-area {
              background: #fff3e0;
              padding: 12px;
              margin: 8px 0;
              border-radius: 6px;
              border-left: 4px solid #ff6b35;
            }
            
            .problem-header {
              font-weight: bold;
              color: #ff6b35;
              margin-bottom: 4px;
            }
            
            .problem-comment {
              font-style: italic;
              color: #000;
              margin-top: 6px;
            }
            
            .text-content {
              padding: 10px;
              background: #f8f9fa;
              border-radius: 6px;
              line-height: 1.5;
              color: #000;
            }
            
            .photos-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 20px;
              margin-top: 15px;
            }
            
            .photo-item {
              text-align: center;
            }
            
            .compliance-section {
              background: #f0f8ff;
              padding: 12px;
              border-radius: 6px;
              border-left: 4px solid #007AFF;
            }
            
            .compliance-status {
              font-weight: bold;
              font-size: 14px;
            }
            
            .compliance-compliant {
              color: #4CAF50;
            }
            
            .compliance-non-compliant {
              color: #ff6b35;
            }
            
            .compliance-comment {
              margin-top: 8px;
              padding: 8px;
              background: #fff3e0;
              border-radius: 4px;
              border-left: 3px solid #ff6b35;
            }
            
            .venue-manager-section {
              margin-top: 15px;
              margin-bottom: 0;
              padding-bottom: 0;
            }
            
            .venue-manager-box {
              background: #f8f9fa;
              padding: 15px;
              border-radius: 8px;
              border-left: 4px solid #007AFF;
              text-align: center;
              margin-bottom: 0;
            }
            
            .venue-manager-title {
              font-size: 12px;
              color: #666;
              margin-bottom: 5px;
            }
            
            .venue-manager-name {
              font-size: 18px;
              font-weight: bold;
              color: #000;
            }
            
            .functional-areas-grid {
              display: grid;
              grid-template-columns: repeat(7, 1fr);
              gap: 8px;
              margin-top: 15px;
            }
            .functional-area-item {
              display: flex;
              flex-direction: column;
              align-items: center;
              padding: 8px 4px;
              background: white;
              border-radius: 4px;
              border: 1px solid #e0e0e0;
              font-size: 10px;
              text-align: center;
            }
            .functional-area-ok {
              background: #f0f8ff;
              border-color: #4CAF50;
            }
            .functional-area-issue {
              background: #fff3e0;
              border-color: #ff6b35;
            }
            .area-code {
              font-weight: bold;
              margin-bottom: 4px;
            }
            .area-status {
              font-size: 16px;
              font-weight: bold;
            }
            .legend {
              display: flex;
              justify-content: center;
              gap: 30px;
              margin-top: 15px;
              padding-top: 10px;
              border-top: 1px solid #e0e0e0;
            }
            .legend-item {
              display: flex;
              align-items: center;
              gap: 5px;
            }
            .legend-dot {
              font-size: 12px;
            }
            .legend-text {
              font-size: 12px;
              color: #666;
            }
            .status-ok { color: #4CAF50; font-weight: bold; }
            .status-problem { color: #dc3545; font-weight: bold; }
            
            @media print {
              .section { page-break-inside: avoid; }
              body { -webkit-print-color-adjust: exact; margin: 0; padding: 0; }
              .venue-manager-section { margin-bottom: 0; }
            }
          </style>
        </head>
        <body>
          <img src="${this.HEADER_IMAGE_URL}" alt="FIFA Arab Cup Qatar 2025" class="header-image" />
          
          <div class="container">
            <h1 class="main-title">MATCH REPORT #${report.matchInfo.matchNumber}</h1>
            
            <!-- Match Information -->
            <div class="section">
              <h2>Match Information</h2>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Date & Time:</span>
                  <span class="info-value">${report.matchInfo.date} ${report.matchInfo.time}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Tournament:</span>
                  <span class="info-value">${report.matchInfo.tournament || 'N/A'}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Stage:</span>
                  <span class="info-value">${report.matchInfo.stage || 'N/A'}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Stadium:</span>
                  <span class="info-value">${report.matchInfo.stadium}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Home Team:</span>
                  <span class="info-value">${report.matchInfo.homeTeam}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Away Team:</span>
                  <span class="info-value">${report.matchInfo.awayTeam}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Final Score:</span>
                  <span class="info-value">${report.matchInfo.finalScore}</span>
                </div>
              </div>
            </div>

            <!-- Client Groups -->
            <div class="section">
              <h2>Client Groups</h2>
              <div class="attendance-grid">
                <div class="attendance-item">
                  <span class="attendance-number">${report.clientGroups?.spectators || 0}</span>
                  <span class="attendance-label">Spectators</span>
                </div>
                <div class="attendance-item">
                  <span class="attendance-number">${report.clientGroups?.vipGuests || 0}</span>
                  <span class="attendance-label">VIP Guests</span>
                </div>
                <div class="attendance-item">
                  <span class="attendance-number">${report.clientGroups?.vvipGuests || 0}</span>
                  <span class="attendance-label">VVIP Guests</span>
                </div>
                <div class="attendance-item">
                  <span class="attendance-number">${report.clientGroups?.mediaRepresentatives || 0}</span>
                  <span class="attendance-label">Media Representatives</span>
                </div>
                <div class="attendance-item">
                  <span class="attendance-number">${report.clientGroups?.photographers || 0}</span>
                  <span class="attendance-label">Photographers</span>
                </div>
              </div>
            </div>

            <!-- Venue Manager General Comments -->
            ${report.generalIssues ? `
            <div class="section">
              <h2>Venue Manager General Comments</h2>
              <div class="text-content">${report.generalIssues}</div>
            </div>
            ` : ''}

            <!-- Problem Areas -->
            ${problemAreas.length > 0 ? `
            <div class="section">
              <h2>Identified Issues (${problemAreas.length})</h2>
              ${problemAreas.map(area => `
                <div class="problem-area">
                  <div class="problem-header">${area.code} - ${area.name}</div>
                  ${area.comment ? `<div class="problem-comment">${area.comment}</div>` : ''}
                </div>
              `).join('')}
            </div>
            ` : ''}

            <!-- DRS Compliance -->
            ${report.drsCompliance ? `
            <div class="section">
              <h2>DRS Compliance</h2>
              <div class="compliance-section">
                <div class="compliance-status ${report.drsCompliance.isCompliant ? 'compliance-compliant' : 'compliance-non-compliant'}">
                  Status: ${report.drsCompliance.isCompliant ? 'Compliant' : 'Non-Compliant'}
                </div>
                ${!report.drsCompliance.isCompliant && report.drsCompliance.comment ? `
                <div class="compliance-comment">
                  <strong>Issue Description:</strong><br>
                  ${report.drsCompliance.comment}
                </div>
                ` : ''}
              </div>
            </div>
            ` : ''}

            <!-- Additional Comments -->
            ${report.additionalComments ? `
            <div class="section">
              <h2>Additional Comments</h2>
              <div class="text-content">${report.additionalComments}</div>
            </div>
            ` : ''}

            <!-- All Functional Areas Status -->
            <div class="section">
              <div class="section-title">All Functional Areas Status</div>
              <div class="functional-areas-grid">
                ${report.functionalAreas.map(area => `
                  <div class="functional-area-item ${area.status === 'ISSUE' ? 'functional-area-issue' : 'functional-area-ok'}">
                    <span class="area-code">${area.code}</span>
                    <span class="area-status ${area.status === 'OK' ? 'status-ok' : 'status-problem'}">●</span>
                  </div>
                `).join('')}
              </div>
              
              <!-- Legend -->
              <div class="legend">
                <div class="legend-item">
                  <span class="legend-dot status-ok">●</span>
                  <span class="legend-text">No Issues</span>
                </div>
                <div class="legend-item">
                  <span class="legend-dot status-problem">●</span>
                  <span class="legend-text">Issues Identified</span>
                </div>
              </div>
            </div>

            ${photosHTML}
            ${venueManagerHTML}
          </div>
        </body>
      </html>
    `;
  }

  static async sharePDF(uri: string): Promise<void> {
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Share Match Report'
        });
      } else {
        throw new Error('Sharing is not available on this platform');
      }
    } catch (error) {
      console.error('Share PDF Error:', error);
      throw new Error('Failed to share PDF');
    }
  }

  static async openWhatsApp(pdfUri: string, report: MatchReport): Promise<void> {
    try {
      const message = `Match Report #${report.matchInfo.matchNumber} - ${report.matchInfo.homeTeam} vs ${report.matchInfo.awayTeam}`;
      
      if (Platform.OS === 'web') {
        // For web, open WhatsApp Web with message
        const webWhatsAppURL = `https://web.whatsapp.com/send?text=${encodeURIComponent(message)}`;
        await Linking.openURL(webWhatsAppURL);
        return;
      }

      const whatsappURL = `whatsapp://send?text=${encodeURIComponent(message)}`;
      
      const supported = await Linking.canOpenURL(whatsappURL);
      if (supported) {
        // First share the PDF, then open WhatsApp
        await this.sharePDF(pdfUri);
        await Linking.openURL(whatsappURL);
      } else {
        // Fallback to WhatsApp web version
        const webWhatsAppURL = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
        const webSupported = await Linking.canOpenURL(webWhatsAppURL);
        if (webSupported) {
          await Linking.openURL(webWhatsAppURL);
        } else {
          // If all else fails, just share the PDF normally
          await this.sharePDF(pdfUri);
        }
      }
    } catch (error) {
      console.error('WhatsApp Error:', error);
      // Fallback to normal PDF sharing
      try {
        await this.sharePDF(pdfUri);
      } catch (shareError) {
        throw new Error('Failed to share report. Please try again.');
      }
    }
  }
}