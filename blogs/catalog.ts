import gsap from "gsap"
import { renderBlogPreview, slugify } from "./blog"


export async function loadBlog(blog: string): Promise<{ path: string, series: string, title: string, keywords: string[], coverPhoto: Promise<string>, content: Promise<string>, date: Date }> {
    const blogFile = await fetch(`${blog}/index.json`)
    const blogData = await blogFile.json()

    blogData.date = new Date(blogData.date)

    blogData.coverPhoto = await new Promise(async (resolve) => {
        const image = await fetch(`${blog}/cover.jpg`)

        const arrayBuffer = await image.arrayBuffer()
        resolve(URL.createObjectURL(new Blob([arrayBuffer])))
    })

    blogData.content = await new Promise(async (resolve) => {
        const content = await fetch(`${blog}/content.md`)
        const text = await content.text()
        resolve(text)
    })

    return blogData
}

const BLOGS: { path: string, series: string, title: string, keywords: string[], coverPhoto: Promise<string>, content: Promise<string>, date: Date }[] = []
export async function setupCatalog() {
    const catalog = await fetch("/blogs/index.json")
    const catalogData = await catalog.json()

    for (const top10 of catalogData.slice(catalogData.length - 10, catalogData.length)) {
        BLOGS.push(await loadBlog(top10))
    }

    await setupLatest()
    await setupSearch()

    await Promise.all(catalogData.slice(0, catalogData.length - 10).map(async (blog: string) => {
        BLOGS.push(await loadBlog(blog))
    }))
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

async function setupSearch() {
    const input = document.querySelector("#catalog-search-input input") as HTMLInputElement
    const results = document.getElementById("catalog-search-results") as HTMLDivElement
    results.innerHTML = ""

    for (const blog of BLOGS.slice(0, 10)) {
        const blogPreview = await renderBlogPreview(blog.title, blog.series, blog.keywords, await blog.coverPhoto, blog.date, await blog.content)
        blogPreview.onclick = () => {
            if ((import.meta as any).env.MODE === "development") {
                window.location.href = `/blogs/series/blog/?series=${slugify(blog.series)}&title=${slugify(blog.title)}`
            } else {
                window.location.href = `/blogs/${slugify(blog.series)}/${slugify(blog.title)}/`
            }
        }
        results.appendChild(blogPreview)
    }

    input.onkeyup = async () => {
        const res = BLOGS.filter((blog) => {
            return blog.title.toLowerCase().includes(input.value.toLowerCase()) || blog.series.toLowerCase().includes(input.value.toLowerCase()) || blog.keywords.some((keyword) => keyword.toLowerCase().includes(input.value.toLowerCase()))
        })

        results.innerHTML = ""
        for (const blog of res) {
            const blogPreview = await renderBlogPreview(blog.title, blog.series, blog.keywords, await blog.coverPhoto, blog.date, await blog.content)
            blogPreview.onclick = () => {
                if ((import.meta as any).env.MODE === "development") {
                    window.location.href = `/blogs/series/blog/?series=${slugify(blog.series)}&title=${slugify(blog.title)}`
                } else {
                    window.location.href = `/blogs/${slugify(blog.series)}/${slugify(blog.title)}/`
                }
            }
            results.appendChild(blogPreview)
        }
    }
}