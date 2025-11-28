import { renderBlog, slugify } from "../../blog"
import { loadBlog } from "../../catalog"

export async function setup(series?: string, title?: string) {
    const catalog = await fetch("/blogs/index.json")
    var catalogData = await catalog.json()

    if (!series || !title) {
        if ((import.meta as any).env.MODE === "development") {
            series = catalogData[0].split("/")[2]
            title = catalogData[0].split("/")[3]
        } else {
            series = window.location.pathname.split("/").slice(2, 3)[0]
            title = window.location.pathname.split("/").slice(3, 4)[0]
        }
    }
    catalogData = await Promise.all(catalogData.filter((blog: string) => blog.split("/")[3] === series).map(async (blog: string) => {
        const index = await fetch(`${blog}/index.json`)
        const indexData = await index.json()
        return {
            path: blog,
            title: slugify(indexData.title),
        }
    }))

    document.body.innerHTML = ""
    const blogPath = catalogData.find((blog: { path: string, title: string }) => blog.title === title)
    if (blogPath != undefined) {
        const blog = await loadBlog(blogPath.path)
        document.title = blog.title
        const blogElement = await renderBlog(blog.title, blog.series, blog.keywords, await blog.coverPhoto, blog.date, await blog.content)
        document.body.appendChild(blogElement)
    }
}