import FirstPage from "./Initial/FirstPage";
import SecondPage from "./Initial/SecondPage";
import ThirdPage from "./Initial/ThirdPage";
import LastPage from "./Initial/LastPage";
import Footer from "../components/Footer/Footer";

export default function Initial() {
  return (
    <div className="Initial">
      <FirstPage></FirstPage>
      <SecondPage></SecondPage>
      <ThirdPage></ThirdPage>
      <LastPage></LastPage>
      <Footer></Footer>
    </div>
  );
}
