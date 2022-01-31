import { deckActions } from "./index";

const addFlashcardToDeckHandler = async (dispatch, flashcard, deckId) => {
  fetch("http://localhost:3001/create/flashcard", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ deckId, flashcard }),
  }).then(res => console.log(res));
  dispatch(deckActions.add({ flashcard, deckId: deckId }));
};

const deleteFlashcardFromDeckHandler = async (
  dispatch,
  flashcardId,
  deckId
) => {
  fetch("http://localhost:3001/delete/flashcard", {
    method: "DELETE",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ flashcard: flashcardId }),
  }).then(res => console.log(res));
  dispatch(deckActions.delete({ flashcard: { flashcardId, deckId: deckId } }));
};

const editFlashcardHandler = async (
  dispatch,
  flashcard,
  flashcardId,
  deckId
) => {
  fetch("http://localhost:3001/edit/flashcard", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ deckId, flashcard }),
  }).then(res => {
    console.log(res);
  });
  dispatch(deckActions.edit({ flashcardId, flashcard, deckId: deckId }));
};

export {
  addFlashcardToDeckHandler,
  editFlashcardHandler,
  deleteFlashcardFromDeckHandler,
};
