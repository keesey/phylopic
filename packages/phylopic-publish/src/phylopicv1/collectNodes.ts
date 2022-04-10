import { NomenPart, parseNomen } from "parse-nomen"
import { Entity, Identifier, Node, normalizeNames, UUID } from "phylopic-source-models/src"
import getFromAPI from "./getFromAPI"
import { Name } from "./models/Name"
import { Taxon } from "./models/Taxon"

export type NodeEntityAndReferences = Entity<Node> & {
    readonly externals: ReadonlyArray<{ identifier: Identifier; title: string; uuid: UUID }>
}
export interface NodeData {
    general?: UUID
    specific: UUID
    nodes: readonly NodeEntityAndReferences[]
}
const getNameComparator = (canonicalUID: string) => (a: Name, b: Name) => {
    if (a === b || a.uid === b.uid) {
        return 0
    }
    if (a.uid === canonicalUID) {
        return -1
    }
    if (b.uid === canonicalUID) {
        return 1
    }
    if (a.string.toLowerCase() < b.string.toLowerCase()) {
        return -1
    }
    if (a.string.toLowerCase() > b.string.toLowerCase()) {
        return 1
    }
    if (a.string < b.string) {
        return -1
    }
    if (a.string > b.string) {
        return 1
    }
    return 0
}
const parseName = (s: string) =>
    parseNomen(s).map(part =>
        part.class === "citation"
            ? {
                class: "citation",
                text: part.text?.replace(/,\s+(\d{4})/, " $1").replace("et al.", "& al."),
            }
            : part,
    )
const convertTaxonToNodeEntity = async (
    { canonicalName, names }: Taxon,
    parent: Taxon,
): Promise<NodeEntityAndReferences> => {
    const finalNames = [...names]
        .sort(getNameComparator(canonicalName.uid))
        .map(name =>
            name.type === "vernacular"
                ? [{ class: "vernacular", text: name.string } as NomenPart]
                : parseName(name.string),
        )
        .map(name => JSON.stringify(name).replace(/^\[/, "").replace(/]$/, ""))
        .filter(
            (w, i, array) =>
                i === 0 || i === array.length - 1 || (!array[i + 1].startsWith(w) && !array[0].startsWith(w)),
        )
        .map(w => JSON.parse(`[${w}]`) as readonly NomenPart[])
    return {
        uuid: canonicalName.uid,
        externals: [
            ...names
                .filter(name => name.namebankID)
                .map(name => ({
                    identifier: ["ubio.org", "namebank", name.namebankID as string] as Identifier,
                    title: name.string,
                    uuid: canonicalName.uid,
                })),
            ...names
                .filter(name => name.uid !== canonicalName.uid)
                .map(name => ({
                    identifier: ["phylopic.org", "nodes", name.uid] as Identifier,
                    title: name.string,
                    uuid: name.uid,
                })),
        ],
        value: {
            created: "2011-01-01T00:00:00.000Z",
            names: normalizeNames(finalNames),
            parent: parent?.canonicalName.uid,
        },
    }
}
const findGeneralNode = (minimalSupertaxa: ReadonlyArray<Taxon>, directNameUIDs: ReadonlyArray<string>) => {
    if (minimalSupertaxa.length === 0) {
        return null
    }
    if (minimalSupertaxa.length === 1) {
        return minimalSupertaxa[0]
    }
    const match = minimalSupertaxa.find(taxon => taxon.names.some(name => directNameUIDs.indexOf(name.uid) >= 0))
    if (match) {
        return match
    }
    throw new Error("Cannot determine general node.")
}
const getLineage: (inclusions: ReadonlyArray<Readonly<[number, number]>>, tailIndex: number) => readonly number[] = (
    inclusions,
    tailIndex,
) => {
    const arcs = inclusions
        .filter(arc => arc[1] === tailIndex)
        // Arbitrarily favor taxon with lower index. Can be fixed up later if need be.
        .sort((a, b) => a[0] - b[0])
    if (!arcs.length) {
        return [tailIndex]
    }
    if (arcs.length !== 1) {
        throw new Error("Cannot determine lineage.")
    }
    return [...getLineage(inclusions, arcs[0][0]), tailIndex]
}
const inLineage = (taxon: Taxon | null, lineage: ReadonlyArray<Taxon>) =>
    taxon ? lineage.some(ltaxon => ltaxon.canonicalName.uid === taxon.canonicalName.uid) : true
