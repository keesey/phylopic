import { S3Client } from "@aws-sdk/client-s3"
import { EmailAddress, UUID } from "phylopic-utils/src"
import { CLIData } from "../getCLIData"
import { CommandResult } from "./CommandResult"
const approve = (_client: S3Client, cliData: CLIData, _contributor?: EmailAddress, _uuid?: UUID): CommandResult => {
    return {
        cliData,
        sourceUpdates: [],
    }
    // :TODO:
    /*
    if (contributor && uuid) {
        const metaInput = {
            Bucket: "submissions.phylopic.org",
            Key: `contributors/${encodeURIComponent(contributor)}/images/${uuid}/meta.json`,
        }
        const [exists, file] = await Promise.all([
            objectExists(metaInput),
            findImageSourceFile(
                "submissions.phylopic.org",
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
                    Bucket: "source.phylopic.org",
                    CopySource: encodeURI(`submissions.phylopic.org/${file.Key}`),
                    Key: file.Key?.replace(/^contributors\/[^/]+\//, ""),
                }),
            ),
            client.send(
                new PutObjectCommand({
                    Bucket: "source.phylopic.org",
                    Body: stringifyNormalized(image),
                    ContentType: "application/json",
                    Key: `images/${uuid}/meta.json`,
                }),
            ),
        ])
        await client.send(
            new DeleteObjectsCommand({
                Bucket: "submissions.phylopic.org",
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
