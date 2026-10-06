import { isPublicDomainLicenseURL } from "@phylopic/utils"

export const imageSetAttributionRequired = (images: readonly { _links: { license: { href: string } } }[]) =>
    images.some(image => !isPublicDomainLicenseURL(image._links.license.href))
