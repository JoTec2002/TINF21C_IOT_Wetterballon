import Navigationbar from '@/components/navigationbar';
import Main from "@/components/menu/main";
import {GlobalProvider} from "@/components/globalProvider";


const MainPage = () => {
    return (
        <GlobalProvider>
            <Navigationbar/>
            <Main />
        </GlobalProvider>
    )
}

export default MainPage;