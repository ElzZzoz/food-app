import Header from "../../../Shared/components/Header/Header";
import boyPhoto from "../../../../assets/images/BoyPhoto.png";

function UsersList({ userData }) {
  return (
    <>
      <Header
        imgPath={boyPhoto}
        title={`Welcome ${userData?.userName || "User"}`}
        desc={
          "This is a welcoming screen for the entry of the application , you can now see the options"
        }
      />
    </>
  );
}

export default UsersList;
