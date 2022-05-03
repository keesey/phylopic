export const createQueryString = (params: Readonly<Record<string, string | number | boolean | undefined>>) => {
    return Object.keys(params)
        .filter(key => params[key] !== undefined)
        .sort()
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(String(params[key]))}`)
        .join("&")
}
export default createQueryString
