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
    let y = 40

    attendances.forEach((att, index) => {
      if (y > 280) {
        doc.addPage()
        y = 20
      }

      const name = att.user
        ? `${att.user.firstName} ${att.user.lastName}`
        : 'Unknown'
      const entry = att.entryTime ? att.entryTime.toLocaleString() : ''
      const exit = att.exitTime ? att.exitTime.toLocaleString() : 'N/A'

      doc.text(`${index + 1}. ${name} | In: ${entry} | Out: ${exit}`, 20, y)
      y += 10
    })

    return Buffer.from(doc.output('arraybuffer'))
  }
}
