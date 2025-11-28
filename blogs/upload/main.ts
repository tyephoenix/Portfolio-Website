import { markdown } from "@codemirror/lang-markdown";
import { EditorState } from "@codemirror/state";
import { keymap } from "@codemirror/view";
import { githubLight } from "@fsegurai/codemirror-theme-github-light";
import { basicSetup, EditorView } from "codemirror";
import { renderBlog } from "../blog";
import gsap from "gsap";


const PREVIEW = document.getElementById("form-preview") as HTMLDivElement

const TITLE_INPUT = document.getElementById("form-title-input") as HTMLInputElement
const SERIES_INPUT = document.getElementById("form-series-input") as HTMLInputElement
const KEYWORDS_INPUT = document.getElementById("form-keywords-input") as HTMLInputElement

const COVER_PHOTO_UPLOAD = document.getElementById("form-cover-photo-input")!.querySelector("span") as HTMLElement
const COVER_PHOTO_INPUT = document.getElementById("form-cover-photo-input-url") as HTMLInputElement

const SOURCE_TEXT = document.getElementById("form-source-text") as HTMLDivElement

const saveKeymap = keymap.of([{
    key: "Mod-s",
    preventDefault: true,
    run: () => {
        render()
        return true
    }
}])

const CONTENT = new EditorView({
    state: EditorState.create({
        doc: "# My First Header\n\nThis is my first paragraph.",
        extensions: [
            basicSetup,
            githubLight,
            markdown(),
            EditorView.lineWrapping,
            saveKeymap
        ]
    }),
    parent: SOURCE_TEXT
})

TITLE_INPUT.onchange = () => {
    render()
}
SERIES_INPUT.onchange = () => {
    render()
}

const KEYWORDS: string[] = []
KEYWORDS_INPUT.onkeydown = (e) => {
    if (e.key === "Enter") {
        KEYWORDS.push(KEYWORDS_INPUT.value.trim())
        KEYWORDS_INPUT.value = ""
        render()
        e.preventDefault()
    }
}

var COVER_PHOTO_URL = ""
COVER_PHOTO_INPUT.onchange = () => {
    COVER_PHOTO_URL = COVER_PHOTO_INPUT.value.trim()
    render()
}
COVER_PHOTO_UPLOAD.onmouseenter = () => {
    gsap.to(COVER_PHOTO_UPLOAD, {
        duration: 0.3,

        y: -5,
        scale: 1.05,

        ease: 'power2.inOut'
    })
}
COVER_PHOTO_UPLOAD.onmouseleave = () => {
    gsap.to(COVER_PHOTO_UPLOAD, {
        duration: 0.3,

        y: 0,
        scale: 1,

        ease: 'power2.inOut'
    })
}
COVER_PHOTO_UPLOAD.onclick = () => {
    const input = document.createElement("input") as HTMLInputElement
    input.type = "file"
    input.accept = ".jpg,.jpeg"
    input.click()
    input.onchange = (e) => {
        if (e.target instanceof HTMLInputElement && e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            const reader = new FileReader()
            reader.onload = (e) => {
                if (e.target) {
                    COVER_PHOTO_URL = e.target.result as string
                    render()
                }
            }
            reader.readAsDataURL(file)
        }
    }
}

async function render() {
    const blog = CONTENT.state.doc.toString()

    PREVIEW.innerHTML = ''

    const blogElement = await renderBlog(TITLE_INPUT.value, SERIES_INPUT.value, KEYWORDS, COVER_PHOTO_URL, new Date(), blog)
    PREVIEW.appendChild(blogElement)

    for (const keyword of blogElement.querySelectorAll(".blog-keyword") as NodeListOf<HTMLDivElement>) {
        keyword.onmouseenter = () => {
            gsap.to(keyword, {
                duration: 0.3,

                opacity: 0.5,

                ease: 'power2.inOut'
            })
        }
        keyword.onmouseleave = () => {
            gsap.to(keyword, {
                duration: 0.3,

                opacity: 1,

                ease: 'power2.inOut'
            })
        }
        keyword.onclick = () => {
            gsap.to(keyword, {
                duration: 0.5,

                opacity: 0,
                scale: 0,

                ease: 'back.in',

                onComplete: () => {
                    keyword.remove()

                    for (let i = KEYWORDS.length - 1; i >= 0; i--) {
                        if (KEYWORDS[i] === keyword.textContent) {
                            KEYWORDS.splice(i, 1)
                            break
                        }
                    }
                }
            })
        }
    }
}
render()



