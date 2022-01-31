import styles from "./Login.module.css";

const NewAccount = () => {
  const submitHandler = async e => {
    e.preventDefault();
    const res = await fetch("http://localhost:3001/create/account", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        username: e.target.username.value,
        email: e.target.email.value,
        password: e.target.password.value,
      }),
    });
    console.log(res);
  };
  return (
    <>
      <form onSubmit={submitHandler}>
        <label htmlFor="username">Create Username</label>
        <input id="username" type="text" />
        <label htmlFor="email">Email Address</label>
        <input id="email" type="email" />
        <label htmlFor="password">Create Password</label>
        <input id="password" type="password" />
        <label htmlFor="confirm-password">Confirm Password</label>
        <input id="confirm-password" type="password" />
        <button type="submit">Create account</button>
      </form>
      <a href="/login">Have an existing account? Login here</a>
    </>
  );
};

export default NewAccount;
