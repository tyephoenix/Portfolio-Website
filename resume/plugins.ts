import path from "path"
import fs from "fs"
import { renderResume } from "./resume/main"
import { renderPortfolio } from "./portfolio/main"
import { JSDOM } from "jsdom"
import { Image, ImageData, createCanvas, CanvasRenderingContext2D, Canvas  } from "canvas"
import { pathToFileURL } from "url"


export const RENDER_PLUGIN = {
    name: 'documents-render',
    async closeBundle() {
        // Setup JSDOM and globals FIRST
        const dom = new JSDOM()
        global.document = dom.window.document
        global.window = dom.window as unknown as Window & typeof globalThis

        // Store original node-canvas constructors
        const OriginalCanvas = Canvas
        const OriginalImage = Image

        // CRITICAL: Set ALL constructor references to the SAME object
        // so instanceof checks will work regardless of which reference PDF.js uses
        global.HTMLCanvasElement = OriginalCanvas as any
        window.HTMLCanvasElement = OriginalCanvas as any
        global.Canvas = OriginalCanvas as any
        (window as any).Canvas = OriginalCanvas as any
        
        global.HTMLImageElement = OriginalImage as any
        ;(window as any).HTMLImageElement = OriginalImage as any
        global.Image = OriginalImage as any
        window.Image = OriginalImage as any
        
        global.CanvasRenderingContext2D = CanvasRenderingContext2D as any
        global.ImageData = ImageData as any

        const pdfjs = (await import("pdfjs-dist/legacy/build/pdf")).default

        pdfjs.GlobalWorkerOptions.workerSrc = "";
        const disableWorker = true;
        
        class NodeCanvasFactory {
            create(width: number, height: number) {
                const canvas = createCanvas(width, height)
                const context = canvas.getContext("2d")
                return { canvas, context }
            }
            
            reset(canvasAndContext: any, width: number, height: number) {
                canvasAndContext.canvas.width = width
                canvasAndContext.canvas.height = height
            }
            
            destroy(canvasAndContext: any) {
                canvasAndContext.canvas.width = 0
                canvasAndContext.canvas.height = 0
                canvasAndContext.canvas = null
                canvasAndContext.context = null
            }
        }
        
        globalThis.pdfjs = pdfjs
        globalThis.NodeCanvasFactory = NodeCanvasFactory
        globalThis.disableWorker = disableWorker


        const origCreateElement = global.document.createElement.bind(global.document)
        global.document.createElement = (tag: string) => {
            if (tag === "canvas") 
                return createCanvas(1, 1) as any
            if (tag.toLowerCase() === "img")
                return new OriginalImage() as any
            return origCreateElement(tag)
        }

        if (!((OriginalImage as any).prototype as any).decode) {
            ((OriginalImage as any).prototype as any).decode = function (this: any): Promise<void> {
                return new Promise<void>((resolve, reject) => {
                    if ((this.complete === true) || ((this.width ?? 0) > 0 && (this.height ?? 0) > 0)) {
                        resolve()
                        return
                    }
                    const cleanup = () => {
                        this.onload = null
                        this.onerror = null
                    }
                    this.onload = () => { cleanup(); resolve() }
                    this.onerror = (err: any) => { cleanup(); reject(err) }
                })
            }
        }

        const origSetSrc = Object.getOwnPropertyDescriptor(OriginalImage.prototype, "src")!.set!
        Object.defineProperty(OriginalImage.prototype, "src", {
            set(value) {
                if (typeof value === "string") {
                    if (value.startsWith("data:")) {
                        origSetSrc.call(this, value)
                        return
                    }
                    const filePath = path.resolve(process.cwd(), "dist", value.replace(/^\//, ""))
                    const buf = fs.readFileSync(filePath)
                    origSetSrc.call(this, buf)
                } else {
                    origSetSrc.call(this, value)
                }
            },
            get() {
                return Object.getOwnPropertyDescriptor(OriginalImage.prototype, "src")!.get!.call(this)
            }
        })

        if (!Canvas.prototype["toBlob"]) {
            Canvas.prototype["toBlob"] = function (callback: (blob: Blob) => void, type = "image/png") {
                const buffer = (this as any).toBuffer(type)
                callback(new Blob([buffer], { type }))
            }
        }

        globalThis.fetch = async function (input: RequestInfo | URL) {
            const fullPath = path.resolve(process.cwd(), "dist", input.toString().startsWith('/') ? input.toString().slice(1) : input.toString())
            const buffer = fs.readFileSync(fullPath)
            return {
                ok: true,
                arrayBuffer: async () => buffer.buffer.slice(
                    buffer.byteOffset,
                    buffer.byteOffset + buffer.byteLength
                ),
                json: async () => JSON.parse(buffer.toString('utf8')),
                text: async () => buffer.toString('utf8')
            } as unknown as Response
        }
        
        globalThis.requestAnimationFrame = (callback: (time: number) => void) => {
            return setTimeout(callback, 0)
        }
        window.requestAnimationFrame = (callback: (time: number) => void) => {
            return setTimeout(callback, 0)
        }

        fs.writeFileSync(path.resolve(process.cwd(), "dist", "resume.pdf"), await renderResume())
        fs.writeFileSync(path.resolve(process.cwd(), "dist", "portfolio.pdf"), await renderPortfolio())
    }
}