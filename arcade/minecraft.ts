import gsap from "gsap"
import { sendMessage } from "./main"


export function loadMinecraft() {
    loadServerInfo()
}

const SERVER_IP = (import.meta as any).env && (import.meta as any).env.MODE === 'development' ? 'localhost:6235' : 'minecraft.tyephoenix.com'
async function loadServerInfo() {
    const nameElement = document.getElementById('minecraft-server-name') as HTMLElement

    const ipElement = document.querySelector('#minecraft-server-ip a') as HTMLElement
    ipElement.innerText = SERVER_IP
    const ipCopyElement = document.querySelector('#minecraft-server-ip span') as HTMLElement
    ipCopyElement.addEventListener('click', () => {
        navigator.clipboard.writeText(SERVER_IP)
        gsap.to(ipCopyElement, {
            duration: 0.3,

            scale: 1.1,

            ease: 'power2.out',

            onComplete: () => {
                gsap.to(ipCopyElement, {
                    duration: 0.2,

                    scale: 1,

                    ease: 'power2.in',
                })
            }
        })
    })

    const iconElement = document.querySelector('#minecraft-server-icon img') as HTMLImageElement
    const statusElement = document.getElementById('minecraft-server-status') as HTMLElement

    const playersElement = document.getElementById('minecraft-server-players') as HTMLElement
    const versionElement = document.getElementById('minecraft-server-version') as HTMLElement
    const platformElement = document.getElementById('minecraft-server-platform') as HTMLElement

    const downloadConfigElement = document.getElementById('minecraft-server-download') as HTMLElement

    try {
        const response = await fetch(`http${(import.meta as any).env && (import.meta as any).env.MODE === 'development' ? '' : 's'}://${SERVER_IP}/`)

        if (response.ok) {
            const data = await response.json()
            console.log(data)

            if ('motd_json' in data) {
                nameElement.innerText = data.motd_json ?? 'Tye\'s Server'
            }

            if ('status' in data) {
                gsap.set(statusElement, {
                    backgroundColor: data.status === 'success' ? 'green' : 'red'
                })
            }

            if ('favicon' in data && typeof data.favicon === 'string') {
                iconElement.src = data.favicon
            }

            if ('players' in data && 'now' in data.players && 'max' in data.players) {
                playersElement.innerText = data.players.now + '/' + data.players.max
                gsap.set(playersElement, {
                    color: data.players.now === 0 ? 'pink' : 'lightgreen'
                })
            }

            if ('server' in data) {
                if ('name' in data.server) {
                    versionElement.innerText = data.server.name ?? 'Unknown'
                }

                if ('platform' in data.server) {
                    platformElement.innerText = data.server.platform
                }
            }

            // Download,
            if (!('server' in data) || !('mods' in data.server) || data.server.mods.length === 0) {
                gsap.set(downloadConfigElement, {
                    display: 'none'
                })
            } else {
                downloadConfigElement.onmouseenter = () => {
                    gsap.to(downloadConfigElement, {
                        duration: 0.3,

                        scale: 1.1,
                        backgroundColor: '#A5845C',

                        ease: 'power2.out',
                    })
                }
                downloadConfigElement.onmouseleave = () => {
                    gsap.to(downloadConfigElement, {
                        duration: 0.3,

                        scale: 1,
                        backgroundColor: '#1c1a17',

                        ease: 'power2.in',
                    })
                }
                downloadConfigElement.onclick = async () => {
                    sendMessage('Starting Download...', 'info')
                    const response = await fetch(`http${(import.meta as any).env && (import.meta as any).env.MODE === 'development' ? '' : 's'}://${SERVER_IP}/download`)

                    if (response.ok) {
                        const blob = await response.blob()

                        const url = URL.createObjectURL(blob)

                        const a = document.createElement('a')
                        a.href = url
                        a.download = 'configuration.zip'
                        a.click()

                        URL.revokeObjectURL(url)
                        a.remove()
                    } else {
                        throw new Error('Failed to download configuration from ' + SERVER_IP)
                    }
                }
            }
        } else {
            throw new Error('Failed to load server info from ' + SERVER_IP)
        }
    } catch (error) {
        console.error(error)
        gsap.set(downloadConfigElement, {
            display: 'none'
        })
    }
}
