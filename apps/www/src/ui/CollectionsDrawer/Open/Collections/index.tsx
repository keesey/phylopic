import { FC } from "react"
import useCollectionNames from "~/collections/hooks/useCollectionNames"
const Collections: FC = () => {
    const collectionNames = useCollectionNames()
    return <section>{collectionNames.length}</section>
}
export default Collections
