import { PDFDocument, PDFFont, PDFPage } from "pdf-lib";



export async function renderSkills(page: PDFPage, fonts: Record<string, PDFFont>, dimensions: { dpi: number, margin: number, width: number, height: number, fontSize: number, wordSpacing: number }, startY: number = 0) {
    const { dpi, margin, width, height, fontSize, wordSpacing } = dimensions
    const { bookman, bookmanBold, bookmanItalic } = fonts

    const background = await (await fetch("/background.json")).json()


    // Header
    page.drawText('Technical Skills & Interests', {
        font: bookman,
        size: fontSize * 1.5,

        x: margin,
        y: startY + fontSize
    })

    startY -= wordSpacing

    // Interests
    page.drawText('Areas of Interests: ', {
        font: bookmanBold,
        size: fontSize,

        x: margin,
        y: startY
    })
    page.drawText(background.interests.slice(0, 6).join(", "), {
        font: bookman,
        size: fontSize,

        x: margin + bookmanBold.widthOfTextAtSize('Areas of Interests: ', fontSize),
        y: startY
    })

    startY -= wordSpacing

    // Skills
    page.drawText('Technical Skills: ', {
        font: bookmanBold,
        size: fontSize,

        x: margin,
        y: startY
    })
    page.drawText(background.skills.slice(0, 15).join(", "), {
        font: bookman,
        size: fontSize,

        x: margin + bookmanBold.widthOfTextAtSize('Technical Skills: ', fontSize),
        y: startY
    })
}