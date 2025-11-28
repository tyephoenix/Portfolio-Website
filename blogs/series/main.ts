import { setup } from "./series"

var SERIES: string | undefined = new URLSearchParams(window.location.search).get("series") ?? undefined

setup(SERIES)
