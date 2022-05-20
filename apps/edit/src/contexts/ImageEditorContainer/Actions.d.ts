import { Entity, Node } from "@phylopic/source-models"
import { EmailAddress, ImageMediaType, LicenseURL } from "@phylopic/utils"
import { FSAWithPayload } from "flux-standard-action"
import { ResetAction } from "../ResetAction"
import { SaveAction } from "../SaveAction"
import { State } from "./State"

export type InitializeAction = FSAWithPayload<"INITIALIZE", State>
export type SetAttributionAction = FSAWithPayload<"SET_ATTRIBUTION", string | undefined>
export type SetContributorAction = FSAWithPayload<"SET_CONTRIBUTOR", EmailAddress>
export type SetLicenseAction = FSAWithPayload<"SET_LICENSE", LicenseURL>
export type SetSpecificAction = FSAWithPayload<"SET_SPECIFIC", Entity<Node>>
export type SetSponsorAction = FSAWithPayload<"SET_SPONSOR", string | undefined>
export type SetLineageAction = FSAWithPayload<"SET_LINEAGE", readonly Entity<Node>[]>
export type SetMediaTypeAction = FSAWithPayload<"SET_MEDIA_TYPE", ImageMediaType>
export type Action =
    | InitializeAction
    | ResetAction
    | SaveAction
    | SetAttributionAction
    | SetContributorAction
    | SetLicenseAction
    | SetSpecificAction
    | SetSponsorAction
    | SetLineageAction
    | SetMediaTypeAction
