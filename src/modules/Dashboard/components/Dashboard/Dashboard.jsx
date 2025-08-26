import Header from "../../../Shared/components/Header/Header";
import boyPhoto from "../../../../assets/images/BoyPhoto.png";
import { useAuth } from "../../../../context/useAuth";

function Dashboard() {
  const { userData } = useAuth();
  return (
    <>
      <Header
        imgPath={boyPhoto}
        title={`Hello ${userData?.userName || "user"}`}
        desc={
          "This is a welcoming screen for the entry of the application , you can now see the options"
        }
      />
    </>
  );
}

export default Dashboard;
