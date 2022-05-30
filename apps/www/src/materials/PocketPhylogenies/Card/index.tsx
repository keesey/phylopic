import clsx from "clsx"
import { FC, useCallback, useState } from "react"
import styles from "./index.module.scss"
import Image from "next/image"
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
const Card: FC<Props> = ({ index }) => {
    const [flipped, setFlipped] = useState(false)
    const handleClick = useCallback(() => setFlipped(!flipped), [flipped])
    return (
        <div className={styles.main} onClick={handleClick}>
            <div className={clsx(styles.side, styles.front, flipped ? styles.hidden : styles.showing)}>
                <Image
                    alt={ALT[index]}
                    layout="fixed"
                    width={200}
                    height={350}
                    src={`/materials/pocketphylogenies/pp-${index}-front-x3.png`}
                />
            </div>
            <div className={clsx(styles.side, styles.back, flipped ? styles.showing : styles.hidden)}>
                <Image
                    alt="Diagram revealing answer."
                    layout="fixed"
                    width={200}
                    height={350}
                    src={`/materials/pocketphylogenies/pp-${index}-back-x3.png`}
                />
            </div>
        </div>
    )
}
export default Card
