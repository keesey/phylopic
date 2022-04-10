import { Locator } from "../phylopicv2/getExistingImages"
import getFromAPI from "./getFromAPI"
import { Image } from "./models/Image"

const search = async (
    getExisting: (images: readonly Image[], locators: readonly Locator[]) => Promise<readonly Image[]>,
    count: number,
    start: number,
    length: number,
    locators: readonly Locator[],
    sessionID: string,
): Promise<Image | null> => {
    const list = await getFromAPI<readonly Image[]>(
        `/image/list/${start}/${length}?options=submitter+email+firstName+lastName`,
        sessionID,
    )
    const existing = await getExisting(list, locators)
    const existingUUIDs = new Set(existing.map(image => image.uid))
    const next = list.find(({ uid }) => !existingUUIDs.has(uid))
    if (next) {
        return next
    }
    if (start + list.length >= count) {
        return null
    }
    return search(getExisting, count, start + length, length, locators, sessionID)
}
export const findNextImage = async (
    getExisting: (images: readonly Image[], locators: readonly Locator[]) => Promise<readonly Image[]>,
    loadSize = 100,
    locators: readonly Locator[],
    sessionID: string,
) => {
    const count: number = await getFromAPI("/image/count")
    const image = await search(getExisting, count, 0, loadSize, locators, sessionID)
    if (!image) {
        return null
    }
    return getFromAPI<Image>(
        `/image/${image.uid}?options=credit+directNames+licenseURL+pngFiles+submitted+submitter+svgFile+email+firstName+lastName`,
        sessionID,
    )
}
export default findNextImage
