export const generate = async <TContent = unknown>(code: string) => {
    const generator = await import(`~/games/${code}/generate`).then(mod => mod.default as () => Promise<TContent>)
    return await generator()
}
