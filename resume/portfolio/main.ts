import { PDFDocument } from "pdf-lib"
import * as fontkit from "fontkit"
import gsap from "gsap"
import { renderTitle } from "./title";
import { pdfToPng } from "../util/image";
import { renderProjects } from "./projects";


const WIDTH = 11
const HEIGHT = 8.5
export function setupPortfolioRender() {
    const DOWNLOAD = document.getElementById('download-portfolio') as HTMLDivElement
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
        URL.revokeObjectURL(await downloadPortfolio())
    }

    gsap.set('#portfolio .render', {
        aspectRatio: WIDTH / HEIGHT,
    })
}

var RENDER: Promise<Uint8Array> | null = null
var PDF: Uint8Array | null = null
export function queuePortfolioRender(): Promise<void> {
    return new Promise((resolve) => {
        if (RENDER) 
            return
        const promise = ((import.meta as any).env != undefined && (import.meta as any).env.MODE == 'production') ? pullPortfolio() : renderPortfolio()
        gsap.to('#portfolio .loading', {
            duration: 0.3,
            opacity: 1,
        })
        RENDER = promise
        promise.then(async (bytes) => {
            const pdf = document.querySelector('#portfolio .render') as HTMLDivElement
            pdf.style.backgroundImage = `url(${await pdfToPng(bytes, 1)})`

            RENDER = null
            resolve()

            gsap.to('#portfolio .loading', {
                duration: 0.3,

                opacity: 0,
            })
        })
    })
}

async function pullPortfolio() {
    const portfolio = await fetch("/portfolio.pdf")
    const portfolioBytes = await portfolio.arrayBuffer()
    PDF = new Uint8Array(portfolioBytes)
    return PDF
}

export async function renderPortfolio() {
    const dpi = 300
    const width = WIDTH * dpi
    const height = HEIGHT * dpi
    const fontSize = 0.15 * dpi
    const margin = dpi
    const wordSpacing = fontSize * 1.5

    const dimensions = { dpi, width, height, fontSize, margin, wordSpacing }

    const doc = await PDFDocument.create()
    doc.registerFontkit(fontkit)

    const comfortaaFile = await fetch("/fonts/Comfortaa-Regular.ttf")
    const comfortaaBytes = await comfortaaFile.arrayBuffer()
    const comfortaa = await doc.embedFont(comfortaaBytes)

    const comfortaaBoldFile = await fetch("/fonts/Comfortaa-Bold.ttf")
    const comfortaaBoldBytes = await comfortaaBoldFile.arrayBuffer()
    const comfortaaBold = await doc.embedFont(comfortaaBoldBytes)

    const iconsFile = await fetch("/fonts/fa-free-solid.otf")
    const iconsBytes = await iconsFile.arrayBuffer()
    const icons = await doc.embedFont(iconsBytes)

    const brandsFile = await fetch("/fonts/fa-brands-regular.otf")
    const brandsBytes = await brandsFile.arrayBuffer()
    const brands = await doc.embedFont(brandsBytes)

    const fonts = { comfortaa, comfortaaBold, icons, brands }


    await renderTitle(doc, fonts, dimensions)
    await renderProjects(doc, fonts, dimensions)


    const bytes = await doc.save()

    PDF = new Uint8Array(bytes)

    return bytes
}

export async function downloadPortfolio(): Promise<string> {
    if (!PDF) {
        await queuePortfolioRender()
        return await downloadPortfolio()
    }

    const blob = new Blob([new Uint8Array(PDF)], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `PHOENIX_Tye_Portfolio-${new Date().toLocaleDateString('en-US', { year: 'numeric' })}.pdf`
    a.click()

    return url
}