import classes from "./Navbar.module.css";

const Navbar = ({ isLoggedIn }) => {
  const navbarContent = !isLoggedIn ? (
    <a href="/login">Login</a>
  ) : (
    <>
      <a href="/logout">Logout</a>
      <a href="/decks">My Decks</a>
      <a href="/decks/new/overlay">Create New Deck</a>
    </>
  );
  return <nav className={classes.Nav}>{navbarContent}</nav>;
};

export default Navbar;
