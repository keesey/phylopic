import { Image, Node, TitledLink } from "@phylopic/api-models"
import { gtag } from "@phylopic/ui"
import { EmailAddress, Hash, UUIDish } from "@phylopic/utils"
import { LicenseFilterType } from "~/models/LicenseFilterType"
import extractUUIDv4 from "~/routes/extractUUIDv4"
import getHRefFromAPILink from "~/routes/getHRefFromAPILink"
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
    clickBreadcrumb(href: string | undefined, index: number) {
        gtag.event("click_breadcrumb", { href, index })
    },
    clickContributorLink(
        id: string,
        contributor: { _links: { self: TitledLink } },
        label?: string,
        type: LinkType = "link",
    ) {
        gtag.event("click_link", {
            id,
            href: getHRefFromAPILink(contributor._links.self),
            label: label ?? contributor._links.self.title,
            type,
        })
        gtag.event("click_contributor_link", {
            name: contributor._links.self.title,
            uuid: extractUUIDv4(contributor._links.self.href),
        })
    },
    clickDonatePromoLink(id: string, href: string, label: string, variant: string) {
        gtag.event("click_donate_promo_link", {
            id,
            href,
            label,
            variant,
        })
        gtag.event("click_link", { id, href, label, type: "link" })
    },
    clickImageLink(id: string, image: Image, label?: string, type: LinkType = "link") {
        gtag.event("click_link", {
            id,
            href: getHRefFromAPILink(image._links.self),
            label: label ?? image._links.self.title,
            type,
        })
        gtag.event("click_image_link", getImageOptions(image))
    },
    clickNodeLink(id: string, node: Node, label?: string, type: LinkType = "link", suppressLink = false) {
        if (!suppressLink) {
            gtag.event("click_link", {
                id,
                href: getHRefFromAPILink(node._links.self),
                label: label ?? node._links.self.title,
                type,
            })
        }
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
    dismissContributorBanner() {
        gtag.event("dismiss_contributor_banner", {})
    },
    dragImage(id: string, image: Image) {
        gtag.event("drag_image", {
            id,
            ...getImageOptions(image),
        })
    },
    dropImage(label: string, image: Image) {
        gtag.event("drop_image", { label, ...getImageOptions(image) })
    },
    exception(description: string, fatal = false) {
        gtag.event("exception", { description, fatal })
    },
    expandBreadcrumbs() {
        gtag.event("expand_breadcrumbs")
    },
    filterImages(filter_type: LicenseFilterType) {
        gtag.event("filter_images", { filter_type: filter_type ?? "all" })
    },
    flipPocketPhylogeny(index: number, to_side: "front" | "back") {
        gtag.event("flip_pocket_phylogeny", { index, to_side })
    },
    loadContributorListPage(id: string, index: number) {
        gtag.event("load_contributor_list_page", { id, index })
    },
    loadImageListPage(id: string, index: number, filter_type: LicenseFilterType = undefined) {
        gtag.event("load_image_list_page", { filter_type: filter_type ?? "all", id, index })
    },
    loadNodeListPage(id: string, index: number) {
        gtag.event("load_node_list_page", { id, index })
    },
    navigateToPermalink(hash: Hash) {
        gtag.event("navigate_to_permalink", { hash })
    },
    openCollectionPage(uuid: UUIDish, label: string) {
        gtag.event("open_collection", { label, uuid })
    },
    removeFromCollection(label: string, image: Image) {
        gtag.event("remove_from_collection", {
            label,
            ...getImageOptions(image),
        })
    },
    renameCollection(old_label: string, new_label: string) {
        gtag.event("rename_collection", { new_label, old_label })
    },
    requestPermalink(collection_uuid: UUIDish) {
        gtag.event("request_permalink", { collection_uuid })
    },
    search(query: string) {
        gtag.event("search", { query })
    },
    searchDirect(query: string, node: Node) {
        gtag.event("search_direct", {
            node_title: node._links.self.title,
            node_uuid: node.uuid,

            query,
        })
    },
    selectCollection(name: string) {
        gtag.event("select_collection", { name })
    },
    submitForm(id: string) {
        gtag.event("submit_form", { id })
    },
    subscribe(email: EmailAddress) {
        gtag.event("subscribe", { email })
    },
    toggleCollectionDrawer(open: boolean) {
        gtag.event("toggle_collection_drawer", {
            to_mode: open ? "open" : "closed",
        })
    },
    toggleNodeDetails(open: boolean, node: Node) {
        gtag.event("toggle_node_details", {
            node_title: node._links.self.title,
            node_uuid: node.uuid,
            to_mode: open ? "open" : "closed",
        })
    },
    toggleSearch(open: boolean) {
        gtag.event("toggle_search", {
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
