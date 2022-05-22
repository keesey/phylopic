import { S3Client } from "@aws-sdk/client-s3"
import { Nomen } from "@phylopic/utils"
import approve from "./commands/approve.js"
import autolink from "./commands/autolink.js"
import { CommandResult } from "./commands/CommandResult.js"
import deleteEntity from "./commands/deleteEntity.js"
import identify from "./commands/identify.js"
import link from "./commands/link.js"
import source from "./commands/source.js"
import merge from "./commands/merge.js"
import search from "./commands/search.js"
import show from "./commands/show.js"
import spawn from "./commands/spawn.js"
import split from "./commands/split.js"
import succeed from "./commands/succeed.js"
import unlink from "./commands/unlink.js"
import { CLIData } from "./getCLIData.js"
import LineReader from "./LineReader.js"
export const QUIT = Symbol()
export type Args = {
    s3Client: S3Client
}
type Command = {
    description: string
    execute(cliData: CLIData, reader: LineReader, args: Args): () => CommandResult | Promise<CommandResult>
    usage: string
}
const COMMANDS: Readonly<Record<string, Command>> = {
    approve: {
        description: "Approves a submission, or all submissions",
        execute: (cliData, reader, args) => {
            if (reader.atEnd) {
                return () => approve(args.s3Client, cliData)
            }
            const contributor = reader.readEmailAddress()
            const uuid = reader.readUUID4()
            reader.expectEnd()
            return () => approve(args.s3Client, cliData, contributor, uuid)
        },
        usage: "approve ?<uuid>",
    },
    autolink: {
        description: "Automatically pulls external links from an external source within a given clade",
        execute: (cliData, reader) => {
            const source = reader.readPattern<"eol" | "otol">(/^eol|otol$/, "either `eol` or `otol`")
            const node = reader.readNode()
            reader.expectEnd()
            return () => autolink(cliData, source, node)
        },
        usage: "autolink <eol|otol> <node>",
    },
    delete: {
        description: "Deletes an image or node",
        execute: (cliData, reader) => {
            const entity = reader.readEntity()
            reader.expectEnd()
            return () => deleteEntity(cliData, entity)
        },
        usage: "delete <entity>",
    },
    help: {
        description: "Lists all commands",
        execute: (cliData, reader) => () => {
            reader.expectEnd()
            console.info()
            Object.values(COMMANDS).forEach(({ description, usage }) => {
                console.info(`\t> ${usage}`)
                console.info(`\t${description}`)
                console.info()
            })
            console.info("\t> quit")
            console.info("\tQuit the app.")
            return { cliData, sourceUpdates: [] }
        },
        usage: "help",
    },
    identify: {
        description: "Assigns an image to a specific node and, optionally, a general node.",
        execute: (cliData, reader) => {
            const image = reader.readImage()
            const specific = reader.readNode()
            const general = reader.atEnd ? undefined : reader.readNode()
            reader.expectEnd()
            return () => identify(cliData, image, specific, general)
        },
        usage: "identify <image> <node> ?<node>",
    },
    link: {
        description: "Creates or overwrites an external link to a node.",
        execute: (cliData, reader) => {
            const identifer = reader.readIdentifier()
            const entity = reader.readNode()
            const title = reader.atEnd ? undefined : reader.readText()
            reader.expectEnd()
            return () => link(cliData, identifer, entity, title)
        },
        usage: "link <authority>/<namespace>/<objectid> <node> ?<title>",
    },
    merge: {
        description: "Merges two nodes into one.",
        execute: (cliData, reader) => {
            const conserved = reader.readNode()
            const suppressed = reader.readNode()
            reader.expectEnd()
            return () => merge(cliData, conserved, suppressed)
        },
        usage: "merge <node> <node>",
    },
    search: {
        description: "Searches for a node by its name.",
        execute: (cliData, reader) => {
            const name = reader.readName()
            reader.expectEnd()
            return () => search(cliData, name)
        },
        usage: "search <name>",
    },
    show: {
        description: "Displays metadata for an image or node.",
        execute: (cliData, reader) => {
            const entity = reader.readEntity()
            reader.expectEnd()
            return () => show(cliData, entity)
        },
        usage: "show <entity>",
    },
    source: {
        description: "Shows metadata for the source data.",
        execute: (cliData, reader) => {
            reader.expectEnd()
            return () => source(cliData)
        },
        usage: "source",
    },
    spawn: {
        description: "Creates a new node with the specified parent node.",
        execute: (cliData, reader) => {
            const parent = reader.readNode()
            const newUUID = reader.readUUID4()
            const newCanonical = reader.readName()
            const newNames: Nomen[] = []
            while (!reader.atEnd) {
                newNames.push(reader.readName())
            }
            return () => spawn(cliData, parent, newUUID, newCanonical, ...newNames)
        },
        usage: "spawn <node> <UUID-new> <name> ?<names>",
    },
    split: {
        description: "Creates a new node with the specified parent node.",
        execute: (cliData, reader) => {
            const existing = reader.readNode()
            const newUUID = reader.readUUID4()
            const newCanonical = reader.readName()
            const newNames: Nomen[] = []
            while (!reader.atEnd) {
                newNames.push(reader.readName())
            }
            return () => split(cliData, existing, newUUID, newCanonical, ...newNames)
        },
        usage: "split <node> <UUID-new> <name> ?<names>",
    },
    succeed: {
        description: "Makes a node a child of another node.",
        execute: (cliData, reader) => {
            const parent = reader.readNode()
            const child = reader.readNode()
            reader.expectEnd()
            return () => succeed(cliData, parent, child)
        },
        usage: "succeed <node> <node>",
    },
    unlink: {
        description: "Removes an external link to a node.",
        execute: (cliData, reader) => {
            const identifer = reader.readIdentifier()
            reader.expectEnd()
            return () => unlink(cliData, identifer)
        },
        usage: "unlink <identifier>",
    },
}
const parseCommand = (
    cliData: CLIData,
    line: string,
    args: Args,
): (() => CommandResult | Promise<CommandResult>) | typeof QUIT | null => {
    const reader = new LineReader(cliData, line)
    const commandName = reader.read()?.toLowerCase()
    if (!commandName) {
        return null
    }
    if (commandName === "quit") {
        return QUIT
    }
    const command = COMMANDS[commandName]
    if (!command) {
        throw new Error(`Unrecognized command: ${JSON.stringify(commandName)}.`)
    }
    return command.execute(cliData, reader, args)
}
export default parseCommand
