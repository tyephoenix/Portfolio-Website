import './render/engine'
import { GlobalWorkerOptions } from "pdfjs-dist";
import { queueResumeRender, setupResumeRender } from "./resume/main";
import { queuePortfolioRender, setupPortfolioRender } from "./portfolio/main";
import gsap from "gsap";
import { initializeLetter } from "./letter/main";

GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url
).toString()

gsap.to('.loading', {
    duration: 2,

    rotate: 360,

    repeat: -1,
    repeatRefresh: true
})

const HEADER = document.getElementById('header') as HTMLDivElement
HEADER.onclick = () => {
    window.location.href = '/'
}


const PARAMS = new URLSearchParams(window.location.search)

if (PARAMS.has('admin')) {
    initializeLetter()
}

if (PARAMS.has('download')) {
    if (PARAMS.get('download') === 'resume') {
        location.href = '/resume.pdf'
    } else if (PARAMS.get('download') === 'portfolio') {
        location.href = '/portfolio.pdf'
    }
} else {
    setupResumeRender()
    setupPortfolioRender()
    queueResumeRender().then(() => {
        queuePortfolioRender()
    })
}