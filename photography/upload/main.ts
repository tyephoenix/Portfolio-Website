import gsap from "gsap";
import { renderCircles } from "../background";


renderCircles(10)

const COLLECTION_INPUT = document.getElementById("form-collection-input") as HTMLInputElement
const COLLECTION_PREVIEW = document.querySelector("#form-collection-preview a") as HTMLDivElement

COLLECTION_INPUT.oninput = () => {
    COLLECTION_PREVIEW.innerHTML = COLLECTION_INPUT.value

    gsap.to('#form-collection-preview', {
        duration: 0.3,

        opacity: COLLECTION_INPUT.value.trim() !== "" ? 1 : 0,

        ease: 'power2.inOut'
    })
}


const KEYWORDS_INPUT = document.getElementById("form-keywords-input") as HTMLInputElement
const KEYWORDS_PREVIEW = document.getElementById("form-keywords-preview") as HTMLDivElement

KEYWORDS_INPUT.onkeydown = (e) => {
    if (e.key === "Enter") {

        const keyword = document.createElement("div")
        keyword.className = 'form-keyword-preview'

        const keywordText = document.createElement("a")
        keywordText.innerHTML = KEYWORDS_INPUT.value
        keyword.appendChild(keywordText)

        const keywordRemove = document.createElement("span")
        keywordRemove.className = 'material-symbols-outlined'
        keywordRemove.innerHTML = 'close'
        keyword.appendChild(keywordRemove)

        keyword.onmouseenter = () => {
            gsap.to(keyword, {
                duration: 0.3,

                opacity: 0.7,

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
                }
            })
        }

        KEYWORDS_PREVIEW.appendChild(keyword)
        KEYWORDS_INPUT.value = ""

        e.preventDefault()
    }
}


const UPLOAD = document.getElementById("form-upload") as HTMLDivElement
const UPLOAD_PREVIEW = document.getElementById("form-upload-preview") as HTMLDivElement

UPLOAD.ondragenter = (e) => {
    e.preventDefault()

    gsap.to(UPLOAD, {
        duration: 0.3,

        width: '90%',

        ease: 'power2.inOut'
    })
}
UPLOAD.ondragleave = (e) => {
    e.preventDefault()

    gsap.to(UPLOAD, {
        duration: 0.3,

        width: '80%',

        ease: 'power2.inOut'
    })
}
UPLOAD.ondragover = (e) => {
    e.preventDefault()
}
UPLOAD.ondrop = (e) => {
    e.preventDefault()

    if (e.dataTransfer) {
        uploadImages(e.dataTransfer.files)
    }
}
UPLOAD.onclick = () => {
    const input = document.createElement("input") as HTMLInputElement
    input.type = "file"
    input.accept = ".jpg,.jpeg"
    input.multiple = true
    input.click()
    input.onchange = (e) => {
        if (e.target instanceof HTMLInputElement && e.target.files) {
            uploadImages(e.target.files)
        }
    }
}

function uploadImages(files: FileList) {
    for (const file of files) {
        if (!file.name || (file.type !== "image/jpeg" && file.type !== "image/jpg")) {
            continue
        }

        const reader = new FileReader()
        reader.onload = (e) => {
            if (e.target) {
                const src = new Image()
                src.dataset.name = file.name
                src.src = e.target.result as string
                src.onload = () => {
                    const image = document.createElement("div")
                    image.className = "form-image-preview"

                    image.appendChild(src)

                    const remove = document.createElement("span")
                    remove.className = "material-symbols-outlined"
                    remove.innerHTML = "close"
                    image.appendChild(remove)

                    UPLOAD_PREVIEW.appendChild(image)

                    image.onmouseenter = () => {
                        gsap.to(image, {
                            duration: 0.3,

                            opacity: 0.7,

                            ease: 'power2.inOut'
                        })
                    }
                    image.onmouseleave = () => {
                        gsap.to(image, {
                            duration: 0.3,

                            opacity: 1,

                            ease: 'power2.inOut'
                        })
                    }
                    image.onclick = () => {
                        gsap.to(image, {
                            duration: 0.5,

                            opacity: 0,
                            scale: 0,

                            ease: 'back.in',

                            onComplete: () => {
                                image.remove()
                            }
                        })
                    }
                }
            }
        }
        reader.readAsDataURL(file)
    }
}


const SEND = document.getElementById("form-send") as HTMLDivElement
SEND.onmouseenter = () => {
    gsap.to(SEND, {
        duration: 0.3,

        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--white'),
        color: getComputedStyle(document.documentElement).getPropertyValue('--black'),

        ease: 'power2.inOut'
    })
}
SEND.onmouseleave = () => {
    gsap.to(SEND, {
        duration: 0.3,

        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--black'),
        color: getComputedStyle(document.documentElement).getPropertyValue('--white'),

        ease: 'power2.inOut'
    })
}
SEND.onclick = async() => {
    const packet = {
        collection: COLLECTION_INPUT.value.trim(),
        keywords: Array.from(KEYWORDS_PREVIEW.children).map((child) => child.querySelector("a")!.innerText.trim()),
        uploads: Array.from(UPLOAD_PREVIEW.children).map((child) => {
            const image = child.querySelector("img") as HTMLImageElement
            return {
                name: image.dataset.name,
                data: image.src
            }
        })
    }

    await fetch("/api/photography/upload", {
        method: "POST",
        body: JSON.stringify(packet),
        headers: {
            "Content-Type": "application/json"
        }
    })

    alert("Upload Successful")
}