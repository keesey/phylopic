import { useMemo } from "react"
import { PermalinkData } from "../types/PermalinkData"
const usePermalinkSubheader = (data: PermalinkData) =>
    useMemo(() => {
        switch (data.type) {
            case "collection": {
                const hasContributors = data.entities.contributors.length > 0
                const hasImages = data.entities.images.length > 0
                const hasNodes = data.entities.nodes.length > 0
                if (!hasContributors && !hasImages && !hasNodes) {
                    return "Empty Collection"
                }
                if (hasContributors && !hasImages && !hasNodes) {
                    return "Contributor Collection"
                }
                if (hasImages && !hasContributors && !hasNodes) {
                    return "Image Collection"
                }
                if (hasNodes && !hasContributors && !hasImages) {
                    return "Node Collection"
                }
                return "Collection"
            }
            default: {
                return null
            }
        }
    }, [data])
export default usePermalinkSubheader
