import logo from "./logo.svg";
import "./App.css";
import Flashcard from "./Flashcard/Flashcard";
import Navbar from "./UI/Navbar";
import { BrowserRouter, Route, Routes, NavLink } from "react-router-dom";
import PrivateRoute from "./UI/PrivateRoute";
import AddNewDeck from "./Deck/AddNewDeck";
import Deck from "./Deck/Deck";
import Login from "./Auth/Login";
import Logout from "./Auth/Logout";
import NewAccount from "./Auth/NewAccount";
import AddNewDeckOverlay from "./Deck/AddNewDeckOverlay";
import FlashcardProvider from "./Store/FlashcardProvider";
import MyDecks from "./Deck/MyDecks";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "./redux-store/index";

function App() {
  // need to get next deck ID from database. For now setting to a random number -
  const getNextDeckId = () => {
    return Math.floor(Math.random * 100) + 1;
  };
  const isLoggedIn = useSelector(state => state.authState.isAuthenticated);
  console.log(`isLogged in is ${isLoggedIn}`);
  return (
    <div className="App">
      <Navbar isLoggedIn={isLoggedIn} />
      <BrowserRouter>
        <Routes>
          <Route
            exact
            path="/decks/new/overlay"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <AddNewDeckOverlay />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path="/decks/new"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <AddNewDeck />
              </PrivateRoute>
            }
          />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/" element={<Login />} />
          <Route exact path="/logout" element={<Logout />} />
          <Route exact path="/decks" element={<MyDecks />} />
          <Route exact path="/create/account" element={<NewAccount />} />
          <Route exact path="/view/decks/:id" element={<Deck />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
