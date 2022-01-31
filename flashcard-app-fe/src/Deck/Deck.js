import { useParams } from "react-router-dom";

const Deck = ({ match }) => {
  const params = useParams();
  return <h5>Deck {params.id}</h5>;
};

export default Deck;
