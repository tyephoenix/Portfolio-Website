import { GlobalWorkerOptions } from "pdfjs-dist";
import { queueResumeRender } from "./resume/main";
import { queuePortfolioRender } from "./portfolio/main";
import gsap from "gsap";
import { initializeLetter } from "./letter/main";

GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
).toString()

gsap.to('.loading', {
    duration: 2,

    rotate: 360,

    repeat: -1,
    repeatRefresh: true
})

initializeLetter()
queueResumeRender().then(() => {
    queuePortfolioRender()
})