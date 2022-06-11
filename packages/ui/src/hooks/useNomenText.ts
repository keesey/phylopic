import { Nomen } from "@phylopic/utils"
import { useMemo } from "react"
const EMPTY: Nomen = []
export const useNomenText = (name: Nomen = EMPTY, short = false, defaultText = "") => {
    const text = useMemo(
        () =>
            (short
                ? name.filter(
                      part => part.class === "scientific" || part.class === "vernacular" || part.class === "operator",
                  )
                : name
            )
                .map(({ text }) => text)
                .join(" "),
        [name, short],
    )
    return text || defaultText
}
export default useNomenText
