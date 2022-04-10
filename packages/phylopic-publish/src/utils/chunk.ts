const chunk = <T>(values: Iterable<T>, chunkSize: number): ReadonlyArray<ReadonlyArray<T>> => {
    const chunks: T[][] = []
    const array = [...values]
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize))
    }
    return chunks
}
export default chunk
