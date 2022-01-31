import { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import classes from "./AddNewDeck.module.css";
import AddNewFlashcardForm from "./AddNewFlashcardForm";
import FlashcardContext from "../Store/flashcard-context";
import Flashcard from "../Flashcard/Flashcard";
import { v4 as uuidv4 } from "uuid";
import { useSelector, useDispatch } from "react-redux";

const AddNewDeck = props => {
  const navigate = useNavigate();
  const { state } = useLocation();
  if (state.deckName === undefined || state.deckName === "") navigate("/decks");
  // also needs to load cards that are already created
  // TODO I want this to require you to save the deck before actually saving anything to the database. Could do this by having a preliminary component that loads with an overlay to have you select the name of the deck. Then the name of the deck gets passed to the AddNewDeck component.
  let decks = useSelector(state => {
    return state.deckState.decks;
  });
  const [deckId, setDeckId] = useState(undefined);
  const [deckAdded, toggleDeckAdded] = useState(false);
  const token = JSON.parse(localStorage.getItem("userToken"));

  useEffect(() => {
    const addDeckToDb = async () => {
      if (!deckAdded) {
        const res = await fetch("http://localhost:3001/create/deck", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            _id: uuidv4(),
            createdByEmail: localStorage.getItem("loggedInEmail"),
            deckTitle: state.deckName,
            flashcards: [],
          }),
        }).then(res => {
          return res.json();
        });
        decks = [...decks, { deckId: res.insertedId, flashcards: [] }];
        toggleDeckAdded(true);
        setDeckId(res.insertedId);
      }
    };
    addDeckToDb();
  }, []);
  const deck = decks.filter(d => d.deckId === deckId);
  return (
    <>
      <h1>Edit New Deck - {state.deckName}</h1>
      <AddNewFlashcardForm deckId={deckId} />
      <section>
        {deck.length
          ? deck[0].flashcards.map(flashcard => {
              return (
                <>
                  <Flashcard
                    term={flashcard.term}
                    definition={flashcard.definition}
                    id={flashcard.flashcardId}
                    deckId={deckId}
                    key={flashcard.flashcardId}
                  />
                </>
              );
            })
          : ""}
      </section>
    </>
  );
};

export default AddNewDeck;
