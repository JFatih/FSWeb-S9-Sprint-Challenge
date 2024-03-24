import axios from "axios";
import React, { useState } from "react";

const datas = [
  { x: 1, y: 1 },
  { x: 2, y: 1 },
  { x: 3, y: 1 },
  { x: 1, y: 2 },
  { x: 2, y: 2 },
  { x: 3, y: 2 },
  { x: 1, y: 3 },
  { x: 2, y: 3 },
  { x: 3, y: 3 },
];

const errorMessage = {
  up: "Yukarıya gidemezsiniz",
  down: "Aşağıya gidemezsiniz",
  right: "Sağa gidemezsiniz",
  left: "Sola gidemezsiniz",
};
export default function AppFunctional(props) {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [steps, setSteps] = useState(0);
  const [index, setIndex] = useState(4);

  function getXY() {
    return datas[index];
  }

  function getXYMesaj() {
    const koordinat = getXY();
    const x = koordinat.x;
    const y = koordinat.y;
    return `Koordinatlar (${x}, ${y})`;
  }

  function reset() {
    setMessage("");
    setEmail("");
    setSteps(0);
    setIndex(4);
  }

  function sonrakiIndex(id) {
    if (id === "up" && index - 3 >= 0) {
      let indexA = index - 3;
      return indexA;
    } else if (id === "down" && index + 3 <= 8) {
      let indexA = index + 3;
      return indexA;
    } else if (
      (id === "right" && index >= 0 && index <= 2 && index + 1 <= 2) ||
      (id === "right" && index >= 3 && index <= 5 && index + 1 <= 5) ||
      (id === "right" && index >= 6 && index <= 8 && index + 1 <= 8)
    ) {
      let indexA = index + 1;
      return indexA;
    } else if (
      (id === "left" && index >= 0 && index <= 2 && index - 1 >= 0) ||
      (id === "left" && index >= 3 && index <= 5 && index - 1 >= 3) ||
      (id === "left" && index >= 6 && index <= 8 && index - 1 >= 6)
    ) {
      let indexA = index - 1;
      return indexA;
    }
  }

  function ilerle(evt) {
    const { id } = evt.target;
    if (sonrakiIndex(id) + 1) {
      let indexA = sonrakiIndex(id);
      setMessage("");
      setIndex(indexA);
      setSteps((prev) => prev + 1);
    } else {
      setMessage(errorMessage[id]);
    }
  }

  function onChange(evt) {
    const { value } = evt.target;
    setEmail(value);
  }

  function onSubmit(evt) {
    evt.preventDefault();
    let pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.match(pattern)) {
      const { x, y } = getXY();
      const payload = {
        x: x,
        y: y,
        steps: steps,
        email: email,
      };
      axios
        .post("http://localhost:9000/api/result", payload)
        .then((response) => {
          setMessage(response.data.message);
          console.log(response.data.message);
          setEmail("");
        })
        .catch((error) => {
          setMessage(error.response.data.message);
        });
    } else if (email === "") {
      setMessage("Ouch: email is required");
    } else if (!email.match(pattern)) {
      setMessage("Ouch: email must be a valid email");
    }
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMesaj()}</h3>
        <h3 id="steps">{steps} kere ilerlediniz</h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div key={idx} className={`square${idx === index ? " active" : ""}`}>
            {idx === index ? "B" : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button onClick={ilerle} id="left">
          SOL
        </button>
        <button onClick={ilerle} id="up">
          YUKARI
        </button>
        <button onClick={ilerle} id="right">
          SAĞ
        </button>
        <button onClick={ilerle} id="down">
          AŞAĞI
        </button>
        <button onClick={reset} id="reset">
          reset
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          value={email}
          id="email"
          type="email"
          placeholder="email girin"
          onChange={onChange}
        ></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  );
}
