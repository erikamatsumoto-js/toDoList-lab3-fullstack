import { useEffect, useState } from "react";

function DadJoke() {
  const [jokes, setJokes] = useState();

  useEffect(() => {
    fetchDadJoke();
  }, []);

  async function fetchDadJoke() {
    const response = await fetch("/data/dad_jokes_365.json");
    const data = await response.json();
    console.log(data);
    setJokes(data);
  }

  return (
    <>
      <div>
        <h1>Daily JOke</h1>
        {Math.floor(Math.random() * length)}
        <p></p>
        <p></p>
      </div>
    </>
  );
}
export default DadJoke;
