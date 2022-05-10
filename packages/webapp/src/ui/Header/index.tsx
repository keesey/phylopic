import { FC, ReactNode } from "react"
export type HeaderLevel = 1 | 2 | 3 | 4 | 5 | 6
export interface Props {
    children: ReactNode
    level?: HeaderLevel
}
const Header: FC<Props> = ({ children, level }) => {
    switch (level) {
        case 6: {
            return <h6>{children}</h6>
        }
        case 5: {
            return <h5>{children}</h5>
        }
        case 4: {
            return <h4>{children}</h4>
        }
        case 3: {
            return <h3>{children}</h3>
        }
        case 2: {
            return <h2>{children}</h2>
        }
        default: {
            return <h1>{children}</h1>
        }
    }
}
export default Header
