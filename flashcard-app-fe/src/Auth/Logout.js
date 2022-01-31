import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../redux-store/index";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  localStorage.removeItem("userToken");
  localStorage.removeItem("loggedInUserId");
  dispatch(authActions.logout());
  useEffect(() => {
    navigate("../login");
  }, []);
  return null;
};

export default Logout;
