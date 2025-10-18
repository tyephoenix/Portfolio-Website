import gsap from "gsap"


export async function loadEducation() {
    const EDUCATION = document.getElementById("education") as HTMLElement
    const DATA = await (await fetch("/education.json")).json()

    for (let i = 0; i < DATA.length; i++) {
        const item = DATA[i]

        const CARD = document.createElement("div")
        CARD.className = "card"
        gsap.set(CARD, {
            alignSelf: i % 2 == 0 ? 'flex-start' : 'flex-end'
        })

        const TITLE = document.createElement("h2")
        TITLE.innerText = item.name
        CARD.appendChild(TITLE)
        gsap.set(TITLE, {
            textAlign: 'center'
        })

        const COURSEWORK = document.createElement("p")
        COURSEWORK.innerText = item.courses.slice(item.courses.length - 3, item.courses.length).map((value: string) => {
            return value.includes(":") ? value.split(": ")[1] : value
        }).join(", ")
        CARD.appendChild(COURSEWORK)
        gsap.set(COURSEWORK, {
            textAlign: 'center',
            fontWeight: '400'
        })

        const DETAILS = document.createElement("div")
        gsap.set(DETAILS, {
            display: "flex",
            justifyContent: "space-between"
        })

        const div0 = document.createElement("div")
        gsap.set(div0, {
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            textAlign: i % 2 == 0 ? 'right' : 'left'
        })

        const LINK = document.createElement("a")
        LINK.href = item.link
        LINK.target = "_blank"
        LINK.innerText = 'Visit'
        div0.appendChild(LINK)

        const FOCUS = document.createElement("h3")
        FOCUS.innerText = item.focus
        div0.appendChild(FOCUS)

        const start = new Date(item.start)
        const end = new Date(item.end)
        const TIMELINE = document.createElement("p")
        TIMELINE.innerText = start.getFullYear() + " - " + end.getFullYear()
        div0.appendChild(TIMELINE)

        DETAILS.appendChild(div0)

        const emblem = document.createElement("img")
        emblem.src = item.emblem
        DETAILS.appendChild(emblem)

        if (i % 2 == 0) {
            DETAILS.appendChild(emblem)
            DETAILS.appendChild(div0)
        } else {
            DETAILS.appendChild(div0)
            DETAILS.appendChild(emblem)
        }
        CARD.appendChild(DETAILS)


        EDUCATION.appendChild(CARD)
    }
}

export async function loadExperience() {
    const EXPERIENCE = document.getElementById("experience") as HTMLElement
    const DATA = await (await fetch("/experience.json")).json()

    for (let i = 0; i < DATA.length; i++) {
        const item = DATA[i]

        const CARD = document.createElement("div")
        CARD.className = "card"
        gsap.set(CARD, {
            alignSelf: i % 2 == 0 ? 'flex-start' : 'flex-end'
        })

        const TITLE = document.createElement("h2")
        TITLE.innerText = item.name
        CARD.appendChild(TITLE)
        gsap.set(TITLE, {
            textAlign: 'center'
        })

        const WHO = document.createElement("p")
        WHO.innerText = item.description.who
        CARD.appendChild(WHO)
        gsap.set(WHO, {
            textAlign: 'center',
            marginBottom: '25px',
            fontWeight: '400'
        })

        const WHAT = document.createElement("p")
        WHAT.innerText = item.description.what
        CARD.appendChild(WHAT)
        gsap.set(WHAT, {
            textAlign: 'center',
            marginBottom: '25px',
            fontWeight: '400',
            color: getComputedStyle(document.documentElement).getPropertyValue('--purple')
        })

        const LEARNED = document.createElement("p")
        LEARNED.innerText = item.description.learned
        CARD.appendChild(LEARNED)
        gsap.set(LEARNED, {
            textAlign: 'center',
            marginBottom: '40px',
            fontWeight: '400',
            color: getComputedStyle(document.documentElement).getPropertyValue('--green')
        })

        const DETAILS = document.createElement("div")
        gsap.set(DETAILS, {
            display: "flex",
            justifyContent: "space-between",
        })

        const div0 = document.createElement("div")
        gsap.set(div0, {
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            textAlign: i % 2 == 0 ? 'right' : 'left'
        })

        const LINK = document.createElement("a")
        LINK.href = item.link
        LINK.target = "_blank"
        LINK.innerText = 'Visit'
        div0.appendChild(LINK)

        const ROLE = document.createElement("h3")
        ROLE.innerText = item.role
        div0.appendChild(ROLE)

        const start = new Date(item.start)
        const end = item.end ? new Date(item.end) : undefined
        const TIMELINE = document.createElement("p")
        TIMELINE.innerText = start.toLocaleString('en-US', { month: 'long' }) + " " + start.getFullYear() + " - " + (end ? end.toLocaleString('en-US', { month: 'long' }) + " " + end.getFullYear() : "Present")
        div0.appendChild(TIMELINE)

        DETAILS.appendChild(div0)

        const image = await createDynamicImage(item)
        DETAILS.appendChild(image)

        if (i % 2 == 0) {
            DETAILS.appendChild(image)
            DETAILS.appendChild(div0)
        } else {
            DETAILS.appendChild(div0)
            DETAILS.appendChild(image)
        }
        CARD.appendChild(DETAILS)


        EXPERIENCE.appendChild(CARD)
    }
}

