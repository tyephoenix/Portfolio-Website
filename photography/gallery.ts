import gsap from "gsap"


const COLLECTIONS: { path: string, collection: string, keywords: string[], uploads: string[], date: Date }[] = []
export async function setupGallery(initialCollections: number = 3) {
    clearGallery()

    const indexFile = await fetch('/photography/index.json')
    const index = await indexFile.json()

    const filter: { keyword: string, count: number }[] = []
    for (const collection of index) {
        const collectionFile = await fetch(collection + '/index.json')
        const collectionData = await collectionFile.json()
        collectionData.date = new Date(collectionData.date)
        collectionData.path = collection
        COLLECTIONS.push(collectionData)

        for (const keyword of collectionData.keywords) {
            const existingKeyword = filter.find((f) => f.keyword === keyword)
            if (existingKeyword) {
                existingKeyword.count = existingKeyword.count + 1
            } else {
                filter.push({ keyword, count: 1 })
            }
        }
    }

    const FILTER = document.getElementById("filter-keywords") as HTMLSelectElement
    FILTER.innerHTML = ""
    const noneOption = document.createElement("option")
    noneOption.value = ""
    noneOption.textContent = "NONE"
    FILTER.appendChild(noneOption)
    for (const keyword of filter) {
        const option = document.createElement("option")
        option.value = keyword.keyword
        option.textContent = `${keyword.keyword} (${keyword.count})`
        FILTER.appendChild(option)
    }
    FILTER.onchange = () => {
        clearGallery()
        const keyword = FILTER.value
        if (keyword.length === 0) {
            loadNextCollection()
        } else {
            for (let i = COLLECTIONS.length - 1; i >= 0; i--) {
                const collection = COLLECTIONS[i]
                if (collection.keywords.includes(keyword)) {
                    loadCollection(collection)
                }
            }
        }
    }


    const LOAD = document.getElementById("load") as HTMLDivElement
    LOAD.onmouseenter = () => {
        gsap.to(LOAD, {
            duration: 0.5,

            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--white'),
            color: getComputedStyle(document.documentElement).getPropertyValue('--black'),

            ease: 'power2.inOut'
        })
    }
    LOAD.onmouseleave = () => {
        gsap.to(LOAD, {
            duration: 0.5,

            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--black'),
            color: getComputedStyle(document.documentElement).getPropertyValue('--white'),

            ease: 'power2.inOut'
        })
    }
    LOAD.onclick = loadNextCollection
    for (let i = 0; i < initialCollections; i++) {
        loadNextCollection()
    }
    window.addEventListener("scroll", () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
            loadNextCollection()
        }
    })

    const PRESENTATION_CLOSE = document.getElementById("presentation-close") as HTMLDivElement
    PRESENTATION_CLOSE.onclick = () => {
        gsap.to('#presentation', {
            duration: 0.5,

            display: "none",
            opacity: 0,

            ease: 'power2.inOut'
        })
    }

    const PRESENTATION_OPEN = document.getElementById("presentation-open") as HTMLDivElement
    PRESENTATION_OPEN.onmouseenter = () => {
        gsap.to(PRESENTATION_OPEN, {
            duration: 0.3,

            borderColor: getComputedStyle(document.documentElement).getPropertyValue('--white'),
            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--black'),
            color: getComputedStyle(document.documentElement).getPropertyValue('--white'),

            ease: 'power2.inOut'
        })
    }
    PRESENTATION_OPEN.onmouseleave = () => {
        gsap.to(PRESENTATION_OPEN, {
            duration: 0.3,

            borderColor: getComputedStyle(document.documentElement).getPropertyValue('--black'),
            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--white'),
            color: getComputedStyle(document.documentElement).getPropertyValue('--black'),

            ease: 'power2.inOut'
        })
    }
    PRESENTATION_OPEN.onclick = () => {
        const WATERMARK_PATH = document.getElementById("watermark-path") as HTMLSpanElement
        const path = decodeURIComponent(atob(WATERMARK_PATH.innerText))
        window.open(`${window.location.origin}/photography/collections/${path}`, '_blank')
    }

    const PRESENTATION_DOWNLOAD = document.getElementById("presentation-download") as HTMLDivElement
    PRESENTATION_DOWNLOAD.onmouseenter = () => {
        gsap.to(PRESENTATION_DOWNLOAD, {
            duration: 0.3,

            borderColor: getComputedStyle(document.documentElement).getPropertyValue('--white'),
            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--black'),
            color: getComputedStyle(document.documentElement).getPropertyValue('--white'),

            ease: 'power2.inOut'
        })
    }
    PRESENTATION_DOWNLOAD.onmouseleave = () => {
        gsap.to(PRESENTATION_DOWNLOAD, {
            duration: 0.3,

            borderColor: getComputedStyle(document.documentElement).getPropertyValue('--black'),
            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--white'),
            color: getComputedStyle(document.documentElement).getPropertyValue('--black'),

            ease: 'power2.inOut'
        })
    }
    PRESENTATION_DOWNLOAD.onclick = () => {
        const PRESENTATION_IMAGE = document.querySelector("#presentation img") as HTMLImageElement
        const a = document.createElement("a")
        a.href = PRESENTATION_IMAGE.src
        a.download = PRESENTATION_IMAGE.src.split("/").pop()!
        a.click()
    }

    const PRESENTATION_LINK = document.getElementById("presentation-link") as HTMLDivElement
    PRESENTATION_LINK.onmouseenter = () => {
        gsap.to(PRESENTATION_LINK, {
            duration: 0.3,

            borderColor: getComputedStyle(document.documentElement).getPropertyValue('--white'),
            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--black'),
            color: getComputedStyle(document.documentElement).getPropertyValue('--white'),

            ease: 'power2.inOut'
        })
    }
    PRESENTATION_LINK.onmouseleave = () => {
        gsap.to(PRESENTATION_LINK, {
            duration: 0.3,

            borderColor: getComputedStyle(document.documentElement).getPropertyValue('--black'),
            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--white'),
            color: getComputedStyle(document.documentElement).getPropertyValue('--black'),

            ease: 'power2.inOut'
        })
    }
    PRESENTATION_LINK.onclick = () => {
        const WATERMARK_PATH = document.getElementById("watermark-path") as HTMLSpanElement
        const path = decodeURIComponent(atob(WATERMARK_PATH.innerText))
        navigator.clipboard.writeText(`${window.location.origin}/photography/collections/${path}`)
    }
}

