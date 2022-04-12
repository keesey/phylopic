import { S3Client } from "@aws-sdk/client-s3"
import { Name } from "phylopic-source-models"
import approve from "./commands/approve"
import autolink from "./commands/autolink"
import { CommandResult } from "./commands/CommandResult"
import deleteEntity from "./commands/deleteEntity"
import identify from "./commands/identify"
import link from "./commands/link"
import main from "./commands/main"
import merge from "./commands/merge"
import search from "./commands/search"
import show from "./commands/show"
import spawn from "./commands/spawn"
import split from "./commands/split"
import succeed from "./commands/succeed"
import unlink from "./commands/unlink"
import { CLIData } from "./getCLIData"
import LineReader from "./LineReader"
export const QUIT = Symbol()
export type Args = {
    s3Client: S3Client
}
type Command = {
    description: string
    execute(clientData: CLIData, reader: LineReader, args: Args): () => CommandResult | Promise<CommandResult>
    usage: string
}
const COMMANDS: Readonly<Record<string, Command>> = {
    approve: {
        description: "Approves a submission, or all submissions",
        execute: (clientData, reader, args) => {
            if (reader.atEnd) {
                return () => approve(args.s3Client, clientData)
            }
            const contributor = reader.readEmailAddress()
            const uuid = reader.readUUID4()
            reader.expectEnd()
            return () => approve(args.s3Client, clientData, contributor, uuid)
        },
        usage: "approve ?<uuid>",
    },
    autolink: {
        description: "Automatically pulls external links from an external source within a given clade",
        execute: (clientData, reader) => {
            const source = reader.readPattern<"eol" | "otol">(/^eol|otol$/, "either `eol` or `otol`")
            const node = reader.readNode()
            reader.expectEnd()
            return () => autolink(clientData, source, node)
        },
        usage: "autolink <eol|otol> <node>",
    },
    delete: {
        description: "Deletes an image or node",
        execute: (clientData, reader) => {
            const entity = reader.readEntity()
            reader.expectEnd()
            return () => deleteEntity(clientData, entity)
        },
        usage: "delete <entity>",
    },
    help: {
        description: "Lists all commands",
        execute: (clientData, reader) => () => {
            reader.expectEnd()
            console.info()
            Object.values(COMMANDS).forEach(({ description, usage }) => {
                console.info(`\t> ${usage}`)
                console.info(`\t${description}`)
                console.info()
            })
            console.info("\t> quit")
            console.info("\tQuit the app.")
            return { clientData, sourceUpdates: [] }
        },
        usage: "help",
    },
    identify: {
        description: "Assigns an image to a specific node and, optionally, a general node.",
        execute: (clientData, reader) => {
            const image = reader.readImage()
            const specific = reader.readNode()
            const general = reader.atEnd ? undefined : reader.readNode()
            reader.expectEnd()
            return () => identify(clientData, image, specific, general)
        },
        usage: "identify <image> <node> ?<node>",
    },
    link: {
        description: "Creates or overwrites an external link to a node.",
        execute: (clientData, reader) => {
            const identifer = reader.readIdentifier()
            const entity = reader.readNode()
            const title = reader.atEnd ? undefined : reader.readText()
            reader.expectEnd()
            return () => link(clientData, identifer, entity, title)
        },
        usage: "link <authority>/<namespace>/<objectid> <node> ?<title>",
    },
    main: {
        description: "Shows metadata for the site.",
        execute: (clientData, reader) => {
            reader.expectEnd()
            return () => main(clientData)
        },
        usage: "main",
    },
    merge: {
        description: "Merges two nodes into one.",
        execute: (clientData, reader) => {
            const conserved = reader.readNode()
            const suppressed = reader.readNode()
            reader.expectEnd()
            return () => merge(clientData, conserved, suppressed)
        },
        usage: "merge <node> <node>",
    },
    search: {
        description: "Searches for a node by its name.",
        execute: (clientData, reader) => {
            const name = reader.readName()
            reader.expectEnd()
            return () => search(clientData, name)
        },
        usage: "search <name>",
    },
    show: {
        description: "Displays metadata for an image or node.",
        execute: (clientData, reader) => {
            const entity = reader.readEntity()
            reader.expectEnd()
            return () => show(clientData, entity)
        },
        usage: "show <entity>",
    },
    spawn: {
        description: "Creates a new node with the specified parent node.",
        execute: (clientData, reader) => {
            const parent = reader.readNode()
            const newUUID = reader.readUUID4()
            const newCanonical = reader.readName()
            const newNames: Name[] = []
            while (!reader.atEnd) {
                newNames.push(reader.readName())
            }
            return () => spawn(clientData, parent, newUUID, newCanonical, ...newNames)
        },
        usage: "spawn <node> <UUID-new> <name> ?<names>",
    },
    split: {
        description: "Creates a new node with the specified parent node.",
        execute: (clientData, reader) => {
            const existing = reader.readNode()
            const newUUID = reader.readUUID4()
            const newCanonical = reader.readName()
            const newNames: Array<Name> = []
            while (!reader.atEnd) {
                newNames.push(reader.readName())
            }
            return () => split(clientData, existing, newUUID, newCanonical, ...newNames)
        },
        usage: "split <node> <UUID-new> <name> ?<names>",
    },
    succeed: {
        description: "Makes a node a child of another node.",
        execute: (clientData, reader) => {
            const parent = reader.readNode()
            const child = reader.readNode()
            reader.expectEnd()
            return () => succeed(clientData, parent, child)
        },
        usage: "succeed <node> <node>",
    },
    unlink: {
        description: "Removes an external link to a node.",
        execute: (clientData, reader) => {
            const identifer = reader.readIdentifier()
            reader.expectEnd()
            return () => unlink(clientData, identifer)
        },
        usage: "unlink <identifier>",
    },
}
const parseCommand = (
    clientData: CLIData,
    line: string,
    args: Args,
): (() => CommandResult | Promise<CommandResult>) | typeof QUIT | null => {
    const reader = new LineReader(clientData, line)
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
    return command.execute(clientData, reader, args)
}
export default parseCommand
