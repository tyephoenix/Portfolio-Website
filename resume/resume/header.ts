import { PDFDocument, PDFFont, PDFPage, rgb } from "pdf-lib";
import { decodeGrayscaleImage } from "../util/image";


export async function renderHeader(doc: PDFDocument, page: PDFPage, fonts: Record<string, PDFFont>, dimensions: { dpi: number, margin: number, width: number, height: number, fontSize: number, wordSpacing: number }) {
    const { dpi, margin, width, height, fontSize, wordSpacing } = dimensions
    const { bookman, bookmanBold, icons, brands } = fonts


    const education = await (await fetch("/education.json")).json()
    const background = await (await fetch("/background.json")).json()
    const contact = await (await fetch("/contact.json")).json()


    // Emblem
    const emblem = await doc.embedPng((await decodeGrayscaleImage(education[0].emblem)).data)
    page.drawImage(emblem, {
        x: dimensions.margin,
        y: dimensions.height - dimensions.margin - 256,
        width: 256,
        height: 256
    })

    page.drawText(background.name, {
        font: bookmanBold,
        size: fontSize * 1.5,

        x: margin + 256 + wordSpacing,
        y: height - margin - fontSize
    })

    // Phone
    page.drawText('\uf095', {
        font: icons,
        size: fontSize,

        x: margin + 256 + wordSpacing,
        y: height - margin - wordSpacing - fontSize
    })
    page.drawText(contact.phone, {
        font: bookman,
        size: fontSize,

        x: margin + 256 + 2 * wordSpacing,
        y: height - margin - wordSpacing - fontSize
    })

    // Email
    page.drawText('\uf0e0', {
        font: icons,
        size: fontSize,

        x: margin + 256 + wordSpacing,
        y: height - margin - 2 * wordSpacing - fontSize
    })
    page.drawText(contact.email, {
        font: bookman,
        size: fontSize,

        x: margin + 256 + 2 * wordSpacing,
        y: height - margin - 2 * wordSpacing - fontSize
    })

    // LinkedIn
    page.drawText('\uf08c', {
        font: brands,
        size: fontSize,

        x: margin + 256 + wordSpacing,
        y: height - margin - 3 * wordSpacing - fontSize
    })
    page.drawText(contact.linkedin, {
        font: bookman,
        size: fontSize,

        x: margin + 256 + 2 * wordSpacing,
        y: height - margin - 3 * wordSpacing - fontSize
    })

    // GitHub
    page.drawText('\uf09b', {
        font: brands,
        size: fontSize,

        x: margin + 256 + wordSpacing,
        y: height - margin - 4 * wordSpacing - fontSize
    })
    page.drawText(contact.github, {
        font: bookman,
        size: fontSize,

        x: margin + 256 + 2 * wordSpacing,
        y: height - margin - 4 * wordSpacing - fontSize
    })

    // Twitter
    page.drawText('\ue61a', {
        font: brands,
        size: fontSize,

        x: margin + 256 + wordSpacing,
        y: height - margin - 5 * wordSpacing - fontSize
    })
    page.drawText(contact.twitter, {
        font: bookman,
        size: fontSize,

        x: margin + 256 + 2 * wordSpacing,
        y: height - margin - 5 * wordSpacing - fontSize
    })

    // Icon
    const icon = await doc.embedPng((await decodeGrayscaleImage('/icon.png')).data)
    page.drawImage(icon, {
        x: width - margin - 256 - wordSpacing,
        y: height - margin - 256,
        width: 256,
        height: 256
    })

    // Chat My AI
    // page.drawText('Chat My AI', {
    //     font: bookmanBold,
    //     size: fontSize * 1.5,

    //     x: width - margin - 256 - wordSpacing,
    //     y: height - margin + wordSpacing
    // })
    page.drawText('\uf57d', {
        font: icons,
        size: fontSize,

        x: width - margin - 256 - 2 * wordSpacing,
        y: height - margin - 256 - wordSpacing - fontSize
    })
    page.drawText('www.tyephoenix.com', {
        font: bookman,
        size: fontSize,

        x: width - margin - 256 - wordSpacing,
        y: height - margin - 256 - wordSpacing - fontSize
    })

    // Border
    const lastY = height - margin - 256 - 2 * wordSpacing - fontSize
    page.drawRectangle({
        x: margin,
        y: lastY,

        width: width - 2 * margin,
        height: 2,

        color: rgb(0,0,0)
    })
    
    return lastY
}