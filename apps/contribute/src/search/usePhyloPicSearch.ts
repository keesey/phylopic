import usePhyloPicResults from "./usePhyloPicResults"
const EMPTY: readonly never[] = []
const usePhyloPicSearch = (text: string) => {
    const phyloPic = usePhyloPicResults(text)
    const phyloPicEntries = phyloPic.data ?? EMPTY
    return {
        data: phyloPicEntries,
        error: phyloPic.error,
        pending: !phyloPic.data && !phyloPic.error,
    }
}
export default usePhyloPicSearch