const collectNodes = async (
    names: ReadonlyArray<{ uid: string }>,
    getExistingUUIDs: (uuids: readonly string[]) => Promise<readonly string[]>,
    skipNodes?: boolean,
): Promise<NodeData> => {
    const nameUIDs = names.map(({ uid }) => uid)
    console.info(`Finding nodes for names with UUIDs: "${nameUIDs.join('", "')}".`)
    const lineagePromises = nameUIDs.map(async uid => {
        const { inclusions, taxa } = await getFromAPI<{
            readonly inclusions: readonly Readonly<[number, number]>[]
            readonly taxa: readonly Taxon[]
        }>(`/name/${uid}/taxonomy?supertaxa=all&options=canonicalName+names+namebankID+string+type`)
        // Check for taxa with missing names.
        taxa.forEach((taxon, index) => {
            if (!taxon.canonicalName) {
                if (!taxon.names?.length) {
                    const predecessors = inclusions
                        .filter(([_, tail]) => tail === index)
                        .map(([head]) => taxa[head])
                        .filter(t => t.canonicalName)
                        .map(t => `http://phylopic.org/name/${t.canonicalName.uid}`)
                    const successors = inclusions
                        .filter(([head]) => head === index)
                        .map(([_, tail]) => taxa[tail])
                        .filter(t => t.canonicalName)
                        .map(t => `http://phylopic.org/name/${t.canonicalName.uid}`)
                    throw new Error(
                        `Taxon has no names whatsoever!\nPredecessors: ${predecessors.length ? predecessors.join("\n\t") : "<none>"
                        }\nSuccessors:${successors.length ? successors.join("\n\t") : "<none>"}\n`,
                    )
                }
                throw new Error(
                    `Taxon does not have a canonical name! See: http://phylopic.org/name/${taxon.names[0].uid}`,
                )
            }
        })
        const nameIndex = taxa.findIndex(taxon => taxon.names.some(name => uid === name.uid))
        const indexLineage = getLineage(inclusions, nameIndex)
        const taxonLineage = indexLineage.map(index => {
            const taxon = taxa[index]
            if (!taxon) {
                throw new Error(`Invalid taxon index: ${index}.`)
            }
            return taxon
        })
        if (!skipNodes) {
            console.info("LINEAGE:", taxonLineage.map(taxon => taxon.canonicalName.string).join(" > "))
        }
        return taxonLineage
    })
    const minimalSupertaxaPromise: Promise<ReadonlyArray<Taxon>> = getFromAPI(
        `/name/minSupertaxa/?nameUIDs=${nameUIDs.join("+")}&options=canonicalName+names+namebankID+string+type`,
    )
    const [lineages, minimalSupertaxa] = await Promise.all([Promise.all(lineagePromises), minimalSupertaxaPromise])
    // Sort from longest to shortest.
    lineages.sort((a, b) => b.length - a.length)
    // Specific node is the last one in the longest lineage.
    const mainLineage = lineages[0]
    const specific = mainLineage[mainLineage.length - 1]
    // Find the general node.
    const general = findGeneralNode(minimalSupertaxa, nameUIDs)
    if (!inLineage(general, mainLineage)) {
        throw new Error(
            `Intractable problem for taxon with complex lineage. See: http://phylopic.org/name/${specific.canonicalName.uid}/lineage`,
        )
    }
    console.info(
        general
            ? `General node: ${general.canonicalName.string} (http://phylopic.org/name/${general.canonicalName.uid}).`
            : "No general node.",
    )
    console.info(
        `Specific node: ${specific.canonicalName.string} (http://phylopic.org/name/${specific.canonicalName.uid}).`,
    )
    const existingUUIDs = skipNodes ? [] : await getExistingUUIDs(mainLineage.map(name => name.canonicalName.uid))
    const taxaForNodes = skipNodes
        ? []
        : mainLineage
            .map((taxon, index) => ({
                ...taxon,
                parent: mainLineage[index - 1],
            }))
            .filter(taxon => existingUUIDs.indexOf(taxon.canonicalName.uid) < 0)
    if (!skipNodes) {
        console.info("Nodes:", taxaForNodes.map(taxon => taxon.canonicalName.string).join(", "))
    }
    return {
        ...(general && general.canonicalName.uid !== specific.canonicalName.uid
            ? { general: general.canonicalName.uid }
            : null),
        nodes: skipNodes
            ? []
            : await Promise.all(taxaForNodes.map(taxon => convertTaxonToNodeEntity(taxon, taxon.parent))),
        specific: specific.canonicalName.uid,
    }
}
export default collectNodes
