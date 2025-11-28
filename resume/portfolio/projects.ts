import { PDFDocument, PDFFont, PDFImage, rgb } from "pdf-lib"
import { decodeImage, pdfToPng } from "../util/image"
import { drawParanthesizedText, parenthesizeText } from "../util/draw"



export async function renderProjects(doc: PDFDocument, fonts: Record<string, PDFFont>, dimensions: { dpi: number, margin: number, width: number, height: number, fontSize: number, wordSpacing: number }) {
    const { dpi, margin, width, height, fontSize, wordSpacing } = dimensions
    const { comfortaa, comfortaaBold } = fonts

    const projects = await (await fetch("/projects.json")).json()

    for (const project of projects) {
        // Title
        const page = doc.addPage([width, height])   
        if (project.logo) {
            const logo = await decodeImage(project.logo)
            const embed = await doc.embedPng(logo.data)
            const ratio = logo.width / logo.height
            page.drawImage(embed, {
                x: margin,
                y: height - margin - dpi * 0.75,
                width: dpi * 0.75 * ratio,
                height: dpi * 0.75,
            })
        } else {
            page.drawText(project.name, {
                font: comfortaaBold,
                size: fontSize * 2.5,
                x: margin,
                y: height - margin - fontSize * 2.5,
            })
        }

        // Hero
        function renderHero(image: PDFImage) {
            if (image.width > image.height) {
                const ratio = image.height / image.width
                page.drawRectangle({
                    x: 2 * margin - 10,
                    y: 2.25 * margin - 10,
                    width: width - 4 * margin + 20,
                    height: (width - 4 * margin) * ratio + 20,
                    color: rgb(0.5,0.5,0.5),
                })
                page.drawImage(image, {
                    x: 2 * margin,
                    y: 2.25 * margin,
                    width: width - 4 * margin,
                    height: (width - 4 * margin) * ratio,
                })
            } else {
                const ratio = image.width / image.height
                page.drawRectangle({
                    x: 2 * margin - 10,
                    y: 2.25 * margin - 10,
                    width: (height - 4.5 * margin) * ratio + 20,
                    height: height - 4.5 * margin + 20,
                    color: rgb(0.5,0.5,0.5),
                })
                page.drawImage(image, {
                    x: 2 * margin,
                    y: 2.25 * margin,
                    width: (height - 4.5 * margin) * ratio,
                    height: height - 4.5 * margin,
                })
            }
        }
        const hero = typeof project.resources[0] === 'object' ? project.resources[0].resource : project.resources[0]
        if (hero.endsWith('.png')) {
            const image = await decodeImage(hero)
            const embed = await doc.embedPng(image.data)
            renderHero(embed)
        } else if (hero.endsWith('.pdf')) {
            const heroBuffer = await (await fetch(hero)).arrayBuffer()
            const resourceDoc = await PDFDocument.load(heroBuffer)
            const resourceBytes = await resourceDoc.save()
            const resourceImage = await pdfToPng(resourceBytes)
            const embed = await doc.embedPng(resourceImage)
            renderHero(embed)
        }

        for (let i = 0; i < project.resources.length; i++) {
            if (i == 0) {
                const resource = project.resources[i]
                if ((typeof resource === 'object' ? resource.resource : resource).endsWith('.pdf')) {
                    const resourceDoc = await PDFDocument.load(await (await fetch(typeof resource === 'object' ? resource.resource : resource)).arrayBuffer())
                    await renderPdf(doc, resourceDoc, width, height, margin, comfortaaBold, fontSize, project.link, typeof resource === 'object' ? resource.caption : undefined, project.organization, 2)
                }
            } else {
                const resource = project.resources[i]
                if ((typeof resource === 'object' ? resource.resource : resource).endsWith('.pdf')) {
                    const resourceDoc = await PDFDocument.load(await (await fetch(typeof resource === 'object' ? resource.resource : resource)).arrayBuffer())
                    await renderPdf(doc, resourceDoc, width, height, margin, comfortaaBold, fontSize, project.link, typeof resource === 'object' ? resource.caption : undefined, project.organization, 1)
                } else if ((typeof resource === 'object' ? resource.resource : resource).endsWith('.png')) {
                    const image = await decodeImage(typeof resource === 'object' ? resource.resource : resource)
                    const embed = await doc.embedPng(image.data)
                    await renderPng(doc, embed, width, height, margin, comfortaaBold, fontSize, project.link, typeof resource === 'object' ? resource.caption : undefined, project.organization)
                }
            }
        }


        // Description
        const description = parenthesizeText(project.description, width / 2, comfortaaBold, fontSize)
        drawParanthesizedText(page, description, comfortaaBold, fontSize, { align: 'center', x: (width - description.width) / 2, y: 1.5 * margin, spacing: 1.25 })


        if (project.organization) {
            const ip = `© ${project.organization}`
            page.drawText(ip, {
                font: comfortaaBold,
                size: fontSize * 0.8,
                x: width - margin - comfortaaBold.widthOfTextAtSize(ip, fontSize * 0.8),
                y: margin / 2,
            })
        }

        // Link
        page.drawText(project.link, {
            font: comfortaaBold,
            size: fontSize * 0.8,
            x: margin / 2,
            y: margin / 2,
        })
    }
}

