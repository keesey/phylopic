import { Nomen } from "@phylopic/utils"
import { useMemo } from "react"
const EMPTY: Nomen = []
export const useNomenText = (name: Nomen = EMPTY, short = false, defaultText = "") => {
    const text = useMemo(
        () =>
            (short
                ? name.filter(
                      (part, index, array) =>
                          part.class === "scientific" ||
                          part.class === "vernacular" ||
                          part.class === "operator" ||
                          (part.class === "rank" && index < array.length - 1),
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
