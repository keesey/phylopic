import { parseNomen } from "parse-nomen"
import { EmailAddress } from "phylopic-api-models/src"
import {
    Entity,
    Identifier,
    Image,
    isEmailAddress,
    isUUID,
    Name,
    Node,
    normalizeUUID,
    UUID,
} from "phylopic-source-models/src"
import { v4, version } from "uuid"
import nameMatches from "./commands/utils/nameMatches"
import { ClientData } from "./getClientData"
export default class LineReader {
    private index = 0
    private readonly parts: readonly string[]
    constructor(private clientData: ClientData, line: string) {
        this.parts = line
            .trim()
            .split(/"/g)
            .reduce<string[]>((prev, current, index) => {
                if (index % 2 === 0) {
                    return [...prev, ...current.trim().split(/\s+/g)]
                }
                return [...prev, `"${current.trim().replaceAll(/\s+/g, " ")}"`]
            }, [])
            .filter(Boolean)
    }
    protected findEntriesByPartialUUID<T>(
        dict: ReadonlyMap<UUID, T>,
        uuidPartial: string,
    ): ReadonlyArray<Readonly<[UUID, T]>> {
        return [...dict.entries()].filter(([key]) => key.startsWith(uuidPartial))
    }
    protected findEntityByPartialUUID(uuidPartial: string): Entity<Image | Node> | undefined {
        const imageEntries = this.findEntriesByPartialUUID(this.clientData.images, uuidPartial)
        const nodeEntries = this.findEntriesByPartialUUID(this.clientData.nodes, uuidPartial)
        // :TOOD: Look through externals?
        const entries = [...imageEntries, ...nodeEntries]
        if (entries.length > 1) {
            throw new Error(`Partial UUID is ambiguous: ${JSON.stringify(uuidPartial)}`)
        }
        if (entries.length === 1) {
            const valueOrCanonicalUUID = entries[0][1]
            const uuid = typeof valueOrCanonicalUUID === "string" ? valueOrCanonicalUUID : entries[0][0]
            const value =
                typeof valueOrCanonicalUUID === "string"
                    ? this.clientData.nodes.get(valueOrCanonicalUUID)
                    : valueOrCanonicalUUID
            if (!value) {
                throw new Error("Invalid synonym.")
            }
            return { uuid, value }
        }
    }
    protected findNodeByPartialUUID(uuidPartial: string): Entity<Node> | undefined {
        const entries = this.findEntriesByPartialUUID(this.clientData.nodes, uuidPartial)
        // :TOOD: Look through externals?
        if (entries.length > 1) {
            throw new Error(`Partial UUID is ambiguous: ${JSON.stringify(uuidPartial)}`)
        }
        if (entries.length === 1) {
            const uuid = entries[0][0]
            const valueOrCanonicalUUID = entries[0][1]
            const value =
                typeof valueOrCanonicalUUID === "string"
                    ? this.clientData.nodes.get(valueOrCanonicalUUID)
                    : valueOrCanonicalUUID
            if (!value) {
                throw new Error("Invalid synonym.")
            }
            return { uuid, value }
        }
    }
    protected findNodeByExternal(identifier: string): Entity<Node> | undefined {
        const link = this.clientData.externals.get(identifier)
        if (!link) {
            return undefined
        }
        const uuid = link.uuid
        const value = this.clientData.nodes.get(uuid)
        if (!value) {
            return undefined
        }
        return { uuid, value }
    }
    protected findNodeByName(name: string): Entity<Node> | undefined {
        const matches = [...this.clientData.nodes.entries()].filter(([, node]) =>
            node.names.some(n => nameMatches(name, n)),
        )
        if (matches.length > 1) {
            throw new Error(`Ambiguous name: ${JSON.stringify(name)}.`)
        }
        if (matches.length === 1) {
            return { uuid: matches[0][0], value: matches[0][1] }
        }
    }
    protected findRoot(): Entity<Node> {
        const uuid = this.clientData.main.root
        const root = this.clientData.nodes.get(uuid)
        if (!root) {
            throw new Error("Cannot find root node!")
        }
        return { uuid, value: root }
    }
    public get atEnd() {
        return this.index >= this.parts.length
    }
    public expectEnd() {
        if (!this.atEnd) {
            throw new Error(`Unexpected extra content in line: ${this.parts.slice(this.index).join(" ")}`)
        }
    }
    public read(): string | undefined {
        if (!this.atEnd) {
            return this.parts[this.index++]
        }
    }
    public readEmailAddress(): EmailAddress {
        const value = this.read()
        if (!value) {
            throw new Error("Expected email address.")
        }
        if (!isEmailAddress(value)) {
            throw new Error(`Invalid email address: <${value}>.`)
        }
        return value
    }
    public readEntity(): Entity<Image | Node> {
        const value = this.read()
        if (!value) {
            throw new Error("Expected entity.")
        }
        const entity =
            value === "root"
                ? this.findRoot()
                : /^[^/]+\/[^/]+\/[^/]+$/.test(value)
                ? this.findNodeByExternal(value)
                : /^"[^"]+"$/.test(value)
                ? this.findNodeByName(value.slice(1, value.length - 1))
                : this.findEntityByPartialUUID(value?.toLowerCase())
        if (!entity) {
            throw new Error(`Cannot find entity: ${value}`)
        }
        return entity
    }
    public readIdentifier(): Identifier {
        const value = this.read()
        if (!value || !/^[^/]+\/[^/]+\/[^/]+$/.test(value)) {
            throw new Error("Expected identifier.")
        }
        const [authority, namespace, objectID] = value.split(/\//g, 3).map(decodeURIComponent)
        return [authority, namespace, objectID] as Identifier
    }
    public readImage(): Entity<Image> {
        const uuidPartial = this.read()?.toLowerCase()
        if (!uuidPartial) {
            throw new Error("Expected image.")
        }
        const entries = this.findEntriesByPartialUUID(this.clientData.images, uuidPartial)
        if (entries.length > 1) {
            throw new Error(`Partial UUID is ambiguous: ${JSON.stringify(uuidPartial)}`)
        }
        if (entries.length === 1) {
            return { uuid: entries[0][0], value: entries[0][1] }
        }
        throw new Error(`Cannot find image: ${uuidPartial}`)
    }
    public readName(): Name {
        const value = this.read()
        if (value && /^"[^"]+"$/.test(value)) {
            return parseNomen(value.slice(1, value.length - 1))
        }
        throw new Error("Expected name.")
    }
    public readNode(): Entity<Node> {
        const value = this.read()
        if (!value) {
            throw new Error("Expected node.")
        }
        const node =
            value === "root"
                ? this.findRoot()
                : /^"[^"]+"$/.test(value)
                ? this.findNodeByName(value.slice(1, value.length - 1))
                : this.findNodeByPartialUUID(value?.toLowerCase())
        if (!node) {
            throw new Error(`Cannot find node: ${value}`)
        }
        return node
    }
    public readPattern<T extends string = string>(pattern: RegExp, label: string): T {
        const value = this.read()?.toLowerCase()
        if (typeof value === "string" && pattern.test(value)) {
            return value as T
        }
        throw new Error(`Expected ${label}.`)
    }
    public readText(): string | undefined {
        if (!this.atEnd) {
            return this.parts[this.index++]?.replace(/^"/, "").replace(/"$/, "") ?? ""
        }
    }
    public readUUID4(): UUID {
        const value = this.read()?.toLowerCase()
        if (value === "new") {
            const newUUID = normalizeUUID(v4())
            console.info(`Generated UUID v4: ${JSON.stringify(newUUID)}`)
            return newUUID
        }
        if (isUUID(value)) {
            if (version(value) !== 4) {
                throw new Error(`Wrong UUID version (expected 4, found ${version(value)}).`)
            }
            return value
        }
        throw new Error("Expected UUID v4.")
    }
}
