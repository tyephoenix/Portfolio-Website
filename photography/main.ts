import gsap from "gsap";
import { renderCircles } from "./background";
import { setupCamera } from "./camera";
import { setupGallery } from "./gallery";


renderCircles(10, 1)
setupCamera()

setupGallery()

gsap.to("#hero-scroll", {
    duration: 1,

    gap: 10,

    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true
})