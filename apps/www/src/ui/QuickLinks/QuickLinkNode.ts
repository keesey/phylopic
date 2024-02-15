import { UUID } from "@phylopic/utils"
export type QuickLinkNode = Readonly<
    {
        slug: string
        uuid: UUID
    } & (
        | {
              children?: undefined
              imageUUID: UUID
              label: string
          }
        | {
              children: readonly QuickLinkNode[]
              imageUUID: UUID
              label: string
          }
        | {
              children: readonly QuickLinkNode[]
              imageUUID?: undefined
              label?: undefined
          }
    )
>
