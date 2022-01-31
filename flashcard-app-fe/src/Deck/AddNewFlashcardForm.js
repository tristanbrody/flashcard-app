import { useState, useRef, useContext } from "react";
import NewFlashcardLeftSide from "../Flashcard/NewFlashcardLeftSide";
import NewFlashcardRightSide from "../Flashcard/NewFlashcardRightSide";
import classes from "./AddNewFlashcardForm.module.css";
import { v4 as uuidv4 } from "uuid";
import { useSelector, useDispatch } from "react-redux";
import {
  addFlashcardToDeckHandler,
  editFlashcardHandler,
  deleteFlashcardFromDeckHandler,
} from "../redux-store/sharedFunctions";

const AddNewFlashcardForm = ({
  deckId,
  toggleEditing = () => {},
  flashcardId = 0,
  editing = true,
}) => {
  const dispatch = useDispatch();
  const decks = useSelector(state => state.deckState.decks);
  // should have components for NewFlashcardLeftSide and NewFlashcardRightSide, with state managed from AddNewFlashcardForm
  const leftFlashcardRef = useRef();
  const rightFlashcardRef = useRef();

  const deleteHandler = () => {
    const foundDeck = decks.filter(f => f.deckId === deckId);
    const foundFlashcard = foundDeck.filter(f => f.flashcardId === flashcardId);
    if (foundFlashcard) {
      deleteFlashcardFromDeckHandler(dispatch, { deckId, flashcardId });
    }
  };

  const submitHandler = e => {
    //need to validate values for both left and right side of new flashcard
    if (e.which === 13 || e.keyCode === 13 || e.key === "Enter") {
      e.preventDefault();
      return "";
    }
    const term = leftFlashcardRef.current.value;
    const definition = rightFlashcardRef.current.value;
    if (term.trim().length === 0 || definition.trim().length === 0) return;
    if (editing && flashcardId === 0) {
      console.log(`deckId in AddNewFlashCardForm is ${deckId}`);
      addFlashcardToDeckHandler(dispatch, {
        term,
        definition,
        deckId,
        flashcardId: uuidv4(),
      });
    }
    // TODO add edit functionality
    else {
      if (flashcardId !== 0) {
        const foundDeck = decks.filter(f => f.deckId === deckId);
        const foundFlashcard = foundDeck.filter(
          f => f.flashcardId === flashcardId
        );
        if (foundFlashcard) {
          editFlashcardHandler(
            dispatch,
            { term, definition, deckId, flashcardId },
            flashcardId
          );
        }
      }
    }
  };

  const ahref = (
    <a
      href="#"
      onClick={e => {
        if (editing) {
          submitHandler(e);
        }
        toggleEditing(!editing);
      }}
    >
      {!editing ? "Edit Flashcard" : "Save Flashcard"}
    </a>
  );
  const deleteAhref = (
    <a
      href="#"
      onClick={() => {
        deleteHandler();
      }}
    >
      Delete Flashcard
    </a>
  );
  const toReturn = editing ? (
    <div className={classes.newFlashcardContainer}>
      <form>
        <NewFlashcardLeftSide ref={leftFlashcardRef} />
        <NewFlashcardRightSide ref={rightFlashcardRef} />
        <div>{ahref}</div>
      </form>
    </div>
  ) : (
    <>
      <div>{ahref}</div>
      <div>{deleteAhref}</div>
    </>
  );
  return toReturn;
};

export default AddNewFlashcardForm;
