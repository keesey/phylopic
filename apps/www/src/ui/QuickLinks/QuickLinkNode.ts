import { UUID } from "@phylopic/utils"
export type QuickLinkNode = Readonly<
    {
        slug: string
        uuid: UUID
    } & (
        | {
              children: readonly QuickLinkNode[]
              label?: string
          }
        | {
              children?: undefined
              label: string
          }
    )
>
