export const createQueryString = (
    params: Record<string, string | number | boolean | undefined>,
    encode: (s: string) => string = encodeURIComponent,
) => {
    return Object.keys(params)
        .filter(key => params[key] !== undefined)
        .sort()
        .map(key => `${encode(key)}=${encode(String(params[key]))}`)
        .join("&")
}
export default createQueryString
