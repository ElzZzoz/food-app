import Header from "../../../Shared/components/Header/Header";
import boyPhoto from "../../../../assets/images/BoyPhoto.png";

function Dashboard({ userData }) {
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
