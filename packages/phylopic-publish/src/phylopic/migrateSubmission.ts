import { S3Client } from "@aws-sdk/client-s3"
import { parseNomen } from "parse-nomen/dist/parseNomen"
import {
    LicenseURL,
    NodeIdentifier,
    normalizeText,
    normalizeUUID,
    Submission,
    validateSubmission,
} from "phylopic-source-models/src"
import collectNodes, { NodeEntityAndReferences } from "../phylopicv1/collectNodes"
import getEmailFromSubmitter from "../phylopicv1/getEmailFromSubmitter"
import getFromAPI from "../phylopicv1/getFromAPI"
import { Image } from "../phylopicv1/models/Image"
import { Name } from "../phylopicv1/models/Name"
import putJSON from "../s3utils/putJSON"
import getExistingNodeUUIDs from "./getExistingNodeUUIDs"
import migrateSourceFile from "./migrateSourceFile"
import stringifyName from "./stringifyName"

const migrateNodes = async (client: S3Client, nodes: readonly NodeEntityAndReferences[]) =>
    Promise.all(
        nodes.map(({ uuid, externals, value: node }) => {
            if (uuid && node) {
                const nodeTitle = stringifyName(node.names[0])
                console.info("Migrating name:", nodeTitle, `<http://phylopic.org/name/${uuid}>`)
                return Promise.all([
                    putJSON(
                        client,
                        {
                            Bucket: "source.phylopic.org",
                            Key: `nodes/${normalizeUUID(uuid)}/meta.json`,
                        },
                        node,
                    ),
                    ...externals.map(({ identifier, title, uuid: externalUUID }) =>
                        putJSON(
                            client,
                            {
                                Bucket: "source.phylopic.org",
                                Key: `externals/${identifier.join("/")}/meta.json`,
                            },
                            { href: `/nodes/${externalUUID}`, title },
                        ),
                    ),
                ])
            }
        }),
    )
const convertToNodeIdentifier = async (uid: string): Promise<NodeIdentifier> => {
    const name = await getFromAPI<Name>(`/name/${uid}?options=string+type`)
    return {
        identifier: ["phylopic.org", "nodes", uid],
        name: name.type === "vernacular" ? [{ class: "vernacular", text: name.string }] : parseNomen(name.string),
    }
}
const convertDate = (date: string) => {
    const parts = date.split(/\D+/g).map(part => parseInt(part, 10)) as [number, number, number, number, number, number]
    parts[1]--
    return new Date(...parts).toISOString()
}
const convertToSubmission = async (client: S3Client, image: Image): Promise<Submission> => {
    if (!image.directNames?.[0]?.uid) {
        throw new Error(`This image appears to have been deleted: <http://phylopic.org/image/${image.uid}>`)
    }
    const {
        general: generalNode,
        nodes,
        specific: specificNode,
    } = await collectNodes(image.directNames, uuids => getExistingNodeUUIDs(client, uuids))
    const [specific, general] = await Promise.all([
        convertToNodeIdentifier(specificNode),
        generalNode ? convertToNodeIdentifier(generalNode) : undefined,
        migrateNodes(client, nodes),
    ])
    const email = getEmailFromSubmitter(image)
    const submission = {
        ...(image.credit ? { attribution: normalizeText(image.credit) } : null),
        contributor: normalizeText(email),
        created: convertDate(image.submitted),
        ...(general ? { general } : null),
        license: image.licenseURL.replace(/^http:/, "https:") as LicenseURL,
        specific,
        uuid: normalizeUUID(image.uid),
    }
    validateSubmission(submission, true)
    return submission
}
const migrateSubmission = async (client: S3Client, image: Image) => {
    console.info(`Migrating image to submission <http://phylopic.org/image/${image.uid}>`)
    const submission = await convertToSubmission(client, image)
    const isSVG = typeof image.svgFile?.url === "string"
    const email = getEmailFromSubmitter(image)
    if (!email) {
        throw new Error(`Could not generate an email! <${image.uid}>`)
    }
    await Promise.all([
        migrateSourceFile(
            client,
            image,
            "submissions.phylopic.org",
            `contributors/${encodeURIComponent(email)}/images/${encodeURIComponent(submission.uuid)}/source.${
                isSVG ? "svg" : "png"
            }`,
        ),
        putJSON(
            client,
            {
                Bucket: "submissions.phylopic.org",
                Key: `contributors/${encodeURIComponent(email)}/images/${encodeURIComponent(
                    submission.uuid,
                )}/meta.json`,
            },
            submission,
        ),
    ])
    console.info(`Migrated image to submission:\n${JSON.stringify(submission, undefined, "\t")}`)
}
export default migrateSubmission
