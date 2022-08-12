import { Contributor, External, Image, JWT, Node } from "@phylopic/source-models"
import { Authority, EmailAddress, Namespace, ObjectID, UUID } from "@phylopic/utils"
import { Editable } from "./Editable"
import { ImageFile } from "./ImageFile"
import { Listable } from "./Listable"
import { Patchable } from "./Patchable"
export type ImagesClient = Listable<Image & { uuid: UUID }, number> & {
    accepted: Listable<Image & { uuid: UUID }, number>
    submitted: Listable<Image & { uuid: UUID }, number>
    withdrawn: Listable<Image & { uuid: UUID }, number>
}
export type SourceClient = Readonly<{
    authEmails: Listable<EmailAddress, string>
    authToken(emailAddress: EmailAddress): Editable<JWT>
    contributor(uuid: UUID): Patchable<Contributor> & {
        images: ImagesClient
    }
    contributors: Listable<Contributor & { uuid: UUID }, number>
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
    image(uuid: UUID): Patchable<Image> & {
        file: Editable<ImageFile>
    }
    images: ImagesClient
    node(uuid: UUID): Patchable<Node>
    nodes: Listable<Node, number>
    upload(uuid: UUID): Editable<ImageFile>
    uploads: Listable<UUID, string>
}>
