import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as PDFDocument from 'pdfkit';
import { Attendance } from './entities/attendance.entity';

@Injectable()
export class ReportsService {
  async generateExcel(attendances: Attendance[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Attendance');
    
    worksheet.columns = [
      { header: 'Employee', key: 'employee', width: 30 },
      { header: 'Entry Time', key: 'entryTime', width: 25 },
      { header: 'Exit Time', key: 'exitTime', width: 25 },
    ];

    attendances.forEach(att => {
      worksheet.addRow({
        employee: att.user ? `${att.user.firstName} ${att.user.lastName}` : 'Unknown',
        entryTime: att.entryTime ? att.entryTime.toLocaleString() : '',
        exitTime: att.exitTime ? att.exitTime.toLocaleString() : 'N/A',
      });
    });

    return (await workbook.xlsx.writeBuffer()) as Buffer;
  }

  async generatePdf(attendances: Attendance[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      doc.fontSize(20).text('Attendance Report', { align: 'center' });
      doc.moveDown();

      attendances.forEach((att, index) => {
        const name = att.user ? `${att.user.firstName} ${att.user.lastName}` : 'Unknown';
        const entry = att.entryTime ? att.entryTime.toLocaleString() : '';
        const exit = att.exitTime ? att.exitTime.toLocaleString() : 'N/A';
        
        doc.fontSize(12).text(`${index + 1}. ${name} | In: ${entry} | Out: ${exit}`);
        doc.moveDown(0.5);
      });

      doc.end();
    });
  }
}