// Form Options
const UPLOAD = document.getElementById("form-source-options-upload") as HTMLDivElement
UPLOAD.onmouseenter = () => {
    gsap.to(UPLOAD, {
        duration: 0.3,

        opacity: 1,

        ease: 'power2.inOut'
    })
    gsap.to(UPLOAD.querySelector("span") as HTMLElement, {
        duration: 0.3,

        y: -5,
        scale: 1.05,

        ease: 'power2.inOut'
    })
}
UPLOAD.onmouseleave = () => {
    gsap.to(UPLOAD, {
        duration: 0.3,

        opacity: 0.5,

        ease: 'power2.inOut'
    })
    gsap.to(UPLOAD.querySelector("span") as HTMLElement, {
        duration: 0.3,

        y: 0,
        scale: 1,

        ease: 'power2.inOut'
    })
}
UPLOAD.onclick = () => {
    const input = document.createElement("input") as HTMLInputElement
    input.type = "file"
    input.accept = ".md,.txt"
    input.click()
    input.onchange = (e) => {
        if (e.target instanceof HTMLInputElement && e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            const reader = new FileReader()
            reader.onload = (e) => {
                if (e.target) {
                    CONTENT.setState(EditorState.create({
                        doc: e.target.result as string,
                        extensions: [
                            basicSetup,
                            githubLight,
                            markdown(),
                            EditorView.lineWrapping,
                            saveKeymap
                        ]
                    }))
                    render()
                }
            }
            reader.readAsText(file)
        }
    }
}

const DOWNLOAD = document.getElementById("form-source-options-download") as HTMLDivElement
DOWNLOAD.onmouseenter = () => {
    gsap.to(DOWNLOAD, {
        duration: 0.3,

        opacity: 1,

        ease: 'power2.inOut'
    })
    gsap.to(DOWNLOAD.querySelector("span") as HTMLElement, {
        duration: 0.3,

        y: 5,
        scale: 0.95,

        ease: 'power2.inOut'
    })
}
DOWNLOAD.onmouseleave = () => {
    gsap.to(DOWNLOAD, {
        duration: 0.3,

        opacity: 0.5,

        ease: 'power2.inOut'
    })
    gsap.to(DOWNLOAD.querySelector("span") as HTMLElement, {
        duration: 0.3,

        y: 0,
        scale: 1,

        ease: 'power2.inOut'
    })
}
DOWNLOAD.onclick = () => {
    const blob = new Blob([CONTENT.state.doc.toString()], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "blog.md"
    a.click()
}


const RENDER = document.getElementById("form-source-options-render") as HTMLDivElement
RENDER.onmouseenter = () => {
    gsap.to(RENDER, {
        duration: 0.3,

        opacity: 1,

        ease: 'power2.inOut'
    })
    gsap.to(RENDER.querySelector("span") as HTMLElement, {
        duration: 0.3,

        rotate: 180,

        ease: 'power2.inOut'
    })
}
RENDER.onmouseleave = () => {
    gsap.to(RENDER, {
        duration: 0.3,
        
        opacity: 0.5,

        ease: 'power2.inOut'
    })
    gsap.to(RENDER.querySelector("span") as HTMLElement, {
        duration: 0.3,

        rotate: 0,

        ease: 'power2.inOut'
    })
}
RENDER.onclick = () => {
    render()
}


const PUBLISH = document.getElementById("form-source-options-publish") as HTMLDivElement
PUBLISH.onmouseenter = () => {
    gsap.to([PUBLISH, PUBLISH.querySelector("span") as HTMLElement, PUBLISH.querySelector("a") as HTMLElement], {
        duration: 0.3,

        color: getComputedStyle(document.documentElement).getPropertyValue('--black'),
        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--white'),

        ease: 'power2.inOut'
    })
    gsap.to(PUBLISH, {
        duration: 0.3,

        scale: 1.05,
        rotate: 5,

        ease: 'power2.inOut'
    })
}
PUBLISH.onmouseleave = () => {
    gsap.to([PUBLISH, PUBLISH.querySelector("span") as HTMLElement, PUBLISH.querySelector("a") as HTMLElement], {
        duration: 0.3,
        
        color: getComputedStyle(document.documentElement).getPropertyValue('--white'),
        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--black'),

        ease: 'power2.inOut'
    })
    gsap.to(PUBLISH, {
        duration: 0.3,

        scale: 1,
        rotate: 0,

        ease: 'power2.inOut'
    })
}
PUBLISH.onclick = async () => {
    if (COVER_PHOTO_URL.trim().length === 0) {
        alert("Please upload a cover photo")
        return
    }
    if (TITLE_INPUT.value.trim().length === 0) {
        alert("Please enter a title")
        return
    }
    if (SERIES_INPUT.value.trim().length === 0) {
        alert("Please enter a series")
        return
    }
    if (CONTENT.state.doc.toString().trim().length === 0) {
        alert("Please enter a content")
        return
    }

    await fetch("/api/blogs/upload", {
        method: "POST",
        body: JSON.stringify({
            series: SERIES_INPUT.value.trim(),
            title: TITLE_INPUT.value.trim(),
            keywords: KEYWORDS.map((keyword) => keyword.trim()),
            coverPhoto: COVER_PHOTO_URL.trim(),
            content: CONTENT.state.doc.toString()
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })

    alert("Upload Successful")
}