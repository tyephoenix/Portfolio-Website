import { GlobalWorkerOptions } from "pdfjs-dist";
import { downloadResume, queueResumeRender } from "./resume/main";
import { downloadPortfolio, queuePortfolioRender } from "./portfolio/main";
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


const PARAMS = new URLSearchParams(window.location.search)

if (PARAMS.has('admin')) {
    initializeLetter()
}

if (PARAMS.has('download')) {
    if (PARAMS.get('download') === 'resume') {
        downloadResume().then((url) => {
            location.href = url
        })
    } else if (PARAMS.get('download') === 'portfolio') {
        downloadPortfolio().then((url) => {
            location.href = url
        })
    }
} else {
    queueResumeRender().then(() => {
        queuePortfolioRender()
    })
}