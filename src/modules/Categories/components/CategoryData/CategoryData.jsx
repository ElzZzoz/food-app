import Header from "../../../Shared/components/Header/Header";
import boyPhoto from "../../../../assets/images/BoyPhoto.png";

function CategoryData() {
  return (
    <>
      <Header
        imgPath={boyPhoto}
        title={"Categories item"}
        desc={
          "You can now add your items that any user can order it from the Application and you can edit"
        }
      />
    </>
  );
}

export default CategoryData;
