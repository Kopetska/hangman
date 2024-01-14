const pairs = [
  [
    "This saves a value, which can be then assigned when writing code",
    "VARIABLE",
  ],
  ["Which keyword do we need to define a function?", "FUNCTION"],
  [
    "This data type represents both integer and floating point numbers",
    "NUMBER",
  ],
  ["This data type exists to store ordered collections", "ARRAY"],
  ["This data type is commonly used to store yes/no values", "BOOLEAN"],
  ["The meaning of this data type is 'value is not assigned'", "UNDERFINED"],
  [
    "The variable listed inside the parentheses in the function declaration",
    "PARAMETER",
  ],
  ["The value that is passed to the function when it is called", "ARGUMENT"],
  ["This property returns the length (size) of an array", "LENGTH"],
  ["This method joins all array elements into a string", "JOIN"],
  ["This method adds a new element to an array (at the end)", "PUSH"],
  [
    "This method creates a new array with array elements that pass a test",
    "FILTER",
  ],
];

let index = 0;

function makeBasicMarkup() {
  const randomPair = pairs[Math.floor(Math.random() * pairs.length)];

  index = pairs.indexOf(randomPair);

  const markup = `<main>
        <div class="container">
            <h1 class="title">Hangman game</h1>
       <div class="game">
             <img class="gallows-img" src="./images/hangman-0.svg" alt="Gallows">
<div class="content">
<div class="word-container">
<div class="word"></div>
</div>
    <p class="hint">Hint: <span class="hint-question"> </span></p>
    <p class="guesses">Incorrect guesses: <span class="incorrect-attempt"> 0</span><span class="backslash"> /</span><span class="total-attempt"> 6</span></p>
    <ul class="virtual-keyboard">${makeVirtualKeyboard()}</ul>
       </div>
       </div>
        <div class="backdrop js-is-hidden">
        <div class="modal">
            <img class="modal-face-icon" src="./images/face-smile-regular.svg" alt="Face icon">
            <p class="modal-title"></p>
            <p class="modal-description">You found the word:</p>
            <p class="modal-proper-word"></p>
            <button class="modal-button">Play again</button>
        </div>
    </div>
        </div>
    </main>`;

  document.body.insertAdjacentHTML("afterbegin", markup);

  document.querySelector(".hint-question").textContent = randomPair[0];

  const wordToGuess = document.querySelector(".word");

  let lodashes = "";

  for (let i = 0; i < randomPair[1].length; i++) {
    lodashes += "_";
  }

  wordToGuess.textContent = lodashes;

  const keyboard = document.querySelector(".virtual-keyboard");
  keyboard.addEventListener("click", goGameKeyboard);

  console.log(`The secret word is ${pairs[index][1]}`);
}

function makeVirtualKeyboard() {
  const chars = [
    "Q",
    "W",
    "E",
    "R",
    "T",
    "Y",
    "U",
    "I",
    "O",
    "P",
    "A",
    "S",
    "D",
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
    "Z",
    "X",
    "C",
    "V",
    "B",
    "N",
    "M",
  ];

  return chars
    .map((char) => {
      return `<li class="keyboard-item"><button class="keyboard-button" type="button">${char}</button></li>`;
    })
    .join("");
}

makeBasicMarkup();

const maxAttempts = 6;

const keyboard = document.querySelector(".virtual-keyboard");

let wrongGuessCount = 0;

function goGameKeyboard(event) {
  if (event.target.nodeName !== "BUTTON") {
    return;
  }

  let currentWord = pairs[index][1];

  const incorrectCounter = document.querySelector(".incorrect-attempt");
  const gallowsImage = document.querySelector(".gallows-img");
  const wordDisplay = document.querySelector(".word");
  const wordDisplayArray = wordDisplay.textContent.split("");

  event.target.classList.add("js-button-disabled");

  let guessedChar = event.target.textContent;

  let indexOfGuessedChar = currentWord.indexOf(guessedChar);

  if (
    wrongGuessCount === maxAttempts ||
    wordDisplay.textContent === currentWord
  ) {
    openModal();
    return;
  } else {
    if (indexOfGuessedChar !== -1) {
      wordDisplayArray.map((item, index, array) => {
        if (currentWord[index] === guessedChar) {
          array[index] = guessedChar;
        }
        return wordDisplayArray;
      });
    } else {
      wrongGuessCount += 1;
      incorrectCounter.textContent = wrongGuessCount;
      gallowsImage.src = `./images/hangman-${wrongGuessCount}.svg`;
    }

    wordDisplay.textContent = wordDisplayArray.join("");
  }

  if (
    wrongGuessCount === maxAttempts ||
    wordDisplay.textContent === currentWord
  ) {
    openModal();
  }
}

const backdrop = document.querySelector(".backdrop");
const modal = document.querySelector(".modal");

const modalImage = document.querySelector(".modal-face-icon");
const modalTitle = document.querySelector(".modal-title");
const modalDescription = document.querySelector(".modal-description");
const modalProperWord = document.querySelector(".modal-proper-word");
const modalButton = document.querySelector(".modal-button");

function openModal() {
  backdrop.classList.toggle("js-is-hidden");

  if (wrongGuessCount === 6) {
    modal.classList.remove("js-correct");
    modal.classList.add("js-incorrect");
    modalImage.src = "./images/face-sad-tear-regular.svg";
    modalTitle.textContent = "Game Over!";
    modalDescription.textContent = "The correct word was: ";
    modalProperWord.innerHTML = pairs[index][1];
  } else {
    modal.classList.remove("js-incorrect");
    modal.classList.add("js-correct");
    modalImage.src = "./images/face-smile-regular.svg";
    modalTitle.textContent = "Congratulations!";
    modalDescription.textContent = "You found the word: ";
    modalProperWord.innerHTML = pairs[index][1];
  }

  modalButton.addEventListener("click", resetGame);
}

function resetGame() {
  backdrop.classList.toggle("js-is-hidden");
  wrongGuessCount = 0;

  document.body.innerHTML = `<script src="./index.js" type="module"></script>`;

  makeBasicMarkup();

  keyboard.addEventListener("click", goGameKeyboard);
  document.addEventListener("keydown", onRealKeyboardGame);
}

function onRealKeyboardGame(event) {
  let currentWord = pairs[index][1];

  const incorrectCounter = document.querySelector(".incorrect-attempt");
  const gallowsImage = document.querySelector(".gallows-img");
  const wordDisplay = document.querySelector(".word");
  const wordDisplayArray = wordDisplay.textContent.split("");

  const buttonsKeys = document.querySelectorAll(".keyboard-button");

  let guessedChar = event.key.toUpperCase();

  buttonsKeys.forEach((key) => {
    if (key.textContent === guessedChar) {
      key.classList.add("js-button-disabled");
    }
  });

  let indexOfGuessedChar = currentWord.indexOf(guessedChar);

  if (
    wrongGuessCount === maxAttempts ||
    wordDisplay.textContent === currentWord
  ) {
    openModal();
    return;
  } else {
    if (indexOfGuessedChar !== -1) {
      wordDisplayArray.map((item, index, array) => {
        if (currentWord[index] === guessedChar) {
          array[index] = guessedChar;
        }
        return wordDisplayArray;
      });
    } else {
      wrongGuessCount += 1;
      incorrectCounter.textContent = wrongGuessCount;
      gallowsImage.src = `./images/hangman-${wrongGuessCount}.svg`;
    }

    wordDisplay.textContent = wordDisplayArray.join("");
  }

  if (
    wrongGuessCount === maxAttempts ||
    wordDisplay.textContent === currentWord
  ) {
    openModal();
  }
}

document.addEventListener("keydown", onRealKeyboardGame);
