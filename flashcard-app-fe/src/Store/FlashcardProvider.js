// import { useReducer } from "react";
// import FlashcardContext from "./flashcard-context";
// import { BrowserRouter, Route, Routes, NavLink } from "react-router-dom";

// const defaultFlashcardState = {
//   decks: [],
// };

// const flashcardReducer = (state, action) => {
//   let updatedFlashcards;
//   let updatedDecks;
//   let deckFound;
//   let originalDecks;
//   //TODO finish reducer function
//   switch (action.type) {
//     case "ADD":
//       deckFound = state.decks.filter(d => d.deckId === action.flashcard.deckId);
//       originalDecks = state.decks.filter(
//         d => d.deckId !== action.flashcard.deckId
//       );
//       if (deckFound.length === 1) {
//         updatedFlashcards = [...deckFound[0].flashcards, action.flashcard];
//         updatedDecks = [
//           { deckId: action.flashcard.deckId, flashcards: updatedFlashcards },
//           ...originalDecks,
//         ];
//       } else {
//         updatedDecks = [
//           {
//             deckId: action.flashcard.deckId,
//             flashcards: [action.flashcard],
//           },
//         ];
//       }
//       //TODO add flashcard to database linked to current deckId (action.deckId)
//       break;
//     case "EDIT":
//       originalDecks = state.decks.filter(
//         d => d.deckId !== action.flashcard.deckId
//       );
//       deckFound = state.decks.filter(d => d.deckId === action.flashcard.deckId);
//       if (deckFound.length >= 1) {
//         const notToUpdate = deckFound[0].flashcards.filter(
//           f => f.flashcardId !== action.flashcardId
//         );
//         updatedFlashcards = [...notToUpdate];
//         updatedFlashcards.push(action.flashcard);
//         updatedDecks = [
//           ...originalDecks,

//           { deckId: action.flashcard.deckId, flashcards: updatedFlashcards },
//         ];
//       } else {
//         updatedDecks = [
//           {
//             deckId: action.flashcard.deckId,
//             flashcards: [action.flashcard],
//           },
//         ];
//       }
//       break;
//     case "DELETE":
//       deckFound = state.decks.filter(d => d.deckId === action.deckId);
//       updatedFlashcards = deckFound.filter(f => action.flashcardId !== f.id);
//       updatedDecks = [...updatedFlashcards];
//       //TODO remove flashcard linked to current action.deckId from database
//       break;
//   }
//   return { decks: updatedDecks };
// };

// const FlashcardProvider = props => {
//   const currentFlashcardState = {};
//   //TODO fix above
//   const [flashcardState, dispatchFlashcardAction] = useReducer(
//     flashcardReducer,
//     defaultFlashcardState
//   );

//   const addFlashcardToDeckHandler = flashcard => {
//     dispatchFlashcardAction({ type: "ADD", flashcard, deckId: props.deckId });
//   };

//   const deleteFlashcardFromDeckHandler = flashcardId => {
//     dispatchFlashcardAction({
//       type: "DELETE",
//       flashcardId,
//       deckId: props.deckId,
//     });
//   };

//   const editFlashcardHandler = (flashcard, flashcardId) => {
//     dispatchFlashcardAction({
//       type: "EDIT",
//       flashcardId,
//       flashcard,
//       deckId: props.deckId,
//     });
//   };

//   const flashcardContext = {
//     deckId: props.getNextDeckId(),
//     decks: flashcardState.decks || [],
//     addFlashcard: addFlashcardToDeckHandler,
//     editFlashcard: editFlashcardHandler,
//     deleteFlashcard: deleteFlashcardFromDeckHandler,
//   };

//   return (
//     <FlashcardContext.Provider value={flashcardContext}>
//       {props.children}
//     </FlashcardContext.Provider>
//   );
// };

// export default FlashcardProvider;