function clearGallery() {
    gsap.set('#load', {
        display: "flex"
    })
    for (const collection of document.querySelectorAll('.collection')) {
        collection.remove()
    }
}

function loadNextCollection() {
    const FILTER = document.getElementById("filter-keywords") as HTMLSelectElement
    console.log(FILTER.value)

    if (FILTER.value.length > 0) {
        return
    }

    for (let i = COLLECTIONS.length - 1; i >= 0; i--) {
        const collection = COLLECTIONS[i]

        if (Array.from(document.querySelectorAll('.collection')).some((c) => c instanceof HTMLElement && c.dataset.path === collection.path)) {
            continue
        }

        loadCollection(collection)

        if (i === 0) {
            gsap.set('#load', {
                display: "none"
            })
        }
        break
    }
}

function loadCollection(collection: { path: string, collection: string, keywords: string[], uploads: string[], date: Date }) {
    const GALLERY = document.getElementById("gallery") as HTMLDivElement

    const collectionElement = document.createElement("div")
    collectionElement.className = "collection"
    collectionElement.dataset.path = collection.path
    
    const collectionMetadata = document.createElement("div")
    collectionMetadata.className = "collection-metadata"
    collectionElement.appendChild(collectionMetadata)

    const collectionTitle = document.createElement("h2")
    collectionTitle.textContent = collection.collection
    collectionMetadata.appendChild(collectionTitle)

    const collectionDate = document.createElement("h3")
    collectionDate.textContent = collection.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    collectionMetadata.appendChild(collectionDate)

    const collectionPhotos = document.createElement("div")
    collectionPhotos.className = "collection-photos"
    for (const upload of collection.uploads) {
        const photoElement = document.createElement("img")
        photoElement.src = upload
        collectionPhotos.appendChild(photoElement)

        photoElement.onmouseenter = () => {
            gsap.to(photoElement, {
                duration: 0.5,

                scale: 1.01,
                filter: "grayscale(100%)",

                ease: 'power2.inOut'
            })
        }
        photoElement.onmouseleave = () => {
            gsap.to(photoElement, {
                duration: 0.5,

                scale: 1,
                filter: "grayscale(0%)",

                ease: 'power2.inOut'
            })
        }
        photoElement.onclick = () => {
            present(photoElement)
        }
    }
    collectionElement.appendChild(collectionPhotos)

    GALLERY.insertBefore(collectionElement, GALLERY.children[GALLERY.children.length - 1])
}

function present(image: HTMLImageElement) {
    const path = image.src.split("/").slice(-2).join('/')
    const id = btoa(encodeURIComponent(path))

    const WATERMARK_PATH = document.getElementById("watermark-path") as HTMLSpanElement
    WATERMARK_PATH.innerText = id

    const PRESENTATION = document.getElementById("presentation") as HTMLDivElement
    const PRESENTATION_IMAGE = document.querySelector("#presentation img") as HTMLImageElement
    PRESENTATION_IMAGE.src = image.src

    gsap.to(PRESENTATION, {
        duration: 0.5,

        display: "flex",
        opacity: 1,

        ease: 'power2.inOut'
    })
}