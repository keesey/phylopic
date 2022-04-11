export const createQueryString = (
    params: Record<string, string | number | boolean | undefined>,
    encoder?: (s: string) => string,
) => {
    const encode = encoder ?? encodeURIComponent
    return Object.keys(params)
        .filter(key => params[key] !== undefined)
        .sort()
        .map(key => `${encode(key)}=${encode(String(params[key]))}`)
        .join("&")
}
export default createQueryString
