import path from 'path'
import fs from 'fs'
import { JSDOM } from 'jsdom'
import { loadBlog, setupCatalog } from './catalog'
import { slugify } from './blog'
import { setup as setupSeries } from './series/series'
import { setup as setupBlog } from './series/blog/blog'

export const UPLOAD_PLUGIN = {
    name: 'blogs-upload',
    configureServer(server: any) {
        const SERIES_PATH = path.join(process.cwd(), 'public', 'blogs', 'series')
        const INDEX_PATH = path.join(process.cwd(), 'public', 'blogs', 'index.json')
        server.middlewares.use(async (req: any, res: any, next: any) => {
            if (req.url === '/api/blogs/upload' && req.method === 'POST') {
                let body = ''
                req.on('data', (chunk: Buffer) => {
                    body += chunk
                })
                req.on('end', async () => {
                    const data = JSON.parse(body)

                    const { series, title, keywords, coverPhoto, content } = data

                    const seriesPath = path.join(SERIES_PATH, slugify(series))
                    fs.mkdirSync(seriesPath, { recursive: true })

                    const blogIndex = fs.readdirSync(seriesPath).filter((file) => fs.statSync(path.join(seriesPath, file)).isDirectory()).length.toString()
                    const blogPath = path.join(seriesPath, blogIndex)
                    fs.mkdirSync(blogPath, { recursive: true })

                    const indexPath = path.join(blogPath, 'index.json')
                    fs.writeFileSync(indexPath, JSON.stringify({ series, title, keywords, date: new Date().toISOString() }, null, 2))

                    const contentPath = path.join(blogPath, 'content.md')
                    fs.writeFileSync(contentPath, content)

                    const coverPhotoPath = path.join(blogPath, 'cover.jpg')

                    if (coverPhoto.startsWith('data:')) {
                        const base64Data = coverPhoto.replace(/^data:.*;base64,/, '')
                        fs.writeFileSync(coverPhotoPath, Buffer.from(base64Data, 'base64'))
                    } else {
                        const response = await fetch(coverPhoto)
                        const arrayBuffer = await response.arrayBuffer()
                        fs.writeFileSync(coverPhotoPath, Buffer.from(arrayBuffer))
                    }

                    if (fs.existsSync(INDEX_PATH)) {
                        const index = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf8'))
                        index.push(`/blogs/series/${slugify(series)}/${blogIndex}`)
                        fs.writeFileSync(INDEX_PATH, JSON.stringify(index, null, 2))
                    } else {
                        fs.writeFileSync(INDEX_PATH, JSON.stringify([`/blogs/series/${slugify(series)}/${blogIndex}`], null, 2))
                    }

                    res.statusCode = 200
                    res.end('Upload successful')
                })
                return
            }
            next()
        })
    }
}

export const INJECT_PLUGIN = {
    name: 'blogs-inject',
    async closeBundle() {
        const blogsHTML = fs.readFileSync(path.resolve(process.cwd(), "dist", "blogs", "index.html"), "utf8")

        const dom = new JSDOM(blogsHTML)

        global.document = dom.window.document
        global.window = dom.window as unknown as Window & typeof globalThis
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
        globalThis.requestAnimationFrame = (_: FrameRequestCallback) => {return 0}

        global.HTMLElement = dom.window.HTMLElement

        await setupCatalog()

        const html = dom.serialize()
        fs.writeFileSync(path.resolve(process.cwd(), "dist", "blogs", "index.html"), html)


        const catalog = await fetch("/blogs/index.json")
        const catalogData = await catalog.json()

        // Series SSG
        const seriesTemplateHTML = fs.readFileSync(path.resolve(process.cwd(), "dist", "blogs", "series", "index.html"), "utf8")
        const series: string[] = catalogData.map((blog: string) => blog.split("/")[3]).filter((series: string, index: number, self: string[]) => self.indexOf(series) === index)
        for (const s of series) {
            const seriesPath = path.join(process.cwd(), "dist", "blogs", s)
            fs.mkdirSync(seriesPath, { recursive: true })

            const seriesDOM = new JSDOM(seriesTemplateHTML)

            global.document = seriesDOM.window.document
            
            await setupSeries(s)

            const index = path.join(seriesPath, "index.html")
            fs.writeFileSync(index, seriesDOM.serialize())
        }

        // Blog SSG
        const blogTemplateHTML = fs.readFileSync(path.resolve(process.cwd(), "dist", "blogs", "series", "blog", "index.html"), "utf8")
        for (const s of series) {
            const blogs = catalogData.filter((blog: string) => blog.split("/")[3] === s)

            for (const b of blogs) {
                const bData = await loadBlog(b)
                const blogPath = path.join(process.cwd(), "dist", "blogs", s, slugify(bData.title))
                fs.mkdirSync(blogPath, { recursive: true })

                const blogDOM = new JSDOM(blogTemplateHTML)

                global.document = blogDOM.window.document

                await setupBlog(s, slugify(bData.title))

                const index = path.join(blogPath, "index.html")
                fs.writeFileSync(index, blogDOM.serialize())
            }
        }
    }
}