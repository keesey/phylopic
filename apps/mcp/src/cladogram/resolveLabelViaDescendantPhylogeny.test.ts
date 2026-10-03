import { describe, expect, it } from "vitest"
import { isExactNodeTitleMatch } from "../search/phylopicNameMatch.js"
import type { LineageEntry } from "./fetchLineageUuids.js"

const mostLeafwardTitleMatch = (lineage: readonly LineageEntry[], label: string): string | null => {
    for (const entry of lineage) {
        if (entry.uuid && isExactNodeTitleMatch(entry.title, label)) {
            return entry.uuid
        }
    }
    return null
}

describe("lineage disambiguation (Thyreophora pattern)", () => {
    it("picks most leafward title match on MRCA lineage", () => {
        const lineage: LineageEntry[] = [
            { uuid: "4cb66807-1a4e-43c0-96da-eee6ac0637d7", title: "Eurypoda" },
            { uuid: "3bb8f314-6bd9-4449-8fda-ece09603c1e5", title: "Thyreophora" },
            { uuid: "wrong", title: "Dinosauria" },
        ]
        expect(mostLeafwardTitleMatch(lineage, "Thyreophora")).toBe("3bb8f314-6bd9-4449-8fda-ece09603c1e5")
        expect(mostLeafwardTitleMatch(lineage, "Eurypoda")).toBe("4cb66807-1a4e-43c0-96da-eee6ac0637d7")
    })
})
