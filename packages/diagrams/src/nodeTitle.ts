export const nodeTitle = (item: { title?: string; _links?: { self?: { title?: string } } }) =>
    item.title ?? item._links?.self?.title
