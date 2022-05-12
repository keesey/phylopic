import { CopyObjectCommand, DeleteObjectsCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { NextApiHandler, NextApiResponse } from "next"
import {
    CONTRIBUTE_BUCKET_NAME,
    Contribution,
    getLineage,
    Image,
    isContribution,
    isImage,
    SOURCE_BUCKET_NAME,
} from "@phylopic/source-models"
import { EmailAddress, Identifier, isEmailAddress, isUUID, stringifyNormalized, UUID } from "@phylopic/utils"
import { getJSON, objectExists } from "@phylopic/utils-aws"
import findImageSourceFile from "@phylopic/source-models/dist/s3/findImageSourceFile"

const isInternal = (identifier: Identifier | null) =>
    Boolean(identifier && identifier.startsWith("phylopic.org/nodes/"))
export const post = async (client: S3Client, contributor: EmailAddress, uuid: UUID, res: NextApiResponse) => {
    const metaInput = {
        Bucket: CONTRIBUTE_BUCKET_NAME,
        Key: `contributors/${encodeURIComponent(contributor)}/images/${uuid}/meta.json`,
    }
    const [exists, file] = await Promise.all([
        objectExists(client, metaInput),
        findImageSourceFile(
            client,
            CONTRIBUTE_BUCKET_NAME,
            `contributors/${encodeURIComponent(contributor)}/images/${uuid}/source.`,
        ),
    ])
    if (!file?.Key || !exists) {
        return res.status(404)
    }
    try {
        const [contribution] = await getJSON<Contribution>(client, metaInput, isContribution)
        if (!contribution.specific.identifier || (contribution.general && !contribution.general.identifier)) {
            throw new Error("Submission is not ready for approval.")
        }
        if (
            !isInternal(contribution.specific.identifier) ||
            (contribution.general && !isInternal(contribution.general?.identifier))
        ) {
            throw new Error("Submission needs to be assigned to internal nodes.")
        }
        const specificUUID = contribution.specific.identifier[2]
        const generalUUID = contribution.general?.identifier?.[2] ?? null
        if (contribution.general) {
            const lineage = await getLineage(client, specificUUID, generalUUID)
            if (!lineage.some(entity => entity.uuid === generalUUID)) {
                throw new Error("Invalid general node.")
            }
        }
        const image: Image = {
            attribution: contribution.attribution,
            contributor: contribution.contributor,
            created: contribution.created,
            general: generalUUID,
            license: contribution.license,
            specific: specificUUID,
            sponsor: contribution.sponsor,
        }
        if (!isImage(image)) {
            throw new Error("Invalid image metadata.")
        }
        await Promise.all([
            client.send(
                new CopyObjectCommand({
                    Bucket: SOURCE_BUCKET_NAME,
                    CopySource: encodeURI(`submissions.phylopic.org/${file.Key}`),
                    Key: file.Key?.replace(/^contributors\/[^/]+\//, ""),
                }),
            ),
            client.send(
                new PutObjectCommand({
                    Bucket: SOURCE_BUCKET_NAME,
                    Body: stringifyNormalized(image),
                    ContentType: "application/json",
                    Key: `images/${uuid}/meta.json`,
                }),
            ),
        ])
        await client.send(
            new DeleteObjectsCommand({
                Bucket: CONTRIBUTE_BUCKET_NAME,
                Delete: {
                    Objects: [{ Key: file.Key }, { Key: metaInput.Key }],
                },
            }),
        )
        res.status(204)
    } catch (e) {
        console.error(e)
        res.status(400)
    }
}
const approve: NextApiHandler<void> = async (req, res) => {
    const { contributor, uuid } = req.query
    if (!isEmailAddress(contributor)) {
        console.error("Missing or invalid contributor.")
        res.status(404).end()
    } else if (!isUUID(uuid)) {
        console.error("Missing or invalid UUID.")
        res.status(404).end()
    } else {
        switch (req.method) {
            case "POST": {
                const client = new S3Client({})
                try {
                    await post(client, contributor, uuid, res)
                } finally {
                    client.destroy()
                }
                break
            }
            default: {
                res.status(405)
            }
        }
    }
    res.end()
}
export default approve
