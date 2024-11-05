// src/components/FlashCardSection.jsx
import FlashCard from "./FlashCard";

const FlashCardSection = ({ title, subjects }) => {
  return (
    <section className="my-8">
      <h2 className="text-2xl font-bold text-center mb-6">{title}</h2>
      {subjects.map((subject, index) => (
        <div key={index} className="mb-8">
          <h3 className="text-xl font-semibold mb-4">{subject.subject}</h3>
          <div className="flex flex-wrap justify-center">
            {subject.topics.map((topic, idx) => (
              <FlashCard key={idx} title={topic.title} description={topic.description} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default FlashCardSection;
