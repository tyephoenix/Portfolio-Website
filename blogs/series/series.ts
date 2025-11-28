import gsap from "gsap"
import { renderBlogPreview, slugify } from "../blog"
import { loadBlog } from "../catalog"


const BLOGS: { path: string, series: string, title: string, keywords: string[], coverPhoto: Promise<string>, content: Promise<string>, date: Date }[] = []
export async function setup(series?: string) {
    const catalog = await fetch("/blogs/index.json")
    const catalogData = await catalog.json()

    if (!series) {
        if ((import.meta as any).env.MODE === "development") {
            series = catalogData[0].split("/")[3]
        } else {
            series = window.location.pathname.split("/")[2]
        }
    }

    for (const blog of catalogData.filter((blog: string) => blog.split("/")[3] === series)) {
        BLOGS.push(await loadBlog(blog))
    }

    const header = document.getElementById("header") as HTMLHeadingElement
    header.textContent = BLOGS[0].series.toLowerCase()

    const pathSeries = document.getElementById("path-series") as HTMLAnchorElement
    pathSeries.textContent = BLOGS[0].series

    await setupLatest()
    await setupList()
}

async function setupLatest() {
    if (BLOGS.length === 0) 
        return
    
    const featured = document.getElementById("catalog-latest-featured") as HTMLDivElement
    featured.innerHTML = ""
    const list = document.getElementById("catalog-latest-list") as HTMLDivElement
    list.innerHTML = ""

    const featuredBlog = BLOGS[0]
    const featuredBlogPreview = await renderBlogPreview(featuredBlog.title, featuredBlog.series, featuredBlog.keywords, await featuredBlog.coverPhoto, featuredBlog.date, await featuredBlog.content)
    featuredBlogPreview.onmouseenter = () => {
        gsap.to(featuredBlogPreview, {
            duration: 0.3,

            scale: 1.02,

            ease: 'power2.inOut'
        })
    }
    featuredBlogPreview.onmouseleave = () => {
        gsap.to(featuredBlogPreview, {
            duration: 0.3,

            scale: 1,

            ease: 'power2.inOut'
        })
    }
    featuredBlogPreview.onclick = () => {
        if ((import.meta as any).env.MODE === "development") {
            window.location.href = `/blogs/series/blog/?series=${slugify(featuredBlog.series)}&title=${slugify(featuredBlog.title)}`
        } else {
            window.location.href = `/blogs/${slugify(featuredBlog.series)}/${slugify(featuredBlog.title)}/`
        }
    }
    featured.appendChild(featuredBlogPreview)

    for (const blog of BLOGS.slice(1, 4)) {
        const blogPreview = await renderBlogPreview(blog.title, blog.series, blog.keywords, await blog.coverPhoto, blog.date, await blog.content)
        blogPreview.onmouseenter = () => {
            gsap.to(blogPreview, {
                duration: 0.3,

                scale: 1.02,

                ease: 'power2.inOut'
            })
        }
        blogPreview.onmouseleave = () => {
            gsap.to(blogPreview, {
                duration: 0.3,

                scale: 1,

                ease: 'power2.inOut'
            })
        }
        blogPreview.onclick = () => {
            if ((import.meta as any).env.MODE === "development") {
                window.location.href = `/blogs/series/blog/?series=${slugify(blog.series)}&title=${slugify(blog.title)}`
            } else {
                window.location.href = `/blogs/${slugify(blog.series)}/${slugify(blog.title)}/`
            }
        }
        list.appendChild(blogPreview)
    }
}

async function setupList() {
    const list = document.getElementById("catalog-list") as HTMLDivElement
    list.innerHTML = ""

    for (const blog of BLOGS) {
        const blogPreview = await renderBlogPreview(blog.title, blog.series, blog.keywords, await blog.coverPhoto, blog.date, await blog.content)
        blogPreview.onclick = () => {
            if ((import.meta as any).env.MODE === "development") {
                window.location.href = `/blogs/series/blog/?series=${slugify(blog.series)}&title=${slugify(blog.title)}`
            } else {
                window.location.href = `/blogs/${slugify(blog.series)}/${slugify(blog.title)}/`
            }
        }
        list.appendChild(blogPreview)
    }
}