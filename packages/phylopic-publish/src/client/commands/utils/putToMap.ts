const putToMap = <K, V>(map: ReadonlyMap<K, V>, key: K, value: V): ReadonlyMap<K, V> => {
    const result = new Map(map.entries())
    result.set(key, value)
    return result
}
export default putToMap