export async function loadPassion() {
    const PASSION = document.getElementById("passion") as HTMLElement
    const DATA = await (await fetch("/passion.json")).json()

    for (let i = 0; i < DATA.length; i++) {
        const item = DATA[i]

        const CARD = document.createElement("div")
        CARD.className = "card"
        gsap.set(CARD, {
            alignSelf: i % 2 == 0 ? 'flex-start' : 'flex-end'
        })

        const TITLE = document.createElement("h2")
        TITLE.innerText = item.name
        CARD.appendChild(TITLE)
        gsap.set(TITLE, {
            textAlign: 'center'
        })

        if (item.description.what) {
            const WHAT = document.createElement("p")
            WHAT.innerText = item.description.what
            CARD.appendChild(WHAT)
            gsap.set(WHAT, {
                textAlign: 'center',
                marginBottom: '25px',
                fontWeight: '400'
            })
        }
        if (item.description.why) {
            const WHY = document.createElement("p")
            WHY.innerText = item.description.why
            CARD.appendChild(WHY)
            gsap.set(WHY, {
                textAlign: 'center',
                marginBottom: '40px',
                fontWeight: '400',
                color: getComputedStyle(document.documentElement).getPropertyValue('--purple')
            })
        }

        const DETAILS = document.createElement("div")
        gsap.set(DETAILS, {
            display: "flex",
            justifyContent: "space-between"
        })

        const div0 = document.createElement("div")
        gsap.set(div0, {
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            textAlign: i % 2 == 0 ? 'right' : 'left'
        })

        const LINK = document.createElement("a")
        LINK.href = item.link
        LINK.target = "_blank"
        LINK.innerText = 'Visit'
        div0.appendChild(LINK)

        const ROLE = document.createElement("h3")
        ROLE.innerText = item.role
        div0.appendChild(ROLE)

        DETAILS.appendChild(div0)

        const image = await createDynamicImage(item)
        DETAILS.appendChild(image)

        if (i % 2 == 0) {
            DETAILS.appendChild(image)
            DETAILS.appendChild(div0)
        } else {
            DETAILS.appendChild(div0)
            DETAILS.appendChild(image)
        }
        CARD.appendChild(DETAILS)


        PASSION.appendChild(CARD)
    }
}

export async function loadContact() {
    const CONTACT = document.getElementById("contact") as HTMLElement
    const DATA = await (await fetch("/contact.json")).json()

    if (DATA.email) {
        const div = document.createElement("div")

        const icon = document.createElement("i")
        icon.className = "fa fa-envelope"
        div.appendChild(icon)

        const text = document.createElement("a")
        text.href = `mailto:${DATA.email}`
        text.innerText = DATA.email
        text.target = "_blank"
        div.appendChild(text)

        gsap.set(div, {
            display: "flex",
            alignItems: "center",
            gap: "20px",
            fontSize: "20px"
        })

        CONTACT.appendChild(div)
    }

    if (DATA.phone) {
        const div = document.createElement("div")

        const icon = document.createElement("i")
        icon.className = "fa fa-phone"
        div.appendChild(icon)

        const text = document.createElement("a")
        text.href = `tel:${DATA.phone}`
        text.innerText = DATA.phone
        text.target = "_blank"
        div.appendChild(text)

        gsap.set(div, {
            display: "flex",
            alignItems: "center",
            gap: "20px",
            fontSize: "20px"
        })

        CONTACT.appendChild(div)
    }
    
    if (DATA.linkedin) {
        const div = document.createElement("div")

        const icon = document.createElement("i")
        icon.className = "fa fa-linkedin"
        div.appendChild(icon)

        const text = document.createElement("a")
        text.href = `https://www.linkedin.com/in/${DATA.linkedin}`
        text.innerText = DATA.linkedin
        text.target = "_blank"
        div.appendChild(text)

        gsap.set(div, {
            display: "flex",
            alignItems: "center",
            gap: "20px",
            fontSize: "20px"
        })

        CONTACT.appendChild(div)
    }

    if (DATA.twitter) {
        const div = document.createElement("div")

        const icon = document.createElement("i")
        icon.className = "fa fa-twitter"
        div.appendChild(icon)

        const text = document.createElement("a")
        text.href = `https://twitter.com/${DATA.twitter}`
        text.innerText = DATA.twitter
        text.target = "_blank"
        div.appendChild(text)

        gsap.set(div, {
            display: "flex",
            alignItems: "center",
            gap: "20px",
            fontSize: "20px"
        })

        CONTACT.appendChild(div)
    }

    if (DATA.instagram) {
        const div = document.createElement("div")

        const icon = document.createElement("i")
        icon.className = "fa fa-instagram"
        div.appendChild(icon)

        const text = document.createElement("a")
        text.href = `https://www.instagram.com/${DATA.instagram}`
        text.innerText = DATA.instagram
        text.target = "_blank"
        div.appendChild(text)

        gsap.set(div, {
            display: "flex",
            alignItems: "center",
            gap: "20px",
            fontSize: "20px"
        })

        CONTACT.appendChild(div)
    }

    if (DATA.github) {
        const div = document.createElement("div")

        const icon = document.createElement("i")
        icon.className = "fa fa-github"
        div.appendChild(icon)

        const text = document.createElement("a")
        text.href = `https://github.com/${DATA.github}`
        text.innerText = DATA.github
        text.target = "_blank"
        div.appendChild(text)

        gsap.set(div, {
            display: "flex",
            alignItems: "center",
            gap: "20px",
            fontSize: "20px"
        })

        CONTACT.appendChild(div)
    }
}



// Helpers
async function createDynamicImage(data: any) {
    const image = document.createElement("div")

    const thumbnailSrc = data.slideshow ? data.slideshow[0] : (data.video ? data.video.src : data.image)
    const dimensions = await getImageDimensions(thumbnailSrc)
    const width = data.slideshow ? dimensions.width : (data.video ? data.video.width : dimensions.width)
    const scale = (window.innerWidth < 1200 ? 128 : 256) / width
    gsap.set(image, {
        width: width * scale,
        height: dimensions.height * scale,

        backgroundImage: `url(${thumbnailSrc})`,
        backgroundSize: "cover",
        backgroundPosition: "0 0",
        backgroundRepeat: "no-repeat",
        opacity: data.slideshow ? 0.1 : 1
    })

    if (data.video) {
        const steps = dimensions.width / data.video.width
        const duration = steps / data.video.fps

        gsap.to(image, {
            duration: duration,

            backgroundPositionX: `-${data.video.width * scale * (steps - 1)}px`,

            ease: `steps(${steps - 1})`,

            repeat: -1
        })
    } else if (data.slideshow) {
        const tl = gsap.timeline({ repeat: -1})

        for (const src of data.slideshow) {
            tl.set(image, {
                backgroundImage: `url(${src})`
            }).to(image, { 
                duration: 1,

                opacity: 1,

                ease: 'power2.out'
            }).to(image, { 
                duration: 1,

                opacity: 0.1,

                ease: 'power2.out'
            }, "+=2")
        }
    }

    return image
}
async function getImageDimensions(url: string): Promise<{ width: number, height: number }> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
            resolve({ width: img.naturalWidth, height: img.naturalHeight });
        }
        img.onerror = reject
        img.src = url
    })
}