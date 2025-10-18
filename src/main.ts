import gsap from 'gsap'
import './render/engine'
import { animateChat } from './chat'
import { loadContact, loadEducation, loadExperience, loadPassion } from './sections'
import { animateFooter } from './footer'
import { animateHero } from './hero'


const navbar = document.getElementById("navbar")

// Color Mapping
export const COLORS = [
	"#FF5733", // Red Orange
	"#FFB300", // Vivid Yellow
	"#75FF33", // Bright Green
	"#33FF57", // Light Green
	"#33B5FF", // Sky Blue
	"#335BFF", // Bright Blue
	"#A333FF", // Bright Purple
	"#FF33B5", // Vivid Pink
	"#FFDA33", // Bright Gold
	"#FF5E33"  // Coral
]
for (const nav of navbar!.children) {
	for (const child of nav.children) {
		if (child instanceof HTMLElement) {
			const color = COLORS[Math.floor(Math.random() * COLORS.length)]

			child.onmouseenter = () => {
				gsap.to(child, {
					duration: 0.3,

					color: color,

					ease: 'power2.inOut'
				})
			}
			child.onmouseleave = () => {
				gsap.to(child, {
					duration: 0.3,

					color: document.documentElement.style.getPropertyValue('--text'),

					ease: 'power2.inOut'
				})
			}

			var added = false
			if (child.hasAttribute('href')) {
				child.onclick = () => {
					window.location.href = child.getAttribute('href')!
				}
			} else {
				for (const child0 of document.body.children) {
					if (child0 instanceof HTMLElement && child0.id === child.innerText.toLowerCase()) {
						child.onclick = () => {
							window.scrollTo({
								top: child0.offsetTop,
								behavior: "smooth"
							})
						}
						added = true
						break
					}
				}
				if (!added) {
					child.onclick = () => {
						window.scrollTo({
							top: document.body.offsetHeight,
							behavior: "smooth"
						})
					}
				}
			}
		}
	}
}

Promise.all([
	animateHero(),

	loadEducation(),
	loadExperience(),
	loadPassion(),
	loadContact(),

	animateChat()
]).then(() => {
	animateFooter()
})