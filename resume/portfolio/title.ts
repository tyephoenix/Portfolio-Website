import { PDFDocument, PDFFont, rgb } from "pdf-lib"
import { drawParanthesizedText, drawRoundedRect, parenthesizeText } from "../util/draw"
import { decodeImage } from "../util/image"



export async function renderTitle(doc: PDFDocument, fonts: Record<string, PDFFont>, dimensions: { dpi: number, margin: number, width: number, height: number, fontSize: number, wordSpacing: number }) {
    const { dpi, margin, width, height, fontSize, wordSpacing } = dimensions
    const { comfortaa, comfortaaBold, icons, brands } = fonts

    const page = doc.addPage([width, height])

    const background = await (await fetch("/background.json")).json()
    const projects = await (await fetch("/projects.json")).json()
    const contact = await (await fetch("/contact.json")).json()

    // Clouds
    const clouds = await doc.embedPng((await decodeImage('/misc/cloud.png')).data)
    page.drawImage(clouds, {
        x: 2 * dpi,
        y: height - 1 * dpi,
        opacity: 0.3,
    })
    page.drawImage(clouds, {
        x: width - 5 * dpi,
        y: height - 1.9 * dpi,
        opacity: 0.3,
    })
    page.drawImage(clouds, {
        x: width - 4 * dpi,
        y: height - 1.1 * dpi,
        opacity: 0.3,
    })
    page.drawImage(clouds, {
        x: 4 * dpi,
        y: height - 1.3 * dpi,
        opacity: 0.3,
    })

    // Name
    page.drawText(background.name, {
        font: comfortaaBold,
        size: fontSize * 2.5,
        x: (width - comfortaaBold.widthOfTextAtSize(background.name, fontSize * 2.5)) / 2,
        y: height / 2 + fontSize * 2,
    })
    const subtitle = `Software & AI Engineer`
    page.drawText(subtitle, {
        font: comfortaa,
        size: fontSize * 1.5,
        x: (width - comfortaa.widthOfTextAtSize(subtitle, fontSize * 1.5)) / 2,
        y: height / 2 - fontSize,
    })

    const bottomText = `Portfolio @ tyephoenix.com`
    page.drawText(bottomText, {
        font: comfortaa,
        size: fontSize,
        x: (width - comfortaa.widthOfTextAtSize(bottomText, fontSize)) / 2,
        y: margin / 2,
    })

    // Icon
    const icon = await doc.embedPng((await decodeImage('/icon.png')).data)
    page.drawImage(icon, {
        x: width - margin / 2 - 2 * dpi,
        y: height - margin / 2 - 2 * dpi,
        width: 2 * dpi,
        height: 2 * dpi,
    })

    // Phone
    page.drawText('\uf095', {
        font: icons,
        size: fontSize,

        x: width - margin / 2 - 1.75 * dpi,
        y: height - margin / 2 - wordSpacing - fontSize - 2.5 * dpi
    })
    page.drawText(contact.phone, {
        font: comfortaa,
        size: fontSize,

        x: width - margin / 2 - 1.75 * dpi + wordSpacing,
        y: height - margin / 2 - wordSpacing - fontSize - 2.5 * dpi
    })

    // Email
    page.drawText('\uf0e0', {
        font: icons,
        size: fontSize,

        x: width - margin / 2 - 1.85 * dpi,
        y: height - margin / 2 - 2 * wordSpacing - fontSize - 2.5 * dpi
    })
    page.drawText(contact.email, {
        font: comfortaa,
        size: fontSize,

        x: width - margin / 2 - 1.85 * dpi + wordSpacing,
        y: height - margin / 2 - 2 * wordSpacing - fontSize - 2.5 * dpi
    })

    // LinkedIn
    page.drawText('\uf08c', {
        font: brands,
        size: fontSize,

        x: width - margin / 2 - 1.575 * dpi,
        y: height - margin / 2 - 3 * wordSpacing - fontSize - 2.5 * dpi
    })
    page.drawText(contact.linkedin, {
        font: comfortaa,
        size: fontSize,

        x: width - margin / 2 - 1.575 * dpi + wordSpacing,
        y: height - margin / 2 - 3 * wordSpacing - fontSize - 2.5 * dpi
    })

    // GitHub
    page.drawText('\uf09b', {
        font: brands,
        size: fontSize,

        x: width - margin / 2 - 1.55 * dpi,
        y: height - margin / 2 - 4 * wordSpacing - fontSize - 2.5 * dpi
    })
    page.drawText(contact.github, {
        font: comfortaa,
        size: fontSize,

        x: width - margin / 2 - 1.55 * dpi + wordSpacing,
        y: height - margin / 2 - 4 * wordSpacing - fontSize - 2.5 * dpi
    })

    // Twitter
    page.drawText('\ue61a', {
        font: brands,
        size: fontSize,

        x: width - margin / 2 - 1.55 * dpi,
        y: height - margin / 2 - 5 * wordSpacing - fontSize - 2.5 * dpi
    })
    page.drawText(contact.twitter, {
        font: comfortaa,
        size: fontSize,

        x: width - margin / 2 - 1.55 * dpi + wordSpacing,
        y: height - margin / 2 - 5 * wordSpacing - fontSize - 2.5 * dpi
    })


    // Description
    const description = parenthesizeText(background.description, 2.5 * dpi, comfortaa, fontSize * 0.8)
    drawParanthesizedText(page, description, comfortaa, fontSize * 0.8, { align: 'center', x: 0.75 * dpi, y: height - margin / 2 - 1.1 * dpi, spacing: 1.25 })

    // Collateral
    const collateral = await doc.embedPng((await decodeImage('/collateral/dave-1.png')).data)
    const collateralInches = 3.2
    const collateralWidth = 500
    const collateralHeight = 532
    const collateralRatio = collateralHeight / collateralWidth
    page.drawImage(collateral, {
        x: width - (dpi * collateralInches),
        y: 0,
        width: dpi * collateralInches,
        height: dpi * collateralInches * collateralRatio,
    })

    // Table of Contents
    drawRoundedRect(page, {
        x: -5,
        y: -5,
        width: 3.5 * dpi,
        height: 4 * dpi,
        radius: {
            topRight: 50,
        },
        borderWidth: 10
    })
    page.drawText('Table of Contents', {
        font: comfortaaBold,
        size: fontSize * 1.5,

        x: (3.5 * dpi - comfortaaBold.widthOfTextAtSize('Table of Contents', fontSize * 1.5)) / 2,
        y: 4 * dpi - margin / 2
    })

    // Projects
    var startY = 4 * dpi - 1.75 * margin / 2- fontSize * 1.5
    var index = 1
    for (const project of projects) {
        const label = `Slide ${index}. ${project.name}`
        page.drawText(label, {
            font: comfortaa,
            size: fontSize,

            x: 0.75 * margin / 2,
            y: startY
        })
        startY -= fontSize * 2
        index += project.resources.length + 1
    }
}