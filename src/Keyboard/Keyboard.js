import React, { useState, useEffect } from 'react'
import './Keyboard.scss'

import {CapsLock,Space,Delete,Clear,Prev,Next,Enter} from './SVG.jsx'

let upperCase = false
let isLetters = true

let letters = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  '!',
  ',',
  '.',
  '@',
]
let numbers = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '0',
  ':',
  ';',
  '<',
  '=',
  '>',
  '?',
  '/',
  '#',
  '+',
  '"',
  // `@`,
  '$',
  '%',
  '&',
  "'",
  '(',
  ')',
  '*',
  '_',
  '-',
  '~',
]

const TVKeyboard = (props) => {
  //POSITION OF MOVER
  const [position, setPosition] = useState(0)
  const [writePosition, setWritePosition] = useState(props.value.length)
  //KEYS
  const [keys, setKeys] = useState([
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    '!',
    ',',
    '.',
    '@',
  ])

  useEffect(() => {
    if (props.numbers) {
      setKeys(numbers)
      isLetters = false
    }
  }, [props.numbers])

  useEffect(() => {
    const mover = (e) => {
      switch (e.keyCode) {
        //RIGHT ARROW
        case 39:
          if(position === 100) writePosition < props.value.length && setWritePosition((p) => p + 1) 
         else if (position === 9 || position === 19 || position === 29)
            setPosition((p) => p - 9)
          else if (position === 34) setPosition(30)
          else if (position === 37) setPosition(35)
          else if (position < 37) setPosition((p) => p + 1)
          break
        //LEFT ARROW
        case 37:
          if(position === 100) writePosition > 0 && setWritePosition((p) => p - 1) 
          else if (position % 10 === 0 && position < 21) setPosition((p) => p + 9)
          else if (position === 30) setPosition(34)
          else if (position === 35) setPosition(37)
          else if (position > 0) setPosition((p) => p - 1)
          break
        //DOWN ARROW
        case 40:
          if (position < 20) setPosition((p) => p + 10)
          else if (position < 22) setPosition(30)
          else if (position === 22) setPosition(31)
          else if (position < 26) setPosition(32)
          else if (position < 28) setPosition(33)
          else if (position < 30) setPosition(34)
          else if (position < 32) setPosition(35)
          else if (position < 33) setPosition(36)
          else if (position < 35) setPosition(37)
          else if(position === 100) setPosition(0)
          break
        //UP ARROW
        case 38:
          if (position === 37) setPosition(34)
          else if (position === 36) setPosition(32)
          else if (position === 35) setPosition(30)
          else if (position === 34) setPosition(29)
          else if (position === 33) setPosition(27)
          else if (position === 32) setPosition(24)
          else if (position === 31) setPosition(22)
          else if (position > 9) setPosition((p) => p - 10)
          else setPosition(100)
          break
        //ENTER
        case 13:
          if (position < 30) addToText(keys[position])
          actions(position - 30)
          if (position === 37) close()
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', mover)

    return () => window.removeEventListener('keydown', mover)
  })

  const actions = (code) => {
    if (code === 0) transformKeys()
    else if (code === 1) numberHandler()
    else if (code === 2) addToText(`\xa0`)
    else if (code === 3) deleteFromText()
    else if (code === 4) clearText()
    else if (code === 5 && writePosition > 0) setWritePosition((p) => p - 1)
    else if (code === 6 && writePosition < props.value.length)
      setWritePosition((p) => p + 1)
  }

  const close = (e) => {
    setTimeout(() => {
      props.close()
    }, 1)
  }

  const numberHandler = () => {
    if (isLetters) {
      setKeys(numbers)
    } else {
      setKeys(letters)
    }
    isLetters = !isLetters
  }

  const transformKeys = () => {
    if (isLetters) {
      const updatedKeys = keys.map((key) =>
        upperCase ? key.toLowerCase() : key.toUpperCase(),
      )
      upperCase = !upperCase
      setKeys(updatedKeys)
    }
  }

  const addToText = (letter) => {
    setWritePosition((p) => p + 1)
    props.handler(
      props.value.slice(0, writePosition) +
        letter +
        props.value.slice(writePosition),
    )
  }

  const deleteFromText = () => {
    writePosition > 0 && setWritePosition((p) => p - 1)
    props.handler(
      props.value.slice(0, writePosition).slice(0, -1) +
        props.value.slice(writePosition),
    )
  }

  const clearText = () => {
    setWritePosition(0)
    props.handler('')
  }

  //MAPING KEYS TO KEYPADS
  const keypads = keys.map((key, index) => (
    <div
      key={key}
      style={{
        background: position === index ? props.colors[2] : props.colors[1],
      }}
      onMouseOver={() => setPosition(index)}
      onClick={() => addToText(key)}
      className="key"
    >
      {key}
    </div>
  ))


  return (
    <div className="TVKeyboard">
      <div className="overlay"></div>
      <div className="keyboard" style={{ background: props.colors[0] }}>
        <div className="header" style={{ background: props.colors[1] }}>
          <img src={props.logo} alt="TV Keyboard" />
        </div>

        <div className="container">
          <div className="input">
            <p>{props.text}</p>
            <div className="value" style={{ borderColor: position === 100 ? props.colors[2] : props.colors[1] }}>
              <span>{props.value.slice(0, writePosition)}</span>
              <div className="show">|</div>
              <span>{props.value.slice(writePosition)}</span>
            </div>
          </div>

          <div className="keypads">
            {keypads}
            {/* {mainKeypads} */}
            <div
              key={0}
              style={{
                background:
                  position === 30
                    ? props.colors[2]
                    : props.colors[1] + 'bb',
              }}
              onClick={() => actions(0)}
              onMouseOver={() => setPosition(30)}
              className='key CAPS'
            >
              <CapsLock />
              CAPS
            </div>
            <div
              key={1}
              style={{
                background:
                  position === 31
                    ? props.colors[2]
                    : props.colors[1] + 'bb',
              }}
              onClick={() => actions(1)}
              onMouseOver={() => setPosition(31)}
              className='key'
            >
              123
            </div>
            <div
              key={2}
              style={{
                background:
                  position === 32
                    ? props.colors[2]
                    : props.colors[1] + 'bb',
              }}
              onClick={() => actions(2)}
              onMouseOver={() => setPosition(32)}
              className='key SPACE'
            >
              <Space />
              SPACE
            </div>
            <div
              key={3}
              style={{
                background:
                  position === 33
                    ? props.colors[2]
                    : props.colors[1] + 'bb',
              }}
              onClick={() => actions(3)}
              onMouseOver={() => setPosition(33)}
              className='key DELETE'
            >
              <Delete />
              DELETE
            </div>
            <div
              key={4}
              style={{
                background:
                  position === 34
                    ? props.colors[2]
                    : props.colors[1] + 'bb',
              }}
              onClick={() => actions(4)}
              onMouseOver={() => setPosition(34)}
              className='key CLEAR'
            >
              <Clear />
              CLEAR
            </div>
            <div
              key={5}
              style={{
                background:
                  position === 35
                    ? props.colors[2]
                    : props.colors[1] + 'bb',
              }}
              onClick={() => actions(5)}
              onMouseOver={() => setPosition(35)}
              className={'key PREV'}
            >
              <Prev />
              PREV
            </div>
            <div
              key={6}
              style={{
                background:
                  position === 36
                    ? props.colors[2]
                    : props.colors[1] + 'bb',
              }}
              onClick={() => actions(6)}
              onMouseOver={() => setPosition(36)}
              className={'key NEXT'}
            >
              NEXT
              <Next />
            </div>
            <div
              className="key ENTER"
              style={{
                background:
                  position === 37 ? props.colors[2] : props.colors[1] + '66',
              }}
              onMouseOver={() => setPosition(37)}
              onClick={() => close()}
            >
              ENTER
              <Enter />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TVKeyboard
