import { Contributor, External, Image, JWT, Node, Submission } from "@phylopic/source-models"
import { Authority, EmailAddress, Hash, Identifier, Namespace, ObjectID, UUID } from "@phylopic/utils"
import { Deletable } from "./Deletable"
import { Editable } from "./Editable"
import { ImageFile } from "./ImageFile"
import { Listable } from "./Listable"
import { Patchable } from "./Patchable"
export type SourceClient = Readonly<{
    authEmails: Listable<EmailAddress, string>
    authToken(emailAddress: EmailAddress): Editable<JWT>
    contributor(uuid: UUID): Patchable<Contributor> & {
        images: Listable<Image & { uuid: UUID }, number>
        submissions: Listable<UUID, string>
    }
    contributors: Listable<Contributor & { uuid: UUID }, number> & {
        byEmail(email: EmailAddress): Patchable<Contributor>
    }
    copyUploadToSourceImage(hash: Hash, uuid: UUID): Promise<void>
    external(
        authority: Authority,
        namespace: Namespace,
        objectID: ObjectID,
    ): Editable<External & { authority: Authority; namespace: Namespace; objectID: ObjectID }>
    externalAuthorities: Listable<Authority, number>
    externalNamespaces(authority: Authority): Listable<Namespace, number>
    externals(
        authority: Authority,
        namespace: Namespace,
    ): Listable<External & { authority: Authority; namespace: Namespace; objectID: ObjectID }, number>
    image(uuid: UUID): Patchable<Image & { uuid: UUID }> & {
        file: Editable<ImageFile>
    }
    images: Listable<Image & { uuid: UUID }, number>
    node(uuid: UUID): Patchable<Node & { uuid: UUID }> & {
        lineage: Listable<Node & { uuid: UUID }, number>
    }
    nodes: Listable<Node & { uuid: UUID }, number> & {
        resolve(
            externals: ReadonlyArray<Readonly<{ authority: Authority; namespace: Namespace; objectID: ObjectID }>>,
        ): Promise<Record<Identifier, Node & { uuid: UUID }>>
    }
    sourceImage(hash: UUID): Editable<ImageFile>
    sourceImages: Listable<UUID, string>
    submission(uuid: UUID): Patchable<Submission & { uuid: UUID }>
    submissions: Listable<UUID, string>
    upload(hash: Hash): Deletable<ImageFile>
    uploads: Listable<Hash, string>
}>