async function renderPng(doc: PDFDocument, image: PDFImage, width: number, height: number, margin: number, font: PDFFont, fontSize: number, link: string, caption?: string, organization?: string) {
    const page = doc.addPage([width, height])

    if (organization) {
        const ip = `© ${organization}`
        page.drawText(ip, {
            font: font,
            size: fontSize * 0.8,
            x: width - margin - font.widthOfTextAtSize(ip, fontSize * 0.8),
            y: margin / 2,
        })
    }

    // Link
    page.drawText(link, {
        font: font,
        size: fontSize * 0.8,
        x: margin / 2,
        y: margin / 2,
    })

    if (image.width > image.height) {
        const ratio = image.height / image.width
        page.drawRectangle({
            x: margin - 10,
            y: (caption ? 1.5 : 2.5) * margin - 10,
            width: width - 2 * margin + 20,
            height: (width - 2 * margin) * ratio + 20,
            color: rgb(0.5,0.5,0.5),
        })
        page.drawImage(image, {
            x: margin,
            y: (caption ? 1.5 : 2.5) * margin,
            width: width - 2 * margin,
            height: (width - 2 * margin) * ratio,
        })
    } else {
        const ratio = image.width / image.height
        const targetHeight = caption ? height / 2.5 : height / 3
        page.drawRectangle({
            x: (width - targetHeight * ratio) / 2 - 10,
            y: (caption ? 1 : 1.5) * margin - 10,
            width: (width - targetHeight * ratio) + 20,
            height: targetHeight + 20,
            color: rgb(0.5,0.5,0.5),
        })
        page.drawImage(image, {
            x: (width - targetHeight * ratio) / 2,
            y: (caption ? 1 : 1.5) * margin,
            width: targetHeight * ratio,
            height: targetHeight,
        })
    }

    // Caption
    if (caption) {
        const captionText = parenthesizeText(caption, width / 1.5, font, fontSize)
        drawParanthesizedText(page, captionText, font, fontSize, { align: 'center', x: (width - captionText.width) / 2, y: height - margin, spacing: 1.25 })
    }
}

async function renderPdf(doc: PDFDocument, pdf: PDFDocument, width: number, height: number, margin: number, font: PDFFont, fontSize: number, link: string, caption?: string, organization?: string, startPage: number = 1) {
    for (let i = startPage; i <= pdf.getPageCount(); i ++) {
        const page = doc.addPage([width, height])

        if (organization) {
            const ip = `© ${organization}`
            page.drawText(ip, {
                font: font,
                size: fontSize * 0.8,
                x: width - margin - font.widthOfTextAtSize(ip, fontSize * 0.8),
                y: margin / 2,
            })
        }

        // Link
        page.drawText(link, {
            font: font,
            size: fontSize * 0.8,
            x: margin / 2,
            y: margin / 2,
        })

        const image1 = await pdfToPng(await pdf.save(), i)
        const embed1 = await doc.embedPng(image1)

        if (embed1.width > embed1.height) {
            const ratio = embed1.height / embed1.width
            page.drawRectangle({
                x: margin - 10,
                y: height - (caption ? 2 : 1.5) *margin - (width / 2) * ratio - 10,
                width: width / 2 + 20,
                height: (width / 2) * ratio + 20,
                color: rgb(0.5,0.5,0.5),
            })
            page.drawImage(embed1, {
                x: margin,
                y: height - (caption ? 2 : 1.5) * margin - (width / 2) * ratio,
                width: width / 2,
                height: (width / 2) * ratio,
            })
        } else {
            const ratio = embed1.width / embed1.height
            page.drawRectangle({
                x: margin - 10,
                y: height - (caption ? 2 : 1.5) * margin - (height / 3) - 10,
                width: (height / 3) * ratio + 20,
                height: (height / 3) + 20,
                color: rgb(0.5,0.5,0.5)
            })
            page.drawImage(embed1, {
                x: margin,
                y: height - (caption ? 2 : 1.5) * margin - (height / 3),
                width: (height / 3) * ratio,
                height: (height / 3),
            })
        }

        if (i + 1 <= pdf.getPageCount()) {
            const image2 = await pdfToPng(await pdf.save(), i + 1)
            const embed2 = await doc.embedPng(image2)

            if (embed2.width > embed2.height) {
                const ratio = embed2.height / embed2.width
                page.drawRectangle({
                    x: width - margin - (width / 2) - 10,
                    y: (caption ? 1 : 1.5) * margin - 10,
                    width: width / 2 + 20,
                    height: (width / 2) * ratio + 20,
                    color: rgb(0.5,0.5,0.5)
                })
                page.drawImage(embed2, {
                    x: width - margin - (width / 2),
                    y: (caption ? 1 : 1.5) * margin,
                    width: width / 2,
                    height: (width / 2) * ratio,
                })
            } else {
                const ratio = embed2.width / embed2.height
                page.drawRectangle({
                    x: width - margin - (height / 3) * ratio - 10,
                    y: (caption ? 1 : 1.5) * margin - 10,
                    width: (height / 3) * ratio + 20,
                    height: (height / 3) + 20,
                    color: rgb(0.5,0.5,0.5)
                })
                page.drawImage(embed2, {
                    x: width - margin - (height / 3) * ratio,
                    y: (caption ? 1 : 1.5) * margin,
                    width: (height / 3) * ratio,
                    height: (height / 3),
                })
            }
        }

        // Caption
        if (caption) {
            const captionText = parenthesizeText(caption, width / 1.5, font, fontSize)
            drawParanthesizedText(page, captionText, font, fontSize, { align: 'center', x: (width - captionText.width) / 2, y: height - margin, spacing: 1.25 })
        }
    }
}