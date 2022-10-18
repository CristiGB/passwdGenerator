const paragraphPassword = document.querySelector("#password");
const form = document.querySelector("#form");
const buttonCopy = document.querySelector("#button-copy");
const inputLength = document.querySelector("#input-length");
const passwordLengthParagraph = document.querySelector("#password-length");

const API = "https://goquotes-api.herokuapp.com/api/v1/random?count=5";

const letters = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
const regLetter = /^[a-zA-Z ',.]+$/g;

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
const symbols = ["'", ":", "!", "@", "#", "$", "^", ")", "&", "*", "%", "-"];
let words = [];

/**----------------- Generar Password ------------------------ */


function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1));
}


function generatePassword(passwordLength, botonsitos) {
  let arrayOfArrays = [];

  if (botonsitos.letters) {
    arrayOfArrays.push(letters);
  }

  if (botonsitos.numbers) {
    arrayOfArrays.push(numbers);
  }

  if (botonsitos.symbols) {
    arrayOfArrays.push(symbols);
  }

  if (botonsitos.words) {
    //arrayOfArrays = [];
    arrayOfArrays.push(words);
  }

  let strongPassword = [];
  for (let i = 0; i < passwordLength; i++) {
    const myArr = arrayOfArrays[getRandomNumber(0, arrayOfArrays.length - 1)];

    const randomCharacter = myArr[getRandomNumber(0, myArr.length - 1)];

    strongPassword.push(randomCharacter);
  }
  strongPassword = strongPassword.join("");
  paragraphPassword.value = strongPassword;
}

/**----------------- API ------------------------ */

function fetchData(API) {
  fetch(API)
    .then((response) => response.json())
    .then((data) => {
      words = data.quotes.map((quote) => quote.text);
      words = words.join("").split(" ").sort();
    });
}

fetchData(API);

/**----------------- Clipboard API ------------------------ */

async function copyToClipboard(target) {
  const element = document.querySelector(target);
  const value = element.value;
  if (value.length === 0) {
    alert("Tienes que generar una contraseña");
  } else {
    try {
      await navigator.clipboard.writeText(value);
    } catch (error) {
      console.log(`Ocurrió un error: ${error}`);
    }
    alert("Copiaste la contraseña");
  }
}

/**------------------EVENT FORM------------------------ */


form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formElement = event.target;
  const passwordLength = formElement.length.value;
  const checks = {
    letters: formElement.letters.checked,
    words: formElement.words.checked,
    numbers: formElement.numbers.checked,
    symbols: formElement.symbols.checked,
  };
  if (checks.words) {
    formElement.letters.checked = false;
  }

  generatePassword(passwordLength, checks);
  buttonCopy.disabled = false;
});

/**------------------EVENT COPY------------------------ */

buttonCopy.addEventListener("click", () => {
  if (!navigator.clipboard) alert('¡Tu navegador no soporta la API Asíncrona del Portapapeles!')
  copyToClipboard("#password");
});
