import classes from "./MyDecks.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const MyDecks = () => {
  //TODO add styling to presentation of decks, and ability to click on them to edit
  // TODO add ability from this page to delete decks
  // TODO add error handling for all HTTP requests. Reference https://www.udemy.com/course/react-the-complete-guide-incl-redux/learn/lecture/25600366#overview
  const loggedInEmail = JSON.parse(localStorage.getItem("loggedInEmail"));
  const token = JSON.parse(localStorage.getItem("userToken"));
  const navigate = useNavigate();
  const [decks, setDecks] = useState(undefined);
  const [decksSet, toggleDecksSet] = useState(false);

  const deckClickHandler = deckId => {
    navigate(`/view/decks/${deckId}`);
  };

  const loadingContent =
    decksSet && decks.length === 0
      ? "No decks yet. Create your first!"
      : "Loading";

  useEffect(() => {
    const fetchDecks = async () => {
      await fetch(`http://localhost:3001/view/decks?email=${loggedInEmail}`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then(resp => resp.json())
        .then(data => {
          console.dir(data);
          setDecks(data);
        });
    };

    if (decks === undefined) {
      fetchDecks();
    }
    if (decks && decks.length !== undefined) {
      toggleDecksSet(true);
    }
  }, [decksSet, decks]);
  const content = (
    <>
      {decks !== undefined && decks.length > 0 ? (
        decks.map(deck => {
          const categories = deck.categories.join(", ");
          return (
            <div
              className={classes.deckContainer}
              onClick={() => deckClickHandler(deck.deckId)}
              key={uuidv4()}
            >
              {deck.categories.length > 0 ? categories : ""}
              <p>Deck title: {deck.deckTitle}</p>
              <div>
                <p> Created date: {deck.createdDate}</p>
              </div>
              <div>
                Deck id:
                {deck.deckId}
              </div>
            </div>
          );
        })
      ) : (
        <h5>Loading</h5>
      )}
    </>
  );
  return (
    <>
      {decksSet && decks.length === 0 ? (
        <h5>
          No decks yet. <a href="/decks/new">Add one?</a>
        </h5>
      ) : (
        <>{content}</>
      )}
    </>
  );
};

export default MyDecks;
