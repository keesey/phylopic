import { FC } from "react"
import WideScreen from "~/pages/screenTypes/WideScreen"
import Greeting from "./Greeting"
import Pending from "./Pending"
import Published from "./Published"
const Welcome: FC = () => {
    return (
        <WideScreen>
            <Greeting />
            <Pending />
            <Published />
        </WideScreen>
    )
}
export default Welcome
