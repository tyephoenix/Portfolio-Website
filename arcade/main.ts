import gsap from "gsap";
import { animateHero } from "./animation/hero";
import { loadMinecraft } from "./minecraft";
import { ScrollToPlugin } from "gsap/all";
import { animateHeader } from "./animation/header";


gsap.registerPlugin(ScrollToPlugin)


animateHero()
animateHeader()

loadMinecraft()



const MESSAGE_LABEL = document.querySelector('#message a') as HTMLElement
const MESSAGE_QUEUE: { text: string, type: 'error' | 'success' | 'info' }[] = []
export function sendMessage(text: string, type: 'error' | 'success' | 'info') {
    MESSAGE_QUEUE.push({ text, type })
    processMessageQueue()
}
var isProcessingMessageQueue = false
async function processMessageQueue() {
    if (isProcessingMessageQueue) 
        return
    isProcessingMessageQueue = true
    while (MESSAGE_QUEUE.length > 0) {
        const message = MESSAGE_QUEUE.shift()
        if (message) {
            MESSAGE_LABEL.innerText = message.text
            gsap.set('#message', {
                backgroundColor: message.type === 'error' ? 'crimson' : message.type === 'success' ? 'darkgreen' : 'grey'
            })
            gsap.to('#message', {
                duration: 0.5,

                opacity: 1,
                top: 100,

                ease: 'power2.out',
                
                onComplete: () => {
                    gsap.to('#message', {
                        duration: 0.5,
                        delay: 2,

                        opacity: 0,
                        top: 0,

                        ease: 'power2.in',
                    })
                }
            })
            await new Promise((resolve) => setTimeout(resolve, 3000))
        }
    }
}


const NAVBAR = document.getElementById('navbar') as HTMLElement
for (const child of NAVBAR.children as HTMLCollectionOf<HTMLElement>) {
    const q = document.querySelector(`#${child.querySelector('a')?.innerText.toLowerCase()}`) as HTMLElement | null
    if (q) {
        child.onmouseenter = () => {
            gsap.to(child, {
                duration: 0.3,

                gap: 30,

                ease: 'power2.out',
            })
        }
        child.onmouseleave = () => {
            gsap.to(child, {
                duration: 0.3,

                gap: 10,

                ease: 'power2.in',
                
            })
        }
        child.onclick = () => {
            gsap.to(window, {
                duration: 0.5,

                scrollTo: q,

                ease: 'power2.out',
            })
        }
    }
}