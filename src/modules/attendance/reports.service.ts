import { Injectable } from '@nestjs/common'
import * as ExcelJS from 'exceljs'
import { jsPDF } from 'jspdf'
import { Attendance } from './entities/attendance.entity'

@Injectable()
export class ReportsService {
  async generateExcel (attendances: Attendance[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Attendance')

    worksheet.columns = [
      { header: 'Employee', key: 'employee', width: 30 },
      { header: 'Entry Time', key: 'entryTime', width: 25 },
      { header: 'Exit Time', key: 'exitTime', width: 25 },
    ]

    attendances.forEach(att => {
      worksheet.addRow({
        employee: att.user
          ? `${att.user.firstName} ${att.user.lastName}`
          : 'Unknown',
        entryTime: att.entryTime ? att.entryTime.toLocaleString() : '',
        exitTime: att.exitTime ? att.exitTime.toLocaleString() : 'N/A',
      })
    })

    return (await workbook.xlsx.writeBuffer()) as unknown as Buffer
  }

  async generatePdf (attendances: Attendance[]): Promise<Buffer> {
    const doc = new jsPDF()

    doc.setFontSize(20)
    doc.text('Attendance Report', 105, 20, { align: 'center' })

    doc.setFontSize(12)
    doc.text('Employee', 20, 40)
    doc.text('Entry Time', 80, 40)
    doc.text('Exit Time', 140, 40)
    
    // Draw a line under headers
    doc.line(20, 42, 190, 42)

    let y = 50

    attendances.forEach((att, index) => {
      if (y > 280) {
        doc.addPage()
        y = 20
        // Re-print headers on new page
        doc.text('Employee', 20, y)
        doc.text('Entry Time', 80, y)
        doc.text('Exit Time', 140, y)
        doc.line(20, y + 2, 190, y + 2)
        y += 10
      }

      const name = att.user
        ? `${att.user.firstName} ${att.user.lastName}`
        : 'Unknown'
      const entry = att.entryTime ? att.entryTime.toLocaleString() : ''
      const exit = att.exitTime ? att.exitTime.toLocaleString() : 'N/A'

      doc.text(name, 20, y)
      doc.text(entry, 80, y)
      doc.text(exit, 140, y)
      y += 10
    })

    return Buffer.from(doc.output('arraybuffer'))
  }
}
