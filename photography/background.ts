import gsap from "gsap"


export function renderCircles(n: number, seed: number = Math.random()) {
    const random = mulberry32(seed)

    const width = window.innerWidth
    const height = window.innerHeight

    const background = document.createElement("div")
    background.className = "background"

    for (let i = 0; i < n; i++) {
        const circle = document.createElement("div")
        circle.className = i % 2 == 0 ? 'circle-filled' : 'circle-outlined'

        gsap.set(circle, {
            left: () => {
                return random() * width
            },
            top: () => {
                return random() * height
            }
        })

        background.appendChild(circle)
    }

    document.body.appendChild(background)
}


// Helper
function mulberry32(seed: number) {
    return function() {
        let t = (seed += 0x6D2B79F5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
}