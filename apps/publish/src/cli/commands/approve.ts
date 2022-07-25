import { S3Client } from "@aws-sdk/client-s3"
import { EmailAddress, UUID } from "@phylopic/utils"
import { CLIData } from "../getCLIData.js"
import { CommandResult } from "./CommandResult.js"
const approve = (_client: S3Client, cliData: CLIData, _contributor?: EmailAddress, _uuid?: UUID): CommandResult => {
    return {
        cliData,
        sourceUpdates: [],
    }
    // :TODO:
    /*
    if (contributor && uuid) {
        const metaInput = {
            Bucket: SUBMISSIONS_BUCKET_NAME,
            Key: `contributors/${encodeURIComponent(contributor)}/images/${uuid}/meta.json`,
        }
        const [exists, file] = await Promise.all([
            objectExists(metaInput),
            findImageSourceFile(
                SUBMISSIONS_BUCKET_NAME,
                `contributors/${encodeURIComponent(contributor)}/images/${uuid}/source.`,
            ),
        ])
        if (!file?.Key || !exists) {
            throw new Error("Source file cannot be found.")
        }
        const [submission] = await getJSON<Submission>(metaInput, validateSubmission)
        if (!submission.specific.uuid || (submission.general && !submission.general?.uuid)) {
            throw new Error("Submission is not ready for approval.")
        }
        if (submission.general) {
            const lineage = await getLineage(submission.specific.uuid, submission.general.uuid)
            if (!lineage.some(entity => entity.uuid === submission.general?.uuid)) {
                throw new Error("Invalid general node.")
            }
        }
        const image: Image = {
            ...(submission.attribution ? { attribution: submission.attribution } : null),
            contributor: submission.contributor,
            created: submission.created,
            ...(submission.general ? { general: submission.general?.uuid } : null),
            license: submission.license,
            specific: submission.specific.uuid,
            ...(submission.sponsor ? { sponsor: submission.sponsor } : null),
        }
        validateImage(image, true)
        await Promise.all([
            client.send(
                new CopyObjectCommand({
                    Bucket: SOURCE_BUCKET_NAME,
                    CopySource: encodeURI(`contribute.phylopic.org/${file.Key}`),
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
                Bucket: SUBMISSIONS_BUCKET_NAME,
                Delete: {
                    Objects: [{ Key: file.Key }, { Key: metaInput.Key }],
                },
            }),
        )
        return []
    }
    */
}
export default approve
