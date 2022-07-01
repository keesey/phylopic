import { FC } from "react"
import { PropagateLoader } from "react-spinners"
export type LoaderProps = {
    color?: string
}
export const Loader: FC<LoaderProps> = ({ color }) => (
    <div style={{ textAlign: "center" }}>
        <PropagateLoader color={color} />
    </div>
)
export default Loader
