import { useEffect, useState } from "react";

function App() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState("");
  const [finished, setFinished] = useState(false);

  // Fetch questions from Open Trivia DB API
  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=5&type=multiple")
      .then((res) => res.json())
      .then((data) => {
        // API ka data thoda complex hota hai, isliye simplify kar rahe hain
        const formatted = data.results.map((q) => {
          const options = [...q.incorrect_answers];
          const randIndex = Math.floor(Math.random() * (options.length + 1));
          options.splice(randIndex, 0, q.correct_answer); // random jagah pe correct ans daal diya

          return {
            question: q.question,
            options: options,
            answer: q.correct_answer,
          };
        });
        setQuestions(formatted);
      });
  }, []);

  if (questions.length === 0) {
    return <h2>Loading...</h2>;
  }

  const checkAnswer = () => {
    if (selected === questions[current].answer) {
      setScore(score + 1);
    }
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setSelected("");
    } else {
      setFinished(true);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>Quiz App (API)</h1>

      {finished ? (
        <h2>Your Score: {score} / {questions.length}</h2>
      ) : (
        <div>
          <h3 dangerouslySetInnerHTML={{ __html: questions[current].question }} />

          {questions[current].options.map((opt, i) => (
            <div key={i}>
              <label>
                <input
                  type="radio"
                  name="option"
                  value={opt}
                  checked={selected === opt}
                  onChange={(e) => setSelected(e.target.value)}
                />
                <span dangerouslySetInnerHTML={{ __html: opt }} />
              </label>
            </div>
          ))}

          <button
            onClick={checkAnswer}
            disabled={selected === ""}
            style={{ marginTop: "10px" }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
