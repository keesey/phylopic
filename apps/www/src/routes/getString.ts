const getString = (value: string | string[] | undefined) => {
    if (typeof value === "string") {
        return value
    }
    if (value === undefined) {
        return ""
    }
    return value[0]
}
export default getString