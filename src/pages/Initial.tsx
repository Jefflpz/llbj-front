import FirstPage from "./Initial/FirstPage";
import SecondPage from "./Initial/SecondPage";
import ThirdPage from "./Initial/ThirdPage";
import LastPage from "./Initial/LastPage"; 

export default function Initial() {
    return (
        <div className="Initial">
            <FirstPage></FirstPage>
            <SecondPage></SecondPage>
            <ThirdPage></ThirdPage>
            <LastPage></LastPage>
        </div>
    );
}