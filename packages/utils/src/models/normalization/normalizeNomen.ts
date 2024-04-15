import { NOMEN_PART_CLASSES, NomenPart } from "parse-nomen"
import { normalizeText } from "../../normalization/normalizeText"
import { Nomen } from "../types/Nomen"
const purify = (part: NomenPart) => {
    if (part.class === "citation") {
        return {
            ...part,
            text: part.text.replace(/, (\d{4})/g, " $1").replace(/\bet al\./, "& al."),
        }
    }
    return part
}
export const normalizeNomen = (nomen: Nomen) =>
    nomen
        .map(part => ({
            class: NOMEN_PART_CLASSES.includes(part.class) ? part.class : "vernacular",
            text: normalizeText(part.text),
        }))
        .filter(part => part.text)
        .reduce<Nomen>((prev, name, index, array) => {
            if (index > 0 && array[index - 1].class === name.class) {
                return [
                    ...prev.slice(0, prev.length - 1),
                    {
                        class: name.class,
                        text: `${array[index - 1].text} ${name.text}`,
                    },
                ]
            }
            return [...prev, name]
        }, [])
        .map(part => purify(part))
