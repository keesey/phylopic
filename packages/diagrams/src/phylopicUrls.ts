export const phylopicImagePageUrl = (wwwOrigin: string, imageUuid: string) =>
    `${wwwOrigin.replace(/\/$/, "")}/images/${imageUuid}`

export const phylopicNodePageUrl = (wwwOrigin: string, nodeUuid: string) =>
    `${wwwOrigin.replace(/\/$/, "")}/nodes/${nodeUuid}`

export const phylopicCollectionPageUrl = (wwwOrigin: string, collectionUuid: string) =>
    `${wwwOrigin.replace(/\/$/, "")}/collections/${collectionUuid}`
