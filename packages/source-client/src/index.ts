import { S3Client } from "@aws-sdk/client-s3"
import {
    Contributor,
    External,
    Image,
    isContributor,
    isExternal,
    isImage,
    isNode,
    isSubmission,
    JWT,
    Node,
    Source,
    Submission,
} from "@phylopic/source-models"
import {
    Authority,
    EmailAddress,
    isAuthority,
    isEmailAddress,
    isNamespace,
    isObjectID,
    isUUIDv4,
    Namespace,
    ObjectID,
    UUID,
} from "@phylopic/utils"
import AUTH_BUCKET_NAME from "./constants/AUTH_BUCKET_NAME"
import SOURCE_BUCKET_NAME from "./constants/SOURCE_BUCKET_NAME"
import SUBMISSIONS_BUCKET_NAME from "./constants/SUBMISSIONS_BUCKET_NAME"
import Editor from "./implementations/Editor"
import ImagePatcher from "./implementations/ImagePatcher"
import list from "./implementations/list"
import Patcher from "./implementations/Patcher"
import Reader from "./implementations/Reader"
import { Editable, ImageFile, List, Patchable, Readable } from "./interfaces"
import createJSONWriter from "./io/createJSONWriter"
import readJSON from "./io/readJSON"
import readJWT from "./io/readJWT"
import writeJWT from "./io/writeJWT"
export default class SourceClient {
    private client: S3Client | undefined
    public authEmails(token?: string): Promise<List<EmailAddress>> {
        return list<EmailAddress>(this.getClient(), AUTH_BUCKET_NAME, "emails/", isEmailAddress, token)
    }
    public authToken(emailAddress: EmailAddress) {
        if (!isEmailAddress(emailAddress)) {
            throw new Error("Invalid email address: " + emailAddress)
        }
        return new Editor<JWT>(
            this.getClient,
            AUTH_BUCKET_NAME,
            `emails/${encodeURIComponent(emailAddress)}/token.jwt`,
            readJWT,
            writeJWT,
        )
    }
    public destroy() {
        this.client?.destroy()
        this.client = undefined
    }
    public readonly source: Readable<Source> = new Reader<Source>(
        this.getClient,
        SOURCE_BUCKET_NAME,
        "meta.json",
        readJSON,
    )
    public sourceContributor(uuid: UUID): Patchable<Contributor> {
        if (!isUUIDv4(uuid)) {
            throw new Error("Invalid UUIDv4: " + uuid)
        }
        return new Patcher<Contributor>(
            this.getClient,
            SOURCE_BUCKET_NAME,
            `/contributors/${encodeURIComponent(uuid)}`,
            readJSON,
            createJSONWriter(isContributor),
        )
    }
    public sourceContributors(token?: string): Promise<List<UUID>> {
        return list<UUID>(this.getClient(), SOURCE_BUCKET_NAME, "contributors/", isUUIDv4, token)
    }
    public sourceExternal(authority: Authority, namespace: Namespace, objectID: ObjectID): Editable<External> {
        if (!isAuthority(authority)) {
            throw new Error("Invalid authority: " + authority)
        }
        if (!isNamespace(namespace)) {
            throw new Error("Invalid namespace: " + namespace)
        }
        if (!isObjectID(objectID)) {
            throw new Error("Invalid object ID: " + objectID)
        }
        return new Editor<External>(
            this.getClient,
            SOURCE_BUCKET_NAME,
            `external/${encodeURIComponent(authority)}/${encodeURIComponent(namespace)}/${encodeURIComponent(
                objectID,
            )}/meta.json`,
            readJSON,
            createJSONWriter(isExternal),
        )
    }
    public sourceExternalAuthorities(token?: string): Promise<List<Authority>> {
        return list<Authority>(this.getClient(), SOURCE_BUCKET_NAME, "external/", isAuthority, token)
    }
    public sourceExternalNamespaces(authority: Authority, token?: string): Promise<List<Namespace>> {
        if (!isAuthority(authority)) {
            throw new Error("Invalid authority: " + authority)
        }
        return list<Authority>(
            this.getClient(),
            SOURCE_BUCKET_NAME,
            `external/${encodeURIComponent(authority)}/`,
            isNamespace,
            token,
        )
    }
    public sourceExternalObjectIDs(
        authority: Authority,
        namespace: Namespace,
        token?: string,
    ): Promise<List<ObjectID>> {
        if (!isAuthority(authority)) {
            throw new Error("Invalid authority: " + authority)
        }
        if (!isNamespace(namespace)) {
            throw new Error("Invalid namespace: " + namespace)
        }
        return list<ObjectID>(
            this.getClient(),
            SOURCE_BUCKET_NAME,
            `external/${encodeURIComponent(authority)}/${encodeURIComponent(namespace)}/`,
            isObjectID,
            token,
        )
    }
    public sourceImage(uuid: UUID): Patchable<Image> & {
        file: Editable<ImageFile>
    } {
        if (!isUUIDv4(uuid)) {
            throw new Error("Invalid UUIDv4: " + uuid)
        }
        return new ImagePatcher<Image>(
            this.getClient,
            SOURCE_BUCKET_NAME,
            `images/${encodeURIComponent(uuid)}`,
            readJSON,
            createJSONWriter(isImage),
        )
    }
    public sourceImages(token?: string): Promise<List<UUID>> {
        return list(this.getClient(), SOURCE_BUCKET_NAME, "images/", isUUIDv4, token)
    }
    public sourceNode(uuid: UUID): Patchable<Node> {
        if (!isUUIDv4(uuid)) {
            throw new Error("Invalid UUIDv4: " + uuid)
        }
        return new Patcher<Node>(
            this.getClient,
            SOURCE_BUCKET_NAME,
            `nodes/${encodeURIComponent(uuid)}/meta.json`,
            readJSON,
            createJSONWriter(isNode),
        )
    }
    public sourceNodes(token?: string): Promise<List<UUID>> {
        return list(this.getClient(), SOURCE_BUCKET_NAME, "nodes/", isUUIDv4, token)
    }
    public submission(
        contributorUUID: UUID,
        imageUUID: UUID,
    ): Patchable<Submission> & {
        file: Editable<ImageFile>
    } {
        if (!isUUIDv4(contributorUUID)) {
            throw new Error("Invalid UUIDv4: " + contributorUUID)
        }
        if (!isUUIDv4(imageUUID)) {
            throw new Error("Invalid UUIDv4: " + imageUUID)
        }
        return new ImagePatcher<Submission>(
            this.getClient,
            SOURCE_BUCKET_NAME,
            `contributors/${encodeURIComponent(contributorUUID)}/submissions/${encodeURIComponent(imageUUID)}`,
            readJSON,
            createJSONWriter(isSubmission),
        )
    }
    public submissionContributors(token?: string): Promise<List<UUID>> {
        return list(this.getClient(), SUBMISSIONS_BUCKET_NAME, "contributors/", isUUIDv4, token)
    }
    public submissions(contributorUUID: UUID, token?: string): Promise<List<UUID>> {
        if (!isUUIDv4(contributorUUID)) {
            throw new Error("Invalid UUIDv4: " + contributorUUID)
        }
        return list(
            this.getClient(),
            SUBMISSIONS_BUCKET_NAME,
            `contributors/${encodeURIComponent(contributorUUID)}/submissions/`,
            isUUIDv4,
            token,
        )
    }
    protected getClient() {
        if (!this.client) {
            return (this.client = new S3Client({}))
        }
        return this.client
    }
}
