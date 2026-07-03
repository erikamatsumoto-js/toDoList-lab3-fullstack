import { useEffect, useState } from "react";

function DadJoke() {
  const [jokes, setJokes] = useState<any[]>([]);

  useEffect(() => {
    fetchDadJoke();
  }, []);

  async function fetchDadJoke() {
    const response = await fetch("/data/dad_jokes_365.json");
    const data = await response.json();
    console.log(data);
    setJokes(data);
  }

  const randomJoke =
    jokes.length > 0 ? jokes[Math.floor(Math.random() * jokes.length)] : null;

  return (
    <>
      <div>
        <h2>Daily Joke</h2>
        {randomJoke && (
          <div>
            <p>{randomJoke.setup}</p>
            <p>{randomJoke.punchline}</p>
          </div>
        )}
      </div>
    </>
  );
}
export default DadJoke;
