import axios from "axios";
import React, { useState } from "react";

const initialValues = {
  initialMessage: "",
  initialEmail: "",
  initialSteps: 0,
  initialIndex: 4,
};

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
  const [data, setData] = useState(initialValues);

  function getXY() {
    let index = data.initialIndex;
    return datas[index];
  }

  function getXYMesaj() {
    const koordinat = getXY();
    const x = koordinat.x;
    const y = koordinat.y;
    return `Koordinatlar (${x}, ${y})`;
  }

  function reset() {
    setData(initialValues);
  }

  function sonrakiIndex(id) {
    const indexA = data.initialIndex;
    if (id === "up" && indexA - 3 >= 0) {
      let index = indexA - 3;
      return index;
    } else if (id === "down" && indexA + 3 <= 8) {
      let index = indexA + 3;
      return index;
    } else if (
      (id === "right" && indexA >= 0 && indexA <= 2 && indexA + 1 <= 2) ||
      (id === "right" && indexA >= 3 && indexA <= 5 && indexA + 1 <= 5) ||
      (id === "right" && indexA >= 6 && indexA <= 8 && indexA + 1 <= 8)
    ) {
      let index = indexA + 1;
      return index;
    } else if (
      (id === "left" && indexA >= 0 && indexA <= 2 && indexA - 1 >= 0) ||
      (id === "left" && indexA >= 3 && indexA <= 5 && indexA - 1 >= 3) ||
      (id === "left" && indexA >= 6 && indexA <= 8 && indexA - 1 >= 6)
    ) {
      let index = indexA - 1;
      return index;
    }
  }

  function ilerle(evt) {
    const { id } = evt.target;
    if (sonrakiIndex(id) + 1) {
      let index = sonrakiIndex(id);
      const newData = { ...data };
      newData.initialMessage = ``;
      newData.initialIndex = index;
      newData.initialSteps += 1;
      setData(newData);
    } else {
      const newData = { ...data };
      newData.initialMessage = errorMessage[id];
      setData(newData);
    }
  }

  function onChange(evt) {
    const { value } = evt.target;
    const newData = { ...data };
    newData.initialEmail = value;
    setData(newData);
  }

  function onSubmit(evt) {
    evt.preventDefault();
    const { x, y } = getXY();
    const payload = {
      x: x,
      y: y,
      steps: data.initialSteps,
      email: data.initialEmail,
    };
    console.log(payload);

    axios
      .post("http://localhost:9000/api/result", payload)
      .then((response) => {
        setData({ ...data, ["initialMessage"]: response.data.message });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMesaj()}</h3>
        <h3 id="steps">{data.initialSteps} kere ilerlediniz</h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div
            key={idx}
            className={`square${idx === data.initialIndex ? " active" : ""}`}
          >
            {idx === data.initialIndex ? "B" : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{data.initialMessage}</h3>
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
          value={data.initialEmail}
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
