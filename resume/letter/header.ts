import { PDFDocument, PDFFont, PDFPage } from "pdf-lib"
import { decodeImage } from "../util/image"



export async function renderHeader(doc: PDFDocument, page: PDFPage, fonts: Record<string, PDFFont>, dimensions: { dpi: number, margin: number, width: number, height: number, fontSize: number, wordSpacing: number }) {
    const { dpi, margin, width, height, fontSize, wordSpacing } = dimensions
    const { bookman, bookmanBold, icons, brands } = fonts

    const education = await (await fetch("/education.json")).json()
    const background = await (await fetch("/background.json")).json()
    const contact = await (await fetch("/contact.json")).json()

    // Icon
    const icon = await doc.embedPng((await decodeImage('/icon.png')).data)
    page.drawImage(icon, {
        x: margin,
        y: height - margin - dpi,
        width: dpi,
        height: dpi
    })

    // Name
    page.drawText(background.name, {
        font: bookmanBold,
        size: fontSize * 1.5,
        x: margin + dpi + wordSpacing,
        y: height - 1.4 * margin
    })

    // Address
    page.drawText(background.address, {
        font: bookman,
        size: fontSize ,
        x: margin + dpi + wordSpacing,
        y: height - 1.4 * margin - wordSpacing
    })

    // Email 
    page.drawText(contact.email, {
        font: bookman,
        size: fontSize,
        x: margin + dpi + wordSpacing,
        y: height - 1.4 * margin - 2 * wordSpacing
    })

    // Phone
    page.drawText(contact.phone, {
        font: bookman,
        size: fontSize,
        x: margin + dpi + wordSpacing,
        y: height - 1.4 * margin - 3 * wordSpacing
    })

    // Date
    page.drawText(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), {
        font: bookman,
        size: fontSize,
        x: margin + dpi + wordSpacing,
        y: height - 1.4 * margin - 4 * wordSpacing
    })

    return height - 1.4 * margin - 4 * wordSpacing
}