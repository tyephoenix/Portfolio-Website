import gsap from "gsap";
import { TextPlugin } from "gsap/all";
import { COLORS } from "./main";

gsap.registerPlugin(TextPlugin)


const SUBTITLES = ["Academic", "Biologist", "Engineer", "Researcher", "Founder"]

export function animateHero() {
    gsap.to('#scroll a ', {
        duration: 0.4,
    
        y: -30,
    
        ease: 'sine.out',
    
        repeat: -1,
        yoyo: true
    })

    const SUBTITLE = document.querySelector("#subtitle a") as HTMLElement
    const subtitleTl = gsap.timeline({ repeat: -1 })

    for (const subtitle of SUBTITLES) {
        subtitleTl.to(SUBTITLE, {
            duration: 1,

            text: subtitle,

            ease: 'none'
        })
        subtitleTl.to({}, { duration: 2 })
        subtitleTl.to(
            { progress: 1 },
            {
                duration: 1,
                progress: 0,
                ease: "none",
                onUpdate() {
                    const p = this.targets()[0].progress
                    const len = Math.floor(subtitle.length * p)
                    SUBTITLE.textContent = subtitle.substring(0, len)
                    if (len == 0) {
                        gsap.set(SUBTITLE, {
                            color: COLORS[Math.floor(Math.random() * COLORS.length)]
                        })
                    }
                },
            }
        )
    }
}