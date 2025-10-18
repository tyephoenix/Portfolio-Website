import { PDFDocument, PDFFont, PDFPage, rgb } from "pdf-lib";


export async function renderEducation(doc: PDFDocument, page: PDFPage, fonts: Record<string, PDFFont>, dimensions: { dpi: number, margin: number, width: number, height: number, fontSize: number, wordSpacing: number }, startY: number = 0) {
    const { dpi, margin, width, height, fontSize, wordSpacing } = dimensions
    const { bookman, bookmanBold, bookmanItalic } = fonts

    const education = await (await fetch("/education.json")).json()


    // Header
    page.drawText('Education', {
        font: bookman,
        size: fontSize * 1.5,

        x: margin,
        y: startY + fontSize
    })

    for (const item of education) {
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
        const timeline = start.getFullYear() + " - " + end.getFullYear()
        page.drawText(timeline, {
            font: bookmanItalic,
            size: fontSize,

            x: width - margin - bookman.widthOfTextAtSize(timeline, fontSize),
            y: startY
        })

        startY -= wordSpacing
        
        // Focus
        page.drawText(item.focus, {
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

        // Coursework
        const prefix = 'Coursework: '
        page.drawText(prefix, {
            font: bookmanBold,
            size: fontSize,

            x: margin,
            y: startY
        })
        page.drawText(item.courses.slice(item.courses.length - 3, item.courses.length).map((value: string) => {
            return value.includes(":") ? value.split(": ")[1] : value
        }).join(", "), {
            font: bookman,
            size: fontSize,
            
            x: margin + bookmanBold.widthOfTextAtSize(prefix, fontSize),
            y: startY
        })

        const gpa = `GPA: ${item.gpa.current.toFixed(1)}/${item.gpa.scale.toFixed(1)}`
        page.drawText(gpa, {
            font: bookman,
            size: fontSize,

            x: width - margin - bookman.widthOfTextAtSize(gpa, fontSize),
            y: startY
        })

        startY -= wordSpacing - fontSize
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