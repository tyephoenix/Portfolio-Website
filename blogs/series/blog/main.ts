import { setup } from "./blog"

var { SERIES, TITLE } = {
    SERIES: new URLSearchParams(window.location.search).get("series") ?? undefined,
    TITLE: new URLSearchParams(window.location.search).get("title") ?? undefined
}

setup(SERIES, TITLE)