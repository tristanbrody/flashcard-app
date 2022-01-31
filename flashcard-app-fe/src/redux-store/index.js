import { createStore } from "redux";
import { createSlice, configureStore } from "@reduxjs/toolkit";

//version using redux toolkit
const deckSlice = createSlice({
  name: "decks",
  initialState: { decks: [] },
  reducers: {
    add(state, action) {
      let updatedFlashcards;
      let updatedDecks;
      let deckFound;
      let originalDecks;
      deckFound = state.decks.filter(
        d => d.deckId === action.payload.flashcard.deckId
      );
      originalDecks = state.decks.filter(
        d => d.deckId !== action.payload.flashcard.deckId
      );
      if (deckFound.length === 1) {
        updatedFlashcards = [
          ...deckFound[0].flashcards,
          action.payload.flashcard,
        ];
        updatedDecks = [
          {
            deckId: action.payload.flashcard.deckId,
            flashcards: updatedFlashcards,
          },
          ...originalDecks,
        ];
      } else {
        updatedDecks = [
          {
            deckId: action.payload.flashcard.deckId,
            flashcards: [action.payload.flashcard],
          },
        ];
      }
      return { decks: updatedDecks || [] };
    },
    edit(state, action) {
      let updatedFlashcards;
      let updatedDecks;
      let deckFound;
      let originalDecks;
      originalDecks = state.decks.filter(
        d => d.deckId !== action.payload.flashcard.deckId
      );
      deckFound = state.decks.filter(
        d => d.deckId === action.payload.flashcard.deckId
      );
      if (deckFound.length >= 1) {
        const notToUpdate = deckFound[0].flashcards.filter(
          f => f.flashcardId !== action.payload.flashcardId
        );
        updatedFlashcards = [...notToUpdate];
        updatedFlashcards.push(action.payload.flashcard);
        updatedDecks = [
          ...originalDecks,

          {
            deckId: action.payload.flashcard.deckId,
            flashcards: updatedFlashcards,
          },
        ];
      } else {
        updatedDecks = [
          {
            deckId: action.payload.flashcard.deckId,
            flashcards: [action.payload.flashcard],
          },
        ];
      }
      return { decks: updatedDecks || [] };
    },
    delete(state, action) {
      let updatedFlashcards;
      let updatedDecks;
      let deckFound;
      let originalDecks;
      deckFound = state.decks.filter(d => d.deckId === action.payload.deckId);
      updatedFlashcards = deckFound.filter(
        f => action.payload.flashcardId !== f.id
      );
      updatedDecks = [...updatedFlashcards];
      return { decks: updatedDecks || [] };
    },
  },
});

// const flashcardReducer = (state = { decks: [] }, action) => {
//   let updatedFlashcards;
//   let updatedDecks;
//   let deckFound;
//   let originalDecks;
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
//   return { decks: updatedDecks || [] };
// };

const authSlice = createSlice({
  name: "authentication",
  initialState: localStorage.getItem("userToken")
    ? { isAuthenticated: true }
    : { isAuthenticated: false },
  reducers: {
    login(state) {
      state.isAuthenticated = true;
    },
    logout(state) {
      state.isAuthenticated = false;
    },
  },
});

const store = configureStore({
  reducer: { deckState: deckSlice.reducer, authState: authSlice.reducer },
});

export const deckActions = deckSlice.actions;
export const authActions = authSlice.actions;

export default store;
