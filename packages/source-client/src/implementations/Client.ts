import { CopyObjectCommand } from "@aws-sdk/client-s3"
import { External } from "@phylopic/source-models"
import {
    Authority,
    Hash,
    isAuthority,
    isEmailAddress,
    isHash,
    isNamespace,
    isUUIDv4,
    Namespace,
    ObjectID,
    UUID,
} from "@phylopic/utils"
import { Editable } from "../interfaces/Editable"
import { PGClientProvider } from "../interfaces/PGClientProvider"
import { S3ClientProvider } from "../interfaces/S3ClientProvider"
import { SourceClient } from "../interfaces/SourceClient"
import ContributorClient from "./ContributorClient"
import { ContributorsClient } from "./ContributorsClient"
import ExternalAuthorityLister from "./ExternalAuthorityLister"
import ExternalClient from "./ExternalClient"
import ExternalNamespaceLister from "./ExternalNamespaceLister"
import ImageClient from "./ImageClient"
import ImagesClient from "./ImagesClient"
import NodeClient from "./NodeClient"
import NodesClient from "./NodesClient"
import EXTERNAL_FIELDS from "./pg/constants/EXTERNAL_FIELDS"
import EXTERNAL_TABLE from "./pg/constants/EXTERNAL_TABLE"
import PGLister from "./pg/PGLister"
import RootClient from "./RootClient"
import AUTH_BUCKET_NAME from "./s3/constants/AUTH_BUCKET_NAME"
import SOURCE_IMAGES_BUCKET_NAME from "./s3/constants/SOURCE_IMAGES_BUCKET_NAME"
import UPLOADS_BUCKET_NAME from "./s3/constants/UPLOADS_BUCKET_NAME"
import readImageFile from "./s3/io/readImageFile"
import readJWT from "./s3/io/readJWT"
import writeImageFile from "./s3/io/writeImageFile"
import writeJWT from "./s3/io/writeJWT"
import S3Editor from "./s3/S3Editor"
import S3Lister from "./s3/S3Lister"
import SubmissionClient from "./SubmissionClient"
export default class Client implements SourceClient {
    constructor(protected readonly provider: PGClientProvider & S3ClientProvider) {
        this.authEmails = new S3Lister(provider, AUTH_BUCKET_NAME, "emails/", isEmailAddress)
        this.contributors = new ContributorsClient(provider)
        this.externalAuthorities = new ExternalAuthorityLister(provider, 128)
        this.images = new ImagesClient(provider)
        this.nodes = new NodesClient(provider)
        this.root = new RootClient(provider)
        this.sourceImages = new S3Lister(provider, SOURCE_IMAGES_BUCKET_NAME, "images/", isUUIDv4)
        this.submissions = new S3Lister(provider, UPLOADS_BUCKET_NAME, "files/", isHash, undefined, null)
    }
    authEmails
    authToken(emailAddress: string) {
        emailAddress = emailAddress.toLowerCase()
        if (!isEmailAddress(emailAddress)) {
            throw new Error("Invalid email address.")
        }
        return new S3Editor(
            this.provider,
            AUTH_BUCKET_NAME,
            `emails/${encodeURIComponent(emailAddress).toLowerCase()}/token.jwt`,
            readJWT,
            writeJWT,
        )
    }
    contributor(uuid: UUID) {
        return new ContributorClient(this.provider, uuid)
    }
    async copySubmissionToSourceImage(hash: Hash, uuid: UUID) {
        if (!isHash(hash)) {
            throw new Error("Invalid hexadecimal hash.")
        }
        if (!isUUIDv4(uuid)) {
            throw new Error("Invalid UUID.")
        }
        await this.provider.getS3().send(
            new CopyObjectCommand({
                Bucket: SOURCE_IMAGES_BUCKET_NAME,
                CopySource: encodeURI(`/${UPLOADS_BUCKET_NAME}/files/${hash}`),
                Key: `images/${encodeURIComponent(uuid)}/source`,
            }),
        )
    }
    contributors
    external(
        authority: Authority,
        namespace: Namespace,
        objectID: ObjectID,
    ): Editable<External & { authority: Authority; namespace: Namespace; objectID: ObjectID }> {
        return new ExternalClient(this.provider, authority, namespace, objectID)
    }
    externalAuthorities
    externalNamespaces(authority: Authority) {
        return new ExternalNamespaceLister(this.provider, 128, authority)
    }
    externals(authority: Authority, namespace: Namespace) {
        if (!isAuthority(authority) || !isNamespace(namespace)) {
            throw new Error("Invalid external namespace specification.")
        }
        return new PGLister<External, { authority: Authority; namespace: Namespace; objectID: ObjectID }>(
            this.provider,
            EXTERNAL_TABLE,
            128,
            EXTERNAL_FIELDS,
            undefined,
            "object_id",
            [
                { column: "authority", type: "character varying", value: authority },
                { column: '"namespace"', type: "character varying", value: namespace },
            ],
        )
    }
    image(uuid: UUID) {
        return new ImageClient(this.provider, uuid)
    }
    images
    node(uuid: UUID) {
        return new NodeClient(this.provider, uuid)
    }
    nodes
    root
    sourceImage(uuid: UUID) {
        if (!isUUIDv4(uuid)) {
            throw new Error("Invalid UUID.")
        }
        return new S3Editor(
            this.provider,
            SOURCE_IMAGES_BUCKET_NAME,
            `images/${encodeURIComponent(uuid)}`,
            readImageFile,
            writeImageFile,
        )
    }
    sourceImages
    submission(hash: Hash) {
        return new SubmissionClient(this.provider, hash)
    }
    submissions
}
