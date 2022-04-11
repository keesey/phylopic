export const getJSONKey = (path: string) => `${path.replace(/^\//, "")}/meta.${process.env.PHYLOPIC_BUILD}.json`
export default getJSONKey
