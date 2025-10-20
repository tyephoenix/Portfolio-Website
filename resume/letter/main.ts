import { PDFDocument, rgb } from "pdf-lib"
import * as fontkit from "fontkit"
import { drawParanthesizedText, parenthesizeText } from "../util/draw"
import { renderHeader } from "./header"
import { renderFooter } from "./footer"
import { decodeImage } from "../util/image"
import gsap from "gsap"

const WIDTH = 8.5
const HEIGHT = 11

async function renderLetter(company: string, position: string) {
    const education = await (await fetch('/education.json')).json()
    const background = await (await fetch('/background.json')).json()

    const letter = await (await fetch('/letter.txt')).text()
    const parsedLetter = letter.replaceAll('$COMPANY$', company).replaceAll('$POSITION$', position).replaceAll('$GPA$', education[0].gpa.current.toFixed(1)).replaceAll('$NAME$', background.name)

    const dpi = 300
    const width = WIDTH * dpi
    const height = HEIGHT * dpi
    const fontSize = 0.14 * dpi
    const margin = dpi / 2
    const wordSpacing = fontSize * 1.5

    const dimensions = { dpi, width, height, fontSize, margin, wordSpacing }

    const doc = await PDFDocument.create()
    doc.registerFontkit(fontkit)

    const page = doc.addPage([width, height])

    const bookmanFile = await fetch("/fonts/BOOKOS.TTF")
    const bookmanBytes = await bookmanFile.arrayBuffer()
    const bookman = await doc.embedFont(bookmanBytes)

    const bookmanBoldFile = await fetch("/fonts/BOOKOSB.TTF")
    const bookmanBoldBytes = await bookmanBoldFile.arrayBuffer()
    const bookmanBold = await doc.embedFont(bookmanBoldBytes)

    const bookmanItalicFile = await fetch("/fonts/BOOKOSI.TTF")
    const bookmanItalicBytes = await bookmanItalicFile.arrayBuffer()
    const bookmanItalic = await doc.embedFont(bookmanItalicBytes)

    const iconsFile = await fetch("/fonts/fa-free-solid.otf")
    const iconsBytes = await iconsFile.arrayBuffer()
    const icons = await doc.embedFont(iconsBytes)

    const brandsFile = await fetch("/fonts/fa-brands-regular.otf")
    const brandsBytes = await brandsFile.arrayBuffer()
    const brands = await doc.embedFont(brandsBytes)

    const fonts = { bookman, bookmanBold, bookmanItalic, icons, brands }


    const startY = await renderHeader(doc, page, fonts, dimensions)

    page.drawRectangle({
        x: margin,
        y: startY - wordSpacing,
        width: width - 2 * margin,
        height: 2,
        color: rgb(0,0,0)
    })

    // Dear
    page.drawText(`Dear ${company},`, {
        font: bookmanBold,
        size: fontSize,
        x: 2 * margin,
        y: startY - 3 * wordSpacing
    })

    // Body
    const content = parenthesizeText(parsedLetter, width - 4 * margin, bookman, fontSize)
    const lastY = drawParanthesizedText(page, content, bookman, fontSize, { x: 2 * margin, y: startY - 5 * wordSpacing, spacing: 1.25 })

    // Sincerely
    page.drawText(`Sincerely,`, {
        font: bookmanBold,
        size: fontSize,
        x: 2 * margin,
        y: lastY - 2 * wordSpacing
    })
    page.drawText(background.name, {
        font: bookmanBold,
        size: fontSize,
        x: 2 * margin,
        y: lastY - 3 * wordSpacing
    })

    // Signature
    const signature = await doc.embedPng((await decodeImage('/signature.png')).data)
    page.drawImage(signature, {
        x: 2 * margin,
        y: lastY - 4 * wordSpacing - (1.3 * dpi) * signature.height / signature.width,
        width: 1.3 * dpi,
        height: 1.3 * dpi * signature.height / signature.width
    })

    page.drawRectangle({
        x: margin,
        y: lastY - 5 * wordSpacing - 1.3 * dpi * signature.height / signature.width,
        width: width - 2 * margin,
        height: 2,
        color: rgb(0,0,0)
    })

    await renderFooter(doc, page, fonts, dimensions, company)

    return await doc.save()
}


export function initializeLetter() {
    gsap.to('#letter', {
        display: 'flex'
    })

    const COMPANY = document.getElementById('company') as HTMLInputElement
    const POSITION = document.getElementById('position') as HTMLInputElement
    
    const DOWNLOAD = document.getElementById('download-letter') as HTMLDivElement
    DOWNLOAD.onmouseenter = () => {
        gsap.to(DOWNLOAD, {
            duration: 0.3,
    
            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--text'),
            color: getComputedStyle(document.documentElement).getPropertyValue('--primary'),
        })
    }   
    DOWNLOAD.onmouseleave = () => {
        gsap.to(DOWNLOAD, {
            duration: 0.3,
    
            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--primary'),
            color: getComputedStyle(document.documentElement).getPropertyValue('--text'),
        })
    }
    DOWNLOAD.onclick = async () => {
        const blob = new Blob([new Uint8Array(await renderLetter(COMPANY.value.trim(), POSITION.value.trim()))], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
    
        const a = document.createElement('a')
        a.href = url
        a.download = `PHOENIX_Tye_Letter-${COMPANY.value.trim()}-${new Date().toLocaleDateString('en-US', { year: 'numeric' })}.pdf`
        a.click()
    
        URL.revokeObjectURL(url)
    }
}