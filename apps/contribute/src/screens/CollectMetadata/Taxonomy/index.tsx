import { FC, useCallback, useMemo, useState } from "react"
import Form from "./Form"
import styles from "./index.module.scss"
import Results from "./Results"
import { TaxonomyResult } from "./TaxonomyResult"
interface Props {
    onComplete?: (result: TaxonomyResult) => void
    suggestion?: Partial<TaxonomyResult>
}
const Taxonomy: FC<Props> = ({ onComplete, suggestion }) => {
    const suggestionText = useMemo(
        () => suggestion?.specific?.name.map(({ text }) => text).join(" ") ?? "",
        [suggestion],
    )
    const [searchTerm, setSearchTerm] = useState("")
    const handleFormComplete = useCallback((text: string) => {
        setSearchTerm(text)
    }, [])
    const handleResultsCancel = useCallback(() => {
        setSearchTerm("")
    }, [])
    return (
        <section id="taxonomy" className={styles.main}>
            <p>
                <strong>Nice!</strong> What is it?
            </p>
            <p>(Please be as specific as possible.)</p>
            <Form onComplete={handleFormComplete} suggestion={suggestionText} />
            <br />
            <Results searchTerm={searchTerm} onCancel={handleResultsCancel} onComplete={onComplete} />
        </section>
    )
}
export default Taxonomy
