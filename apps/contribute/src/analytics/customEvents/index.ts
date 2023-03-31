import { gtag } from "@phylopic/ui"
export type LinkType = "button" | "link"
export type FilterMode = "all" | "public_domain" | "no-nc" | "no-nc-sa" | "no-sa"
const customEvents = {
    clickLink(id: string, href: string, label: string, type: LinkType) {
        gtag.event("click_link", { id, href, label, type })
    },
    search(query: string) {
        gtag.event("search", { query })
    },
}
export default customEvents
