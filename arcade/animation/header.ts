


export function animateHeader() {
    updateHeaderIcon()
}


const WIDTH = 56
async function updateHeaderIcon() {
    const HEADER_ICON = document.getElementById('header-icon') as HTMLImageElement

    const source = HEADER_ICON.src
    const response = await fetch(import.meta.env.MODE === 'development' ? `https://corsproxy.io/?${source}` : source)
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = url
    await img.decode()

    const canvas = document.createElement('canvas')
    canvas.width = WIDTH
    canvas.height = WIDTH
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

    ctx.drawImage(img, 0, 0, WIDTH, WIDTH)

    const dataURL = canvas.toDataURL()
    HEADER_ICON.src = dataURL
}