import { NodeName } from "@phylopic/api-models"
import { useMemo } from "react"
const EMPTY: NodeName = []
const useNameText = (name: NodeName = EMPTY, short = false, defaultText = "") => {
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
export default useNameText
