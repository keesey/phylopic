import { rgbDataURL } from "@phylopic/ui"
import clsx from "clsx"
import Image from "next/image"
import { FC, useState } from "react"
import customEvents from "~/analytics/customEvents"
import styles from "./index.module.scss"
export type Props = {
    index: 1 | 2 | 3 | 4 | 5
}
const ALT: Record<Props["index"], string> = {
    1: "If we evolved from apes, why are there still apes?",
    2: "How can birds be a type of dinosaur?",
    3: "Are mushrooms plants?",
    4: "How can all life on Earth be related?",
    5: "Wait … spiders aren\u2019t insects?",
}
const ALT_BACK: Record<Props["index"], string> = {
    1: "Diagram showing that humans and living great ape species all evolved from earlier apes.",
    2: "Diagram showing how birds are deeply nested within the dinosaur family tree.",
    3: "Diagram showing that fungi (including mushrooms) are, in fact, more closely related to animals (Metazoa) than to plants (Archaeplastida).",
    4: "Diagram showing the interrelationships of bacteria, archaea, and eukaryotes, and how they all ultimately descend from the same ancestors.",
    5: "Diagram showing that, while insects and spiders are both arthropods, spiders are arachnids, while insects are crustaceans.",
}
const Card: FC<Props> = ({ index }) => {
    const [flipped, setFlipped] = useState(false)
    const handleClick = () => {
        customEvents.flipPocketPhylogeny(index, flipped ? "back" : "front")
        setFlipped(!flipped)
    }
    return (
        <div className={styles.main} onClick={handleClick}>
            <div className={clsx(styles.side, styles.front, flipped ? styles.hidden : styles.showing)}>
                <Image
                    alt={ALT[index]}
                    blurDataURL={rgbDataURL(0x12, 0xab, 0xa6)}
                    height={350}
                    sizes="200px"
                    src={`/materials/pocketphylogenies/pp-${index}-front-x3.png`}
                    width={200}
                />
            </div>
            <div className={clsx(styles.side, styles.back, flipped ? styles.showing : styles.hidden)}>
                <Image
                    alt={ALT_BACK[index]}
                    blurDataURL={rgbDataURL(0xff, 0xff, 0xfe)}
                    height={350}
                    sizes="200px"
                    src={`/materials/pocketphylogenies/pp-${index}-back-x3.png`}
                    width={200}
                />
            </div>
        </div>
    )
}
export default Card
