import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"

gsap.registerPlugin(ScrollTrigger)


export function animateFooter(width: number = 0.3) {
    const scale = roundToEven(window.innerWidth * width) / 360

    const VIDEO = document.getElementById('footer-video') as HTMLElement
    gsap.set(VIDEO, {
        width: 360 * scale,
        height: 480 * scale,

        backgroundImage: `url(/collateral/bat-boy.png)`,
        backgroundSize: "cover",
        backgroundPosition: "0 0",
        backgroundRepeat: "no-repeat"
    })

    const steps = 14760 / 360
    const duration = steps / 20
    gsap.to(VIDEO, {
        duration: duration, 

        backgroundPositionX: `-${360 * scale * (steps - 1)}px`,

        ease: `steps(${steps - 1})`,

        scrollTrigger: {
            trigger: VIDEO,
            start: `center bottom-=${480 * scale * 0.4}`
        }
    })
    VIDEO.onmouseenter = () => {
        if (!gsap.isTweening(VIDEO)) {
            gsap.set(VIDEO, {
                backgroundPosition: '0 0'
            })
            gsap.to(VIDEO, {
                duration: duration, 
        
                backgroundPositionX: `-${360 * scale * (steps - 1)}px`,
        
                ease: `steps(${steps - 1})`
            })
        }
    }
}


// Helper
function roundToEven(num: number) {
    const rounded = Math.round(num)
    return rounded % 2 === 0 ? rounded : rounded + 1 * (num > rounded ? 1 : -1)
}