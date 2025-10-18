import * as pdfjsLib from 'pdfjs-dist';


export async function decodeImage(url: string): Promise<{ width: number, height: number, data: Uint8Array }> {
    const img = new Image()
    img.src = url
    await img.decode()

    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0)

    const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => {
            if (b) {
                resolve(b)
            } else {
                reject(new Error('Failed to convert image to blob.'))
            }
        }, 'image/png')
    })
    return { width: img.width, height: img.height, data: new Uint8Array(await blob.arrayBuffer()) }
}

export async function decodeGrayscaleImage(url: string): Promise<{ width: number, height: number, data: Uint8Array }> {
    const img = new Image()
    img.src = url
    await img.decode()
  
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0)
  
    const imageData = ctx.getImageData(0, 0, img.width, img.height)
    const data = imageData.data
    for (let i = 0; i < data.length; i += 4) {
        const avg = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
        data[i] = data[i + 1] = data[i + 2] = avg
    }
    ctx.putImageData(imageData, 0, 0)
  
    const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => {
            if (b) {
                resolve(b)
            } else {
                throw new Error('Failed to convert image to grayscale.')
            }
        }, 'image/png')
    })
    return { width: img.width, height: img.height, data: new Uint8Array(await blob.arrayBuffer()) }
}

export async function pdfToPng(pdfBytes: Uint8Array, pageIndex: number = 1) {
    const pdf = await pdfjsLib.getDocument({ data: pdfBytes }).promise
    const page = await pdf.getPage(pageIndex)
  
    const viewport = page.getViewport({ scale: 2.5 })
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
  
    canvas.width = viewport.width
    canvas.height = viewport.height
  
    await page.render({ canvasContext: ctx, viewport, canvas }).promise
  
    return canvas.toDataURL('image/png')
}