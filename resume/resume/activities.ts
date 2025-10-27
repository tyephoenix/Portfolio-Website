import { PDFFont, PDFPage, rgb } from "pdf-lib";


export async function renderActivities(page: PDFPage, fonts: Record<string, PDFFont>, dimensions: { dpi: number, margin: number, width: number, height: number, fontSize: number, wordSpacing: number }, startY: number = 0) {
    const { dpi, margin, width, height, fontSize, wordSpacing } = dimensions
    const { bookman, bookmanBold, bookmanItalic } = fonts

    const activities = await (await fetch("/passion.json")).json()


    // Header
    page.drawText('Activities', {
        font: bookman,
        size: fontSize * 1.5,

        x: margin,
        y: startY + fontSize
    })

    for (const item of activities) {
        startY -= wordSpacing

        // Name
        page.drawText(item.name, {
            font: bookmanBold,
            size: fontSize,

            x: margin,
            y: startY
        })

        // Role
        page.drawText(item.role, {
            font: bookmanItalic,
            size: fontSize,

            x: width - margin - bookman.widthOfTextAtSize(item.role, fontSize),
            y: startY
        })

        startY -= wordSpacing

        // Description
        if (item.description.what) {
            page.drawText(item.description.what, {
                font: bookman,
                size: fontSize,

                x: margin,
                y: startY
            })
            startY -= fontSize
        }
        if (item.description.why) {
            page.drawText(item.description.why, {
                font: bookman,
                size: fontSize,

                x: margin,
                y: startY
            })
        }
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