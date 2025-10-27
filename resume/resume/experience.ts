import { PDFDocument, PDFFont, PDFPage, rgb } from "pdf-lib"
import { drawParanthesizedText, parenthesizeText } from "../util/draw"


export async function renderExperience(page: PDFPage, fonts: Record<string, PDFFont>, dimensions: { dpi: number, margin: number, width: number, height: number, fontSize: number, wordSpacing: number }, startY: number = 0) {
    const { dpi, margin, width, height, fontSize, wordSpacing } = dimensions
    const { bookman, bookmanBold, bookmanItalic } = fonts

    const experience = await (await fetch("/experience.json")).json()


    // Header
    page.drawText('Experience', {
        font: bookman,
        size: fontSize * 1.5,

        x: margin,
        y: startY + fontSize
    })

    var size = 0
    for (const item of experience) {
        if (size >= 3) {
            break
        }
        if ('resume' in item && !item.resume) {
            continue
        }
        size += 1

        startY -= wordSpacing

        // Name
        page.drawText(item.name, {
            font: bookmanBold,
            size: fontSize,

            x: margin,
            y: startY
        })

        // Timeline
        const start = new Date(item.start)
        const end = new Date(item.end)
        const timeline = start.toLocaleString('en-US', { month: 'long' }) + " " + start.getFullYear() + " - " + (item.end ? end.toLocaleString('en-US', { month: 'long' }) + " " + end.getFullYear() : "Present")
        page.drawText(timeline, {
            font: bookmanItalic,
            size: fontSize,

            x: width - margin - bookman.widthOfTextAtSize(timeline, fontSize),
            y: startY
        })

        startY -= wordSpacing

        // Role
        page.drawText(item.role, {
            font: bookmanItalic,
            size: fontSize,

            x: margin,
            y: startY
        })

        // Location
        page.drawText(item.location, {
            font: bookman,
            size: fontSize,
            
            x: width - margin - bookman.widthOfTextAtSize(item.location, fontSize),
            y: startY
        })

        startY -= wordSpacing

        // Description
        page.drawText(' - ', {
            font: bookman,
            size: fontSize,

            x: margin,
            y: startY
        })

        startY = drawParanthesizedText(page, parenthesizeText(item.description.who, width - 2 * dpi, bookman, fontSize), bookman, fontSize, { x: margin + bookman.widthOfTextAtSize(' - ', fontSize), y: startY })

        startY -= wordSpacing - fontSize

        page.drawText(' - ', {
            font: bookman,
            size: fontSize,

            x: margin,
            y: startY
        })

        startY = drawParanthesizedText(page, parenthesizeText(item.description.what, width - 3 * dpi, bookman, fontSize), bookman, fontSize, { x: margin + bookman.widthOfTextAtSize(' - ', fontSize), y: startY })

        startY -= wordSpacing - fontSize

        page.drawText(' - ', {
            font: bookman,
            size: fontSize,

            x: margin,
            y: startY
        })

        startY = drawParanthesizedText(page, parenthesizeText(item.description.learned, width - 3 * dpi, bookman, fontSize), bookman, fontSize, { x: margin + bookman.widthOfTextAtSize(' - ', fontSize), y: startY })
    }

    const lastY = startY - wordSpacing - fontSize
    page.drawRectangle({
        x: margin,                  
        y: lastY,

        width: width - 2 * margin,
        height: 2,

        color: rgb(0,0,0)
    })

    return lastY
}