import { useState } from "react";
import classes from "./Flashcard.module.css";
import AddNewFlashcardForm from "../Deck/AddNewFlashcardForm";
import { v4 as uuidv4 } from "uuid";

const Flashcard = ({ term, definition, id, deckId }) => {
  const [toggledState, setToggledState] = useState(false);
  const [editing, toggleEditing] = useState(false);

  const flashcardContent = toggledState
    ? `Definition: ${definition}`
    : `Term: ${term}`;
  const editingContent = (
    <AddNewFlashcardForm
      deckId={deckId}
      editing={editing}
      toggleEditing={toggleEditing}
      flashcardId={id}
      key={uuidv4()}
    />
  );

  return (
    <>
      <section>
        <div
          className={classes.flashcardContainer}
          onClick={() => setToggledState(!toggledState)}
          key={id}
        >
          {flashcardContent}
        </div>

        {editingContent}
      </section>
    </>
  );
};

export default Flashcard;
