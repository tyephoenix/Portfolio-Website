import { PDFFont, PDFPage, rgb } from "pdf-lib"
import { drawParanthesizedText, parenthesizeText } from "../util/draw"


export async function renderProjects(page: PDFPage, fonts: Record<string, PDFFont>, dimensions: { dpi: number, margin: number, width: number, height: number, fontSize: number, wordSpacing: number }, startY: number = 0) {
    const { dpi, margin, width, height, fontSize, wordSpacing } = dimensions
    const { bookman, bookmanBold, bookmanItalic } = fonts

    const projects = await (await fetch("/projects.json")).json()


    // Header
    page.drawText('Projects & Publications', {
        font: bookman,
        size: fontSize * 1.5,

        x: margin,
        y: startY + fontSize
    })

    var size = 0
    for (const item of projects) {
        if (size >= 2) {
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

        startY -= wordSpacing

        startY = drawParanthesizedText(page, parenthesizeText(item.description, width - 2 * dpi, bookman, fontSize), bookman, fontSize, { x: margin, y: startY })

        startY -= wordSpacing - fontSize

        // Link
        page.drawText(item.link, {
            font: bookman,
            size: fontSize,

            x: margin,
            y: startY
        })

        startY -= wordSpacing - fontSize
    }

    const lastY = startY - 2 * wordSpacing
    page.drawRectangle({
        x: margin,                  
        y: lastY,

        width: width - 2 * margin,
        height: 2,

        color: rgb(0,0,0)
    })

    return lastY
}