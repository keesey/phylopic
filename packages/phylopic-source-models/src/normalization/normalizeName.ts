import { NOMEN_PART_CLASSES } from "parse-nomen"
import { Name } from "../models/Name"
import { normalizeText } from "./normalizeText"

export const normalizeName = (name: Name) =>
    name
        .map(name => ({
            class: NOMEN_PART_CLASSES.includes(name.class) ? name.class : "vernacular",
            text: normalizeText(name.text),
        }))
        .filter(name => name.text)
        .reduce<Name>((prev, name, index, array) => {
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
