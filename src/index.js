const paragraphPassword = document.querySelector("#password"),
      form = document.querySelector("#form"),
      checkbox = [...document.querySelectorAll(".checkbox")],
      buttonCopy = document.querySelector("#button-copy"),
      inputLength = document.querySelector("#input__length"),
      passwordLengthParagraph = document.querySelector("#password__length"),
      tooltip = document.querySelector(".toolTipText");

const API = "https://goquotes-api.herokuapp.com/api/v1/random?count=5";

const letters = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
const regLetter = /^[a-zA-Z ',.]+$/g;

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
const symbols = ["'", ":", "!", "@", "#", "$", "^", ")", "&", "*", "%", "-"];
let words = [];
let myChecks = ['letters'];

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

/*------------- tooltip Hidden------------------- */

function AnimatedTooltip (){
  tooltip.classList.add("show__tooltip");
  
  setTimeout(()=>{
    tooltip.classList.remove("show__tooltip")
  },3000);
}


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
    
    AnimatedTooltip();
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

/*--------------------- Valid Check------------------ */

checkbox.map( check => {
  check.addEventListener('click', ()=>{
    
      if(check.checked ) myChecks.push(check.name) 
      else
      {
        myChecks.length > 1 ? myChecks = myChecks.filter((item) => item !== check.name)
        : check.checked = true;
      } 
  
    console.log(myChecks)
  })
})


/**------------------EVENT COPY------------------------ */

buttonCopy.addEventListener("click", () => {
  if (!navigator.clipboard) alert('¡Tu navegador no soporta la API Asíncrona del Portapapeles!')
  copyToClipboard("#password");
});

/*---------------SLIDER----------------------------------*/

var slider = inputLength.oninput = function(){

  let value = (this.value - this.min) / (this.max - this.min) * 100;

  this.style.background = 'linear-gradient(to right, #40abe9 0%, #cc298def ' + value +'%, #ffffff '+ value +'%, #ffffff 100%)';
  this.nextElementSibling.value=this.value;

}



