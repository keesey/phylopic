import { Contributor, Image, Node, TitledLink } from "@phylopic/api-models"
import { gtag } from "@phylopic/ui"
import { EmailAddress, UUIDish } from "@phylopic/utils"
import extractUUIDv4 from "~/routes/extractUUIDv4"
export type LinkType = "button" | "link"
export type FilterMode = "all" | "public_domain" | "no-nc" | "no-nc-sa" | "no-sa"
const getImageOptions = (image: Image) => ({
    contributor_uuid: extractUUIDv4(image._links.contributor.href),
    contributor_name: image._links.contributor.title,
    image_title: image._links.self.title,
    image_uuid: image.uuid,
})
const customEvents = {
    clickLink(id: string, href: string, label: string, type: LinkType) {
        gtag.event("click_link", { id, href, label, type })
    },
    clickContributorLink(id: string, contributor: { _links: { self: TitledLink } }, type: LinkType = "link") {
        gtag.event("click_link", { id, href: contributor._links.self.href, label: contributor._links.self.title, type })
        gtag.event("click_contributor_link", {
            name: contributor._links.self.title,
            uuid: extractUUIDv4(contributor._links.self.href),
        })
    },
    clickImageLink(id: string, image: Image, type: LinkType = "link") {
        gtag.event("click_link", { id, href: image._links.self.href, label: image._links.self.title, type })
        gtag.event("click_image_link", getImageOptions(image))
    },
    clickNodeLink(id: string, node: Node, type: LinkType = "link") {
        gtag.event("click_link", { id, href: node._links.self.href, label: node._links.self.title, type })
        gtag.event("click_node_link", {
            title: node._links.self.title,
            uuid: node.uuid,
        })
    },
    collectImage(image: Image) {
        gtag.event("collect_image", getImageOptions(image))
    },
    createCollection(label: string) {
        gtag.event("create_collection", { label })
    },
    deleteCollection(label: string) {
        gtag.event("delete_collection", { label })
    },
    expandBreadcrumbs() {
        gtag.event("expand_breadcrumbs")
    },
    filterImages(filter_mode: FilterMode) {
        gtag.event("filter_images", { filter_mode })
    },
    flipPocketPhylogeny(index: number, to_side: "front" | "back") {
        gtag.event("flip_pocket_phylogeny", { index, to_side })
    },
    loadContributorListPage(index: number) {
        gtag.event("load_contributor_list_page", { index })
    },
    loadImageListPage(index: number, filter_mode: FilterMode) {
        gtag.event("load_image_list_page", { filter_mode, index })
    },
    loadNodeListPage(index: number) {
        gtag.event("load_node_list_page", { index })
    },
    openCollectionPage(uuid: UUIDish, label: string) {
        gtag.event("create_collection", { label, uuid })
    },
    renameCollection(old_label: string, new_label: string) {
        gtag.event("rename_collection", { new_label, old_label })
    },
    search(query: string) {
        gtag.event("search", { query })
    },
    subscribe(email: EmailAddress) {
        gtag.event("subscribe", { email })
    },
    toggleCollectionDrawer(open: boolean) {
        gtag.event("toggle_collection_drawer", {
            to_mode: open ? "open" : "closed",
        })
    },
    toggleSiteMenu(open: boolean) {
        gtag.event("toggle_site_menu", {
            to_mode: open ? "open" : "closed",
        })
    },
    uncollectImage(image: Image) {
        gtag.event("uncollect_image", getImageOptions(image))
    },
}
export default customEvents
