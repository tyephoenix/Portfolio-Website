import { PDFDocument } from "pdf-lib";
import * as fontkit from "fontkit"
import { renderHeader } from "./header";
import { renderEducation } from "./education";
import { renderExperience } from "./experience";
import { renderActivities } from "./activities";
import { renderSkills } from "./skills";
import * as pdfjsLib from 'pdfjs-dist';
import gsap from "gsap";
import { pdfToPng } from "../util/image";


const WIDTH = 8.5
const HEIGHT = 11

var RENDER: Promise<Uint8Array> | null = null
var PDF: Uint8Array | null = null
export async function queueResumeRender(): Promise<void> {
    return new Promise((resolve) => {
        gsap.set('#resume .render', {
            aspectRatio: WIDTH / HEIGHT,
        })
        if (RENDER) 
            return
        const promise = renderResume()
        gsap.to('#resume .loading', {
            duration: 0.3,

            opacity: 1,
        })
        RENDER = promise
        promise.then(() => {
            RENDER = null
            resolve()

            gsap.to('#resume .loading', {
                duration: 0.3,

                opacity: 0,
            })
        })
    })
}

async function renderResume() {
    const dpi = 300
    const width = WIDTH * dpi
    const height = HEIGHT * dpi
    const fontSize = 0.1 * dpi
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

    await renderSkills(doc, page, fonts, dimensions, await renderActivities(doc, page, fonts, dimensions, await renderExperience(doc, page, fonts, dimensions, await renderEducation(doc, page, fonts, dimensions, await renderHeader(doc, page, fonts, dimensions)))))

    const bytes = await doc.save()

    PDF = new Uint8Array(bytes)

    const pdf = document.querySelector('#resume .render') as HTMLDivElement
    pdf.style.backgroundImage = `url(${await pdfToPng(bytes)})`

    return bytes
}

const DOWNLOAD = document.getElementById('download-resume') as HTMLDivElement
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
    URL.revokeObjectURL(await downloadResume())
}

export async function downloadResume(): Promise<string> {
    if (!PDF) {
        await queueResumeRender()
        return await downloadResume()
    }

    const blob = new Blob([new Uint8Array(PDF)], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `PHOENIX_Tye-${new Date().toLocaleDateString('en-US', { year: 'numeric' })}.pdf`
    a.click()

    return url
}