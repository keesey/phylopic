const deleteFromMap = <K, V>(map: ReadonlyMap<K, V>, key: K): ReadonlyMap<K, V> => {
    const result = new Map(map.entries())
    result.delete(key)
    return result
}
export default deleteFromMap
