import { FC } from "react"
import WideScreen from "~/pages/screenTypes/WideScreen"
import Accepted from "./Accepted"
import Greeting from "./Greeting"
import Pending from "./Pending"
const Welcome: FC = () => {
    return (
        <WideScreen>
            <Greeting />
            <Pending />
            <Accepted />
        </WideScreen>
    )
}
export default Welcome
