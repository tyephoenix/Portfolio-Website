import { PDFDocument, PDFFont, PDFPage } from "pdf-lib"
import { decodeImage } from "../util/image"

export async function renderFooter(doc: PDFDocument, page: PDFPage, fonts: Record<string, PDFFont>, dimensions: { dpi: number, margin: number, width: number, height: number, fontSize: number, wordSpacing: number }, to: string) {
    const { dpi, margin, width, height, fontSize, wordSpacing } = dimensions
    const { bookman, bookmanBold, icons, brands } = fonts

    const background = await (await fetch('/background.json')).json()
    const education = await (await fetch('/education.json')).json()

    // Domain
    page.drawText('www.tyephoenix.com', {
        font: bookman,
        size: fontSize,
        x: width - margin - bookman.widthOfTextAtSize('www.tyephoenix.com', fontSize),
        y: margin
    })

    // Stamp
    const stamp = await doc.embedPng((await decodeImage(education[0].emblem)).data)
    page.drawImage(stamp, {
        x: margin,
        y: margin,
        width: 0.8 * dpi,
        height: 0.8 * dpi
    })

    // To/From
    page.drawText('To: ', {
        font: bookmanBold,
        size: fontSize,
        x: margin + wordSpacing + 256,
        y: margin + 2 * wordSpacing
    })
    page.drawText(to, {
        font: bookman,
        size: fontSize,
        x: margin + wordSpacing + 256 + bookmanBold.widthOfTextAtSize('To: ', fontSize),
        y: margin + 2 * wordSpacing
    })


    page.drawText('From: ', {
        font: bookmanBold,
        size: fontSize,
        x: margin + wordSpacing + 256,
        y: margin + wordSpacing
    })
    page.drawText(background.name, {
        font: bookman,
        size: fontSize,
        x: margin + wordSpacing + 256 + bookmanBold.widthOfTextAtSize('From: ', fontSize),
        y: margin + wordSpacing
    })
}