import { External } from "@phylopic/source-models"
import {
    Authority,
    isAuthority,
    isEmailAddress,
    isNamespace,
    isObjectID,
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
import ExternalNamespaceLister from "./ExternalNamespaceLister"
import ImageClient from "./ImageClient"
import ImagesClient from "./ImagesClient"
import NodeClient from "./NodeClient"
import NodesClient from "./NodesClient"
import EXTERNAL_FIELDS from "./pg/constants/EXTERNAL_FIELDS"
import EXTERNAL_TABLE from "./pg/constants/EXTERNAL_TABLE"
import PGLister from "./pg/PGLister"
import PGPatcher from "./pg/PGPatcher"
import AUTH_BUCKET_NAME from "./s3/constants/AUTH_BUCKET_NAME"
import UPLOAD_BUCKET_NAME from "./s3/constants/UPLOAD_BUCKET_NAME"
import readImageFile from "./s3/io/readImageFile"
import readJWT from "./s3/io/readJWT"
import writeImageFile from "./s3/io/writeImageFile"
import writeJWT from "./s3/io/writeJWT"
import S3Editor from "./s3/S3Editor"
import S3Lister from "./s3/S3Lister"
export default class Client implements SourceClient {
    constructor(protected readonly provider: PGClientProvider & S3ClientProvider) {
        this.authEmails = new S3Lister(provider, AUTH_BUCKET_NAME, "emails/", isEmailAddress)
        this.contributors = new ContributorsClient(provider)
        this.externalAuthorities = new ExternalAuthorityLister(provider, 128)
        this.images = new ImagesClient(provider)
        this.nodes = new NodesClient(provider)
        this.uploads = new S3Lister(provider, UPLOAD_BUCKET_NAME, "images/", isUUIDv4, 32)
    }
    authEmails
    authToken(emailAddress: string) {
        if (!isEmailAddress(emailAddress)) {
            throw new Error("Invalid email address.")
        }
        return new S3Editor(
            this.provider,
            AUTH_BUCKET_NAME,
            `emails/${encodeURIComponent(emailAddress)}/token.jwt`,
            readJWT,
            writeJWT,
        )
    }
    contributor(uuid: UUID) {
        if (!isUUIDv4(uuid)) {
            throw new Error("Invalid UUID.")
        }
        return new ContributorClient(this.provider, uuid)
    }
    contributors
    external(
        authority: Authority,
        namespace: Namespace,
        objectID: ObjectID,
    ): Editable<External & { authority: Authority; namespace: Namespace; objectID: ObjectID }> {
        if (!isAuthority(authority) || !isNamespace(namespace) || !isObjectID(objectID)) {
            throw new Error("Invalid external object specification.")
        }
        return new PGPatcher(
            this.provider,
            EXTERNAL_TABLE,
            [
                { column: "authority", type: "character varying", value: authority },
                { column: "namespace", type: "character varying", value: namespace },
                { column: "object_id", type: "character varying", value: objectID },
            ],
            EXTERNAL_FIELDS,
        )
    }
    externalAuthorities
    externalNamespaces(authority: Authority) {
        if (!isAuthority(authority)) {
            throw new Error("Invalid external authority.")
        }
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
        if (!isUUIDv4(uuid)) {
            throw new Error("Invalid UUID.")
        }
        return new ImageClient(this.provider, uuid)
    }
    images
    node(uuid: UUID) {
        if (!isUUIDv4(uuid)) {
            throw new Error("Invalid UUID.")
        }
        return new NodeClient(this.provider, uuid)
    }
    nodes
    upload(uuid: UUID) {
        if (!isUUIDv4(uuid)) {
            throw new Error("Invalid UUID.")
        }
        return new S3Editor(
            this.provider,
            UPLOAD_BUCKET_NAME,
            `images/${encodeURIComponent(uuid)}/source`,
            readImageFile,
            writeImageFile,
        )
    }
    uploads
}
