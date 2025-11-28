import path from 'path'
import fs from 'fs'
import { JSDOM } from 'jsdom'
import { setupGallery } from './gallery'

export const UPLOAD_PLUGIN = {
    name: 'photography-upload',
    configureServer(server: any) {
        const COLLECTIONS_PATH = path.join(process.cwd(), 'public', 'photography', 'collections')
        const INDEX_PATH = path.join(process.cwd(), 'public', 'photography', 'index.json')
        server.middlewares.use(async (req: any, res: any, next: any) => {
            if (req.url === '/api/photography/upload' && req.method === 'POST') {
                let body = ''
                req.on('data', (chunk: Buffer) => {
                    body += chunk
                })
                req.on('end', async () => {
                    const data = JSON.parse(body)

                    const { collection, keywords, uploads } = data

                    const collectionIndex = fs.readdirSync(COLLECTIONS_PATH).filter((file) => fs.statSync(path.join(COLLECTIONS_PATH, file)).isDirectory()).length.toString()
                    const collectionPath = path.join(COLLECTIONS_PATH, collectionIndex)
                    fs.mkdirSync(collectionPath, { recursive: true })

                    const references: string[] = []
                    for (const upload of uploads) {
                        const uploadPath = path.join(collectionPath, upload.name)
                        const base64Data = upload.data.replace(/^data:.*;base64,/, '')
                        fs.writeFileSync(uploadPath, Buffer.from(base64Data, 'base64'))
                        references.push(`/photography/collections/${collectionIndex}/${upload.name}`)
                    }

                    const indexPath = path.join(collectionPath, 'index.json')
                    fs.writeFileSync(indexPath, JSON.stringify({ collection, keywords, uploads: references, date: new Date().toISOString() }, null, 2))

                    if (fs.existsSync(INDEX_PATH)) {
                        const index = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf8'))
                        index.push(`/photography/collections/${collectionIndex}`)
                        fs.writeFileSync(INDEX_PATH, JSON.stringify(index, null, 2))
                    } else {
                        fs.writeFileSync(INDEX_PATH, JSON.stringify([`/photography/collections/${collectionIndex}`], null, 2))
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
    name: 'photography-inject',
    async closeBundle() {
        const photographyHTML = fs.readFileSync(path.resolve(process.cwd(), "dist", "photography", "index.html"), "utf8")

        const dom = new JSDOM(photographyHTML)

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

        global.HTMLElement = dom.window.HTMLElement

        await setupGallery(3)

        const html = dom.serialize()
        fs.writeFileSync(path.resolve(process.cwd(), "dist", "photography", "index.html"), html)
    }
}