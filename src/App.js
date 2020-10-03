import React, { useState } from "react";
import "./App.scss";

import Keyboard from "./Keyboard/Keyboard";
import Logo from './logo_big.png'

function App() {
  const [text, setText] = useState("");
  const [showModal, setShowModal] = useState(false);

  const textHandler = (property) => {
    setText(property);
  };

  return (
    <div className="App">
      <button onClick={() => setShowModal(true)}>Open Modal</button>
      <h1 style={{ textAlign: "center" }}>{text}</h1>
      {showModal ? (
        <Keyboard
          logo={Logo}
          colors={["#282828", "#848484", "#01A2D8"]}
          text="Korisnicko ime:"
          value={text}
          handler={textHandler}
          // numbers
          close={() => setShowModal(false)}
        />
      ) : null}
    </div>
  );
}

export default App;
