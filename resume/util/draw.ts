import { PDFFont, PDFPage, RGB, rgb } from "pdf-lib"

export function drawRoundedRect(page: PDFPage, options: {
    x: number
    y: number
    width: number
    height: number
    radius?: number | { topLeft?: number, topRight?: number, bottomRight?: number, bottomLeft?: number }
    color?: RGB
    borderColor?: RGB
    borderWidth?: number
    opacity?: number
}) {
    var {
        x,
        y,
        width,
        height,
        radius = 0,
        color,
        borderColor,
        borderWidth = 0,
        opacity = 1
    } = options
  
    const r = typeof radius === "number" ? {
        tl: radius,
        tr: radius,
        br: radius,
        bl: radius,
    } : {
        tl: radius.topLeft ?? 0,
        tr: radius.topRight ?? 0,
        br: radius.bottomRight ?? 0,
        bl: radius.bottomLeft ?? 0,
    }

    const n = (v: number) => Number(v.toFixed(3))
    
    const path = [
        `M ${n(r.bl)} ${n(0)}`,
        `H ${n(width - r.br)}`,
        `Q ${n(width)} ${n(0)} ${n(width)} ${n(-r.br)}`,
        `V ${n(-height + r.tr)}`,
        `Q ${n(width)} ${n(-height)} ${n(width - r.tr)} ${n(-height)}`,
        `H ${n(r.tl)}`,
        `Q ${n(0)} ${n(-height)} ${n(0)} ${n(-height + r.tl)}`,
        `V ${n(-r.bl)}`,
        `Q ${n(0)} ${n(0)} ${n(r.bl)} ${n(0)}`,
        `Z`,
    ].join(' ')
  
    if (!color && !borderColor) {
        if (borderWidth > 0) {
            borderColor = rgb(0, 0, 0)
        } else {
            color = rgb(0, 0, 0)
        }
    }
    page.drawSvgPath(path, {
        x: x,
        y: y,
        color,
        borderColor,
        borderWidth,
        opacity,
    })
}

export function parenthesizeText(text: string, maxWidth: number, font: PDFFont, fontSize: number): { lines: string[], width: number } {
    const breaks = text.split('\n')

    const lines: string[] = []
    let max = 0
    for (const br of breaks) {
        const words = br.split(' ')

        let currentLine = ''
        for (const word of words) {
            const testLine = currentLine + ' ' + word
            if (font.widthOfTextAtSize(testLine, fontSize) > maxWidth) {
                lines.push(currentLine)
                currentLine = word
            } else {
                currentLine += ' ' + word
            }
        }
        max = Math.max(max, font.widthOfTextAtSize(currentLine, fontSize))
        lines.push(currentLine)
    }

    return { lines, width: max }
}
export function drawParanthesizedText(page: PDFPage, paragraphedText: { lines: string[], width: number }, font: PDFFont, fontSize: number, options: { align?: 'left' | 'center' | 'right', x?: number, y?: number, spacing?: number }): number  {
    var { align = 'left', x = 0, y = 0, spacing = 1 } = options

    for (const line of paragraphedText.lines) {
        let dX = 0
        if (align === 'center') {
            dX = (paragraphedText.width - font.widthOfTextAtSize(line, fontSize)) / 2
        } else if (align === 'right') {
            dX = paragraphedText.width - font.widthOfTextAtSize(line, fontSize)
        }
        page.drawText(line, {
            font: font,
            size: fontSize,
            
            x: x + dX,
            y: y
        })
        y -= fontSize * spacing
    }

    return y
}