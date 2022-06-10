import { useCallback, useEffect, useMemo, useState } from "react"
const useStoredState = <T>(key: string): Readonly<[T | null, (value: T | null) => void]> => {
    const [json, setJSON] = useState<string | null | undefined>(undefined)
    const value = useMemo<T | null>(() => (json ? JSON.parse(json) : null), [json])
    const setValue = useCallback((newValue: T | null) => setJSON(newValue ? JSON.stringify(newValue) : null), [])
    useEffect(() => {
        const stored = localStorage.getItem(key)
        if (stored) {
            setJSON(stored)
        }
    }, [key])
    useEffect(() => {
        if (json === null) {
            localStorage.removeItem(key)
        } else if (typeof json === "string") {
            localStorage.setItem(key, json)
        }
    }, [json, key])
    return useMemo(() => [value, setValue], [setValue, value])
}
export default useStoredState
