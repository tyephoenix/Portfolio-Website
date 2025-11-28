import gsap from "gsap";
import { setupNetwork } from "./network";
import { setupCatalog } from "./catalog";


setupNetwork()

setupCatalog()

gsap.to("#hero-scroll", {
    duration: 1,

    gap: 10,

    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true
})