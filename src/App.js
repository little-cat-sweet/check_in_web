import router from "./router";
import {useRoutes} from "react-router-dom";
import {observer} from 'mobx-react-lite'
const APP = () => {
    const outlet = useRoutes(router)
    return(
        <>
            {outlet}
        </>
    )
}
export default observer(APP)