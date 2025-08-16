import { useLocation } from "react-router-dom";
import GirlPhoto from "../../../../assets/images/GirlPhoto.png";

function Header({ title, desc, imgPath }) {
  const { pathname } = useLocation();
  return (
    <div className="container-fluid bg-success rounded-5 p-4 mb-4 text-white">
      <div className="row ">
        <div className="col-md-8 d-flex align-items-center">
          <div>
            <h3 className="text-white">{title}</h3>
            <p className="text-white">{desc}</p>
          </div>
        </div>
        <div className="col-md-4 d-flex align-items-center justify-content-center">
          <img
            className="img-fluid"
            src={pathname === "/dashboard" ? GirlPhoto : imgPath}
            alt="GirlPhoto"
          />
        </div>
      </div>
    </div>
  );
}

export default Header;
