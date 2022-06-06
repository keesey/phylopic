import { useCallback, useEffect, useMemo, useState } from "react"
const useStoredState = <T>(key: string): Readonly<[T | undefined, (value: T | undefined) => void]> => {
    const [json, setJSON] = useState<string | undefined>()
    const value = useMemo<T | undefined>(() => (json === undefined ? undefined : JSON.parse(json)), [json])
    const setValue = useCallback(
        (newValue: T | undefined) => setJSON(newValue === undefined ? undefined : JSON.stringify(newValue)),
        [],
    )
    useEffect(() => setJSON(localStorage.getItem(key) ?? undefined), [key])
    useEffect(() => {
        if (json === undefined) {
            localStorage.removeItem(key)
        } else {
            localStorage.setItem(key, json)
        }
    }, [json, key])
    return useMemo(() => [value, setValue], [setValue, value])
}
export default useStoredState
