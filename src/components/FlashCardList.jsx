// src/components/FlashCardList.jsx
import FlashCard from "./FlashCard";
import { cards } from "../data/cards";

const FlashCardList = () => {
  return (
    <div className="flex flex-wrap justify-center mt-10">
      {cards.map((card) => (
        <FlashCard
          key={card.id}
          title={card.title}
          description={card.description}
          details={card.details}
        />
      ))}
    </div>
  );
};

export default FlashCardList;
