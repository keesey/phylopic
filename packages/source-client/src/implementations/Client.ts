import { Contributor, External, Image, Node } from "@phylopic/source-models"
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
import { Listable } from "../interfaces/Listable"
import { SourceClient } from "../interfaces/SourceClient"
import ClientProvider from "./ClientProvider"
import ContributorClient from "./ContributorClient"
import ExternalAuthorityLister from "./ExternalAuthorityLister"
import ExternalNamespaceLister from "./ExternalNamespaceLister"
import ImageClient from "./ImageClient"
import NodeClient from "./NodeClient"
import CONTRIBUTOR_FIELDS from "./pg/constants/CONTRIBUTOR_FIELDS"
import CONTRIBUTOR_TABLE from "./pg/constants/CONTRIBUTOR_TABLE"
import EXTERNAL_FIELDS from "./pg/constants/EXTERNAL_FIELDS"
import EXTERNAL_TABLE from "./pg/constants/EXTERNAL_TABLE"
import IMAGE_FIELDS from "./pg/constants/IMAGE_FIELDS"
import IMAGE_TABLE from "./pg/constants/IMAGE_TABLE"
import NODE_FIELDS from "./pg/constants/NODE_FIELDS"
import NODE_TABLE from "./pg/constants/NODE_TABLE"
import normalizeContributor from "./pg/normalization/normalizeContributor"
import normalizeImage from "./pg/normalization/normalizeImage"
import normalizeNode from "./pg/normalization/normalizeNode"
import PGLister from "./pg/PGLister"
import PGPatcher from "./pg/PGPatcher"
import AUTH_BUCKET_NAME from "./s3/constants/AUTH_BUCKET_NAME"
import readJWT from "./s3/io/readJWT"
import writeJWT from "./s3/io/writeJWT"
import S3Editor from "./s3/S3Editor"
import S3Lister from "./s3/S3Lister"
export default class Client implements SourceClient {
    constructor(protected provider: ClientProvider) {}
    public authEmails = new S3Lister(this.provider.getS3, AUTH_BUCKET_NAME, "emails/", isEmailAddress)
    authToken(emailAddress: string) {
        return new S3Editor(
            this.provider.getS3,
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
    contributors: Listable<Readonly<Contributor>, number> = new PGLister<Contributor>(
        this.provider.getPG,
        CONTRIBUTOR_TABLE,
        128,
        CONTRIBUTOR_FIELDS,
        normalizeContributor,
    )
    external(authority: Authority, namespace: Namespace, objectID: ObjectID): Editable<External> {
        if (!isAuthority(authority) || !isNamespace(namespace) || !isObjectID(objectID)) {
            throw new Error("Invalid external object specification.")
        }
        return new PGPatcher(
            this.provider.getPG,
            EXTERNAL_TABLE,
            [
                { column: "authority", type: "character varying", value: authority },
                { column: "namespace", type: "character varying", value: namespace },
                { column: "object_id", type: "character varying", value: objectID },
            ],
            EXTERNAL_FIELDS,
        )
    }
    externalAuthorities = new ExternalAuthorityLister(this.provider.getPG, 128)
    externalNamespaces(authority: Authority) {
        if (!isAuthority(authority)) {
            throw new Error("Invalid external authority.")
        }
        return new ExternalNamespaceLister(this.provider.getPG, 128, authority)
    }
    externals(authority: Authority, namespace: Namespace) {
        if (!isAuthority(authority) || !isNamespace(namespace)) {
            throw new Error("Invalid external namespace specification.")
        }
        return new PGLister<External>(
            this.provider.getPG,
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
    images = new PGLister<Image>(this.provider.getPG, IMAGE_TABLE, 64, IMAGE_FIELDS, normalizeImage, "modified DESC")
    node(uuid: UUID) {
        if (!isUUIDv4(uuid)) {
            throw new Error("Invalid UUID.")
        }
        return new NodeClient(this.provider, uuid)
    }
    nodes = new PGLister<Node>(this.provider.getPG, NODE_TABLE, 128, NODE_FIELDS, normalizeNode, "name")
}
