import classes from "./AddNewDeckOverlay.module.css";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const AddNewDeckOverlay = () => {
  const deckNameRef = useRef();
  const navigate = useNavigate();

  const handleOverlayClick = e => {
    if (
      !e.target.className.includes("overlayContentContainer") &&
      !e.target.className.includes("overlayContent")
    ) {
      navigate("/");
    }
  };

  const handleOverlaySubmit = e => {
    e.preventDefault();
    let deckName = deckNameRef.current.value;
    navigate("/decks/new", { state: { deckName } });
  };

  return (
    <div className={classes.overlay} onClick={handleOverlayClick}>
      <div className={classes.overlayContentContainer}>
        <h2 className={classes.overlayContent}>Create a deck!</h2>
        <form onSubmit={handleOverlaySubmit} className={classes.overlayContent}>
          <label htmlFor="newDeckName">New deck name</label>
          <input
            ref={deckNameRef}
            name="newDeckName"
            type="text"
            placeholder="My new deck"
            className={classes.overlayContent}
          ></input>
          <button type="submit" className={classes.overlayContent}>
            Create new deck
          </button>
          <button type="submit">Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default AddNewDeckOverlay;
