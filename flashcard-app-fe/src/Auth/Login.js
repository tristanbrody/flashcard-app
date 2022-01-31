import styles from "./Login.module.css";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../redux-store/index";

const Login = () => {
  const isLoggedIn = useSelector(state => state.authState.isAuthenticated);
  const dispatch = useDispatch();
  const onLogin = res => {
    localStorage.setItem("userToken", JSON.stringify(res.token));
    dispatch(authActions.login());
    localStorage.setItem("loggedInEmail", JSON.stringify(res.email));
  };
  const navigate = useNavigate();
  const loginHandler = async e => {
    e.preventDefault();
    const res = await fetch("http://localhost:3001/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: e.target.email.value,
        password: e.target.password.value,
      }),
    }).then(response => {
      return response.json().then(resp => {
        if (resp.success) {
          onLogin(resp);
          navigate("../decks");
        }
      });
    });
  };

  return isLoggedIn ? (
    <Navigate to="../decks" />
  ) : (
    <>
      <form onSubmit={loginHandler}>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" />
        <label htmlFor="password">Password</label>
        <input id="password" type="password" />
        <button type="submit">Login</button>
      </form>
      <a href="/create/account">New here? Create an account</a>
    </>
  );
};

export default Login;
