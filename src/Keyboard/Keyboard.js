import React, { useState, useEffect } from "react";
import "./Keyboard.scss";

let upperCase = false;
let isLetters = true;

let letters = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "!",
    ",",
    ".",
    "@"
]
let numbers = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
    ':',
    ";",
    "<",
    "=",
    ">",
    "?",
    "/",
    "#",
    "+",
    '"',
    // `@`,
    "$",
    "%",
    "&",
    "'",
    "(",
    ")",
    "*",
    "_",
    "-",
    "~"
]
let mainNumbers = [
    "CAPS",
    "abc",
    "SPACE",
    "DELETE",
    "CLEAR",
    "PREV",
    "NEXT",
]
let mainLetters = [
    "CAPS",
    "123",
    "SPACE",
    "DELETE",
    "CLEAR",
    "PREV",
    "NEXT",
]


const TVKeyboard = (props) => {
  //POSITION OF MOVER
  const [position, setPosition] = useState(0);
  //   const [upperCase,setUpperCase] = useState(false)
  const [writePosition,setWritePosition] = useState(props.value.length);
  //KEYS
  const [keys, setKeys] = useState([
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "!",
    ",",
    ".",
    "@",
  ]);
  const [mainKeys, setMainKeys] = useState([
    "CAPS",
    "123",
    "SPACE",
    "DELETE",
    "CLEAR",
    "PREV",
    "NEXT",
  ]);

  useEffect(() => {
    props.numbers && setKeys(numbers)
    isLetters = false
  },[props.numbers])


  useEffect(() => {
    const mover = (e) => {
      switch (e.keyCode) {
        //RIGHT ARROW
        case 39:
          if (position === 9 || position === 19 || position === 29)
            setPosition((p) => p - 9);
          else if (position === 34) setPosition(30);
          else if (position === 37) setPosition(35);
          else if (position < 37) setPosition((p) => p + 1);
          break;
        //LEFT ARROW
        case 37:
          if (position % 10 === 0 && position < 21) setPosition((p) => p + 9);
          else if (position === 30) setPosition(34);
          else if (position === 35) setPosition(37);
          else if (position > 0) setPosition((p) => p - 1);
          break;
        //DOWN ARROW
        case 40:
          if (position < 20) setPosition((p) => p + 10);
          else if (position < 22) setPosition(30);
          else if (position === 22) setPosition(31);
          else if (position < 26) setPosition(32);
          else if (position < 28) setPosition(33);
          else if (position < 30) setPosition(34);
          else if (position < 32) setPosition(35);
          else if (position < 33) setPosition(36);
          else if (position < 35) setPosition(37);
          break;
        //TOP ARROW
        case 38:
          if (position === 37) setPosition(34);
          else if (position === 36) setPosition(32);
          else if (position === 35) setPosition(30);
          else if (position === 34) setPosition(29);
          else if (position === 33) setPosition(27);
          else if (position === 32) setPosition(24);
          else if (position === 31) setPosition(22);
          else if (position > 9) setPosition((p) => p - 10);
          break;
        //ENTER
        case 13:
          if (position < 30) addToText(keys[position]);
          else if (position === 30) transformKeys();
          else if (position === 31) numberHandler();
          else if (position === 32) addToText(`\xa0`);
          else if (position === 33) deleteFromText();
          else if (position === 34) clearText();
          else if (position === 35 && writePosition > 0) setWritePosition(p => p-1) 
          else if (position === 36 && writePosition < props.value.length) setWritePosition(p => p+1) 
          else if (position === 37) close()
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", mover);

    return () => window.removeEventListener("keydown", mover);
  });

  const close = (e) => {
      setTimeout(() => {
          props.close()
      },1)
  }

  const numberHandler = () => {
      if(isLetters){
          setKeys(numbers)
          setMainKeys(mainNumbers)
      }else {
        setKeys(letters)
        setMainKeys(mainLetters)
      }
      isLetters = !isLetters;
     
  }

  const transformKeys = () => {
      if(isLetters){
    const updatedKeys = keys.map((key) =>
      upperCase ? key.toLowerCase() : key.toUpperCase()
    );
    //   setUpperCase(true)
    upperCase = !upperCase
    setKeys(updatedKeys);
      }
  };

  const addToText = (letter) => {
    setWritePosition(p => p+1)
    props.handler(props.value + letter);
  };

  const deleteFromText = () => {
     writePosition > 0 && setWritePosition(p => p-1)
    props.handler(props.value.slice(0, -1));
  };

  const clearText = () => {
      setWritePosition(0)
      props.handler('')
  }

  //MAPING KEYS TO KEYPADS
  const keypads = keys.map((key, index) => (
    <div
      key={key}
      style={{
        background:
          position === index ? props.colors[1] + "77" : props.colors[1],
      }}
      onMouseOver={() => setPosition(index)}
      className="key"
    >
      {key}
    </div>
  ));

  const mainKeypads = mainKeys.map((key, index) => (
    <div
      key={key}
      style={{
        background:
          position === index + 30 ? props.colors[1] + "77" : props.colors[1],
      }}
      onMouseOver={() => setPosition(index + 30)}
      className={"key " + key}
    >
      {key}
    </div>
  ));

  return (
    <div className="TVKeyboard" >
        <div className="overlay"></div>
        <div className="keyboard" style={{ background: props.colors[0] }}>
      <div className="header" style={{ background: props.colors[1] }}></div>

      <div className="container">
        <div className="input">
          <p>{props.text}</p>
          <div className="value" style={{ borderColor: props.colors[1] }}>
            <span>{props.value.slice(0,writePosition)}</span> 
            <div className="show">|</div>
            <span>{props.value.slice(writePosition)}</span> 
          </div>
        </div>

        <div className="keypads">
          {keypads}
          {mainKeypads}
          <div
            className="key ENTER"
            style={{
              background:
                position === 37 ? props.colors[2] + "77" : props.colors[2],
            }}
            onMouseOver={() => setPosition(37)}
          >
            ENTER
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default TVKeyboard;
