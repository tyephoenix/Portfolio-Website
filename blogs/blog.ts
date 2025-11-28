import { marked } from "marked"



export async function renderBlog(title: string, series: string, keywords: string[], coverPhoto: string, date: Date, content: string) {
    const background = await fetch("/background.json")
    const backgroundData = await background.json()

    const contact = await fetch("/contact.json")
    const contactData = await contact.json()
    
    const experience = await fetch("/experience.json")
    const experienceData = await experience.json()


    const blog = document.createElement("div")
    blog.className = "blog"


    const blogPath = document.createElement("div")
    blogPath.className = "blog-path"

    const blogPathRoot = document.createElement("a")
    blogPathRoot.href = "/blogs/"
    blogPathRoot.textContent = "Phoenix Blogs"
    blogPath.appendChild(blogPathRoot)

    blogPath.appendChild(document.createTextNode("/"))

    const blogPathSeries = document.createElement("a")
    blogPathSeries.href = (((import.meta as any).env != undefined) && ((import.meta as any).env.MODE) === "development") ? `/blogs/series/?series=${slugify(series)}` : `/blogs/${slugify(series)}/`
    blogPathSeries.textContent = series
    blogPath.appendChild(blogPathSeries)

    blogPath.appendChild(document.createTextNode("/"))

    const blogPathTitle = document.createElement("a")
    blogPathTitle.textContent = title
    blogPath.appendChild(blogPathTitle)

    blog.appendChild(blogPath)


    const blogHeader = document.createElement("div")
    blogHeader.className = "blog-header"

    const blogTitle = document.createElement("h1")
    blogTitle.className = "blog-title"
    blogTitle.textContent = title
    blogHeader.appendChild(blogTitle)


    const blogSubtitle = document.createElement("div")
    blogSubtitle.className = "blog-subtitle"

    const blogSeries = document.createElement("h2")
    blogSeries.className = "blog-series"
    blogSeries.textContent = `from ${series}`
    blogSubtitle.appendChild(blogSeries)

    const blogKeywords = document.createElement("div")
    blogKeywords.className = "blog-keywords"

    for (const keyword of keywords) {
        const blogKeyword = document.createElement("div")
        blogKeyword.className = "blog-keyword"
        blogKeyword.textContent = keyword
        blogKeywords.appendChild(blogKeyword)
    }

    blogSubtitle.appendChild(blogKeywords)

    blogHeader.appendChild(blogSubtitle)


    const blogMetadata = document.createElement("div")
    blogMetadata.className = "blog-metadata"

    const blogProfile = document.createElement("div")
    blogProfile.className = "blog-profile"
    blogProfile.onclick = () => {
        window.location.href = "/"
    }

    const blogProfilePicture = document.createElement("img")
    blogProfilePicture.className = "blog-profile-picture"
    blogProfilePicture.src = '/icon.png'
    blogProfile.appendChild(blogProfilePicture)

    const blogProfileName = document.createElement("div")
    blogProfileName.className = "blog-profile-name"
    blogProfileName.textContent = backgroundData.name
    blogProfile.appendChild(blogProfileName)

    blogMetadata.appendChild(blogProfile)

    const blogDate = document.createElement("div")
    blogDate.className = "blog-date"
    blogDate.textContent = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    blogMetadata.appendChild(blogDate)

    const blogReadingTime = document.createElement("div")
    blogReadingTime.className = "blog-reading-time"

    const blogReadingTimeIcon = document.createElement("span")
    blogReadingTimeIcon.className = "material-symbols-outlined"
    blogReadingTimeIcon.textContent = "access_time"
    blogReadingTime.appendChild(blogReadingTimeIcon)

    const blogReadingTimeText = document.createElement("div")
    blogReadingTimeText.className = "blog-reading-time-text"
    blogReadingTimeText.textContent = `Reading Time: ${Math.ceil(content.split(" ").length / 200)} minutes`
    blogReadingTime.appendChild(blogReadingTimeText)

    blogMetadata.appendChild(blogReadingTime)

    blogHeader.appendChild(blogMetadata)

    blog.appendChild(blogHeader)


    const blogView = document.createElement("div")
    blogView.className = "blog-view"

    const blogContent = document.createElement("div")
    blogContent.className = "blog-content"
    blogContent.innerHTML = await marked.parse(content)
    blogView.appendChild(blogContent)

    const blogCoverPhoto = document.createElement("img")
    blogCoverPhoto.className = "blog-cover-photo"
    blogCoverPhoto.src = coverPhoto
    blogContent.prepend(blogCoverPhoto)

    const blogAuthor = document.createElement("div")
    blogAuthor.className = "blog-author"

    const blogAuthorIcon = document.createElement("img")
    blogAuthorIcon.className = "blog-author-icon"
    blogAuthorIcon.src = '/icon.png'
    blogAuthor.appendChild(blogAuthorIcon)

    const blogAuthorName = document.createElement("div")
    blogAuthorName.className = "blog-author-name"
    blogAuthorName.textContent = backgroundData.name
    blogAuthor.appendChild(blogAuthorName)

    const blogAuthorPosition = document.createElement("div")
    blogAuthorPosition.className = "blog-author-position"
    blogAuthorPosition.innerText = experienceData[0].role.replace(/\([^)]*\)/g, '').trim()
    blogAuthor.appendChild(blogAuthorPosition)

    const blogAuthorSocials = document.createElement("div")
    blogAuthorSocials.className = "blog-author-socials"

    if (contactData.linkedin) {
        const blogAuthorLinkedIn = document.createElement("i")
        blogAuthorLinkedIn.className = "fa fa-linkedin"
        blogAuthorSocials.appendChild(blogAuthorLinkedIn)

        blogAuthorLinkedIn.onclick = () => {
            window.open(`https://www.linkedin.com/in/${contactData.linkedin}`, '_blank')
        }
    }

    if (contactData.twitter) {
        const blogAuthorTwitter = document.createElement("i")
        blogAuthorTwitter.className = "fa fa-twitter"
        blogAuthorSocials.appendChild(blogAuthorTwitter)

        blogAuthorTwitter.onclick = () => {
            window.open(`https://x.com/${contactData.twitter}`, '_blank')
        }
    }

    blogAuthor.appendChild(blogAuthorSocials)

    blogView.appendChild(blogAuthor)

    blog.appendChild(blogView)

    return blog
}


export async function renderBlogPreview(title: string, series: string, keywords: string[], coverPhoto: string, date: Date, content: string) {
    const preview = document.createElement("div")
    preview.className = "blog-preview"

    const previewCoverPhoto = document.createElement("img")
    previewCoverPhoto.className = "blog-preview-cover-photo"
    previewCoverPhoto.src = coverPhoto
    preview.appendChild(previewCoverPhoto)

    
    const previewContent = document.createElement("div")
    previewContent.className = "blog-preview-content"

    
    const previewDetails = document.createElement("div")
    previewDetails.className = "blog-preview-details"

    const previewDate = document.createElement("div")
    previewDate.className = "blog-preview-date"
    previewDate.textContent = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    previewDetails.appendChild(previewDate)

    const previewReadingTime = document.createElement("div")
    previewReadingTime.className = "blog-preview-reading-time"

    const previewReadingTimeIcon = document.createElement("span")
    previewReadingTimeIcon.className = "material-symbols-outlined"
    previewReadingTimeIcon.textContent = "access_time"
    previewReadingTime.appendChild(previewReadingTimeIcon)

    const previewReadingTimeText = document.createElement("div")
    previewReadingTimeText.className = "blog-preview-reading-time-text"
    const readingTime = Math.ceil(content.split(" ").length / 200)
    previewReadingTimeText.textContent = `${readingTime} minute${readingTime > 1 ? 's' : ''}`
    previewReadingTime.appendChild(previewReadingTimeText)

    previewDetails.appendChild(previewReadingTime)

    const previewKeywords = document.createElement("div")
    previewKeywords.className = "blog-preview-keywords"

    for (const keyword of keywords.slice(0, 2)) {
        const previewKeyword = document.createElement("div")
        previewKeyword.className = "blog-preview-keyword"
        previewKeyword.textContent = keyword
        previewKeywords.appendChild(previewKeyword)
    }

    previewDetails.appendChild(previewKeywords)

    previewContent.appendChild(previewDetails)

    const previewTitle = document.createElement("div")
    previewTitle.className = "blog-preview-title"
    previewTitle.textContent = `${series}: ${title}`
    previewContent.appendChild(previewTitle)

    const previewText = document.createElement("div")
    previewText.className = "blog-preview-text"
    const markdown = await marked.parse(content)
    const text = markdown.replace(/<[^>]*>?/g, '').trim().slice(0, 100) + '...'
    previewText.innerHTML = text
    previewContent.appendChild(previewText)

    preview.appendChild(previewContent)

    function validate() {
        requestAnimationFrame(validate)
        if (preview.getBoundingClientRect().width > preview.getBoundingClientRect().height) {
            preview.style.flexDirection = "row"
            previewCoverPhoto.style.aspectRatio = "1/1"
            previewCoverPhoto.style.height = "100%"
            previewCoverPhoto.style.width = "auto"
            previewCoverPhoto.style.borderRadius = "5px"
            previewContent.style.alignSelf = "center"
        } else {
            preview.style.flexDirection = "column"
            previewCoverPhoto.style.aspectRatio = "4/3"
            previewCoverPhoto.style.height = "auto"
            previewCoverPhoto.style.width = "100%"
            previewCoverPhoto.style.borderRadius = "5px 5px 0px 0px"
            previewContent.style.alignSelf = "flex-start"
        }
    }
    validate()

    return preview
}

export function slugify(str: string) {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
}