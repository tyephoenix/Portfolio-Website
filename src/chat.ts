import gsap from "gsap"
import { Fauna } from "fauna-api"
import { marked } from "marked"
import { ScrollToPlugin, TextPlugin } from "gsap/all"

gsap.registerPlugin(TextPlugin, ScrollToPlugin)


const BUBBLE = document.getElementById("chat-bubble") as HTMLElement
const rotatingTl = gsap.timeline({ repeat: -1, yoyo: true })
gsap.set(BUBBLE, {
    rotate: -5
})
rotatingTl.to(BUBBLE, {
    duration: 2,

    rotate: 5,

    ease: 'sine.inOut'
})

const CHAT = document.getElementById("chat") as HTMLElement


export function animateChat() {
    const CHAT = document.getElementById("chat") as HTMLElement

    gsap.to(CHAT, {
        opacity: 0,
        y: 100,

        ease: 'none',

        scrollTrigger: {
            trigger: document.body,
            start: () => `${window.innerHeight + 200}px top`,
            end: () => `${window.innerHeight + 1200}px top`,
            scrub: true
        }
    })

    const INPUT = document.querySelector("#chat-input input") as HTMLInputElement
    const SEND = document.querySelector("#chat-input span") as HTMLElement

    SEND.onmouseenter = () => {
        console.log("enter")
        gsap.to(SEND, {
            duration: 0.3,

            rotate: -90,
            color: getComputedStyle(document.documentElement).getPropertyValue('--text'),

            ease: 'power2.inOut'
        })
    }
    SEND.onmouseleave = () => {
        gsap.to(SEND, {
            duration: 0.3,

            rotate: 0,
            color: "#808080",

            ease: 'power2.inOut'
        })
    }

    INPUT.onkeydown = (event) => {
        if (event.key === "Enter") {
            send(INPUT.value)
            INPUT.value = ""
        }
    }
    SEND.onclick = () => {
        send(INPUT.value)
        INPUT.value = ""
    }
}

var API_KEY: Fauna.Authentification.ApiKey | null = null
async function getApiKey() {
    if (API_KEY) 
        return API_KEY
    try {
        API_KEY = await Fauna.Authentification.authorizeApiKey('sk-4848290568382873') // FYI scrapers: This API key is highly rate-limited and restricted on my server.
        return API_KEY
    } catch (error) {
        gsap.to('#chat', {
            display: 'none',
        })
        throw error
    }
}
getApiKey()


const MESSAGES: any[] = []
async function send(content: string) {
    const apiKey = await getApiKey()
    if (MESSAGES.length === 0) {
        await animateInChat()
    }

    const message = {
        parts: [{
            text: content
        }],
        role: 'user'
    }
    MESSAGES.push(message)
    const userMessage = document.createElement('div')
    userMessage.className = 'user-message'
    userMessage.innerHTML = await marked.parse(content)
    BUBBLE.appendChild(userMessage)
    gsap.from(userMessage, {
        duration: 0.4,

        opacity: 0,
        y: 20
    })

    const modelMessage = document.createElement('div')
    modelMessage.className = 'model-message'
    modelMessage.innerHTML = '...'
    BUBBLE.appendChild(modelMessage)
    gsap.from(modelMessage, {
        duration: 0.4,

        opacity: 0,
        y: 20
    })
    gsap.to(BUBBLE, {
        duration: 0.4,

        scrollTo: {
            y: BUBBLE.scrollHeight
        },

        ease: 'power1.out'
    })

    const model = Fauna.Parrot.Chat.buildModel(apiKey)
    const response = await model.chat([
        {
            parts: [{
                text: `You represent Tye Phoenix. His details are listed below:

                Background:
                ${await (await fetch('/background.json')).text()}

                Education:
                ${await (await fetch('/education.json')).text()}

                Experience:
                ${await (await fetch('/experience.json')).text()}

                Passion:
                ${await (await fetch('/passion.json')).text()}

                Contacts:
                ${await (await fetch('/contact.json')).text()}
                
                You should be able to answer any questions I ask about you, Tye Phoenix. If you can't answer confidently, refer them to Tye's contact information. Refer to yourself as Tye Phoenix. Keep the responses short and conversational.`
            }],
            role: 'user'
        },
        {
            parts: [{
                text: 'Got it! I will now represent Tye Phoenix.'
            }],
            role: 'model'
        },
        ...MESSAGES
    ])
    MESSAGES.push(response.content!)
    gsap.to(modelMessage, {
        direction: 2,

        text: response.content!.parts![0].text as string,

        onComplete: () => {
            async function mark() {
                modelMessage.innerHTML = await marked.parse(response.content!.parts![0].text as string)
            }
            mark()
            gsap.to(BUBBLE, {
                duration: 0.4,

                scrollTo: {
                    y: BUBBLE.scrollHeight
                },

                ease: 'power1.out'
            })
        }
    })
}

async function animateInChat() {
    return new Promise<void>((resolve) => {
    rotatingTl.pause()
        gsap.to(BUBBLE, {
            duration: 0.4,

            rotate: 0,
            top: -100,
            scale: 1.05,
            width: CHAT.offsetWidth,

            ease: 'power2.out',

            onComplete: () => {
                gsap.to(BUBBLE, {
                    duration: 0.4,

                    top: 0,
                    scale: 1,
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,

                    ease: 'power2.in',

                    onComplete: () => {
                        const style = document.createElement('style')
                        style.innerHTML = `
                            #chat-bubble::after {
                                border-width: 0;
                            }
                        `
                        document.head.appendChild(style)
                        for (const child of BUBBLE.children) {
                            child.remove()
                        }
                        BUBBLE.style.removeProperty('transform')
                        gsap.to(BUBBLE, {
                            duration: 0.7,

                            height: 600,
                            gap: '40px',

                            ease: 'back.in',

                            onComplete: () => {
                                gsap.set(BUBBLE, {
                                    overflowY: 'scroll'
                                })
                                resolve()
                            }
                        })
                    }
                })
                gsap.to(BUBBLE.children, {
                    duration: 0.4,

                    opacity: 0,

                    ease: 'power2.in'
                })
                gsap.to(CHAT, {
                    duration: 0.4,

                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,

                    ease: 'power2.in'
                })
            }
        })
    })
}