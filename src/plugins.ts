import path from 'path'
import fs from 'fs'
import { JSDOM } from 'jsdom'
import { loadContact, loadEducation, loadExperience, loadPassion } from './sections'
import gsap from 'gsap'

export const INJECT_PLUGIN = {
    name: 'inject',
    async closeBundle() {
        const indexHTML = fs.readFileSync(path.resolve(process.cwd(), "dist", "index.html"), "utf8")
        
        const dom = new JSDOM(indexHTML)
        
        global.window = dom.window as unknown as Window & typeof globalThis
        global.document = dom.window.document
        globalThis.fetch = async function (input: RequestInfo | URL) {
            const fullPath = path.resolve(process.cwd(), "dist", input.toString().startsWith('/') ? input.toString().slice(1) : input.toString())
            const data = fs.readFileSync(fullPath, 'utf8')
            return {
                ok: true,
                json: async () => JSON.parse(data),
                text: async () => data
            } as unknown as Response
        }

        global.getComputedStyle = dom.window.getComputedStyle

        global.HTMLElement = dom.window.HTMLElement
        global.Image = class {
            width = 0
            height = 0
            _src = ''
            onload: (() => void) | null = null
            onerror: (() => void) | null = null
            
            set src(val: string) {
                this._src = val
                setTimeout(() => {
                    this.width = 100
                    this.height = 100
                    if (this.onload) { 
                        this.onload()
                    }
                }, 0)
            }
            
            get src() {
                return this._src
            }
            
            decode = async () => {
                return Promise.resolve()
            }
        } as unknown as typeof Image

        Object.defineProperty(global.HTMLElement.prototype, 'innerText', {
            get() {
                return this.textContent
            },
            set(val) {
                this.textContent = val
            },
        })

        const gsapNoopTimeline = () => {
            const timeline: any = {}
            const chainable = () => timeline
            timeline.set = chainable
            timeline.to = chainable
            timeline.from = chainable
            timeline.fromTo = chainable
            return timeline
        }
        const noop = () => ({ set: () => noop, to: () => noop, from: () => noop, fromTo: () => noop }) as any
        gsap.set = noop
        gsap.to = noop
        gsap.from = noop
        gsap.fromTo = noop
        gsap.timeline = gsapNoopTimeline

        await Promise.all([
            loadExperience(),
            loadEducation(),
            loadPassion(),
            loadContact()
        ])

        const html = dom.serialize()
        fs.writeFileSync(path.resolve(process.cwd(), "dist", "index.html"), html)
    }
}