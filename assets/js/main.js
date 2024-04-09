const $time = document.querySelector('time')
const $paragraph = document.querySelector('p')
const $input = document.querySelector('input')

const INITIAL_TIME = 1000 // Diseñar un input que permita elegir entre distintos tiempos de multiplicando por dos al anterior valor, max hasta 2min

const TEXT =
  'En un valle tranquilo, rodeado de altas montañas y ríos cristalinos, vivía una comunidad de animales que trabajaban juntos en armonía. Cada mañana, el sol se asomaba por encima de los picos nevados, bañando el valle con una luz dorada que despertaba a sus habitantes.'

let words = []

let currentTime = INITIAL_TIME

InitGame()
InitEvents()

function InitGame() {
  words = TEXT.split(' ').slice(0, 32) //Hacer un select para elegir la cantidad de palabras a mostrar en el DOM
  currentTime = INITIAL_TIME

  $time.textContent = currentTime

  $paragraph.innerHTML = words
    .map((word, index) => {
      const letters = word.split('')

      return `<p-word>
        ${letters.map((letter) => `<p-letter>${letter}</p-letter>`).join('')}
        </p-word>
        `
    })
    .join('')

  const $firstWord = $paragraph.querySelector('p-word')
  $firstWord.classList.add('active')
  $firstWord.querySelector('p-letter').classList.add('active')

  const intervalId = setInterval(() => {
    currentTime--
    $time.textContent = currentTime

    if (currentTime === 0) {
      clearInterval(intervalId)
      GameOver()
    }
  }, 1000)
}

function InitEvents() {
  document.addEventListener('keydown', () => {
    $input.focus()
  })
  $input.addEventListener('keydown', onkeydown)
  $input.addEventListener('keyup', onkeyup)
}

function onkeyup() {
  // Recuperamos los elementos actuales
  const $currentWord = $paragraph.querySelector('p-word.active')
  const $currentLetter = $paragraph.querySelector('p-letter.active')

  const currentWord = $currentWord.innerText.trim()
  $input.maxLength = currentWord.length

  const $allLetters = $currentWord.querySelectorAll('p-letter')

  $allLetters.forEach(($letter) => $letter.classList.remove('valid', 'invalid'))

  $input.value.split('').forEach((char, index) => {
    const $letter = $allLetters[index]
    const letterToCheck = currentWord[index]

    const isCorrect = char === letterToCheck
    const letterClass = isCorrect ? 'valid' : 'invalid'
    $letter.classList.add(letterClass)
  })

  $currentLetter.classList.remove('active', 'is-last')
  const inputLength = $input.value.length
  const $nextActiveLetter = $allLetters[inputLength]

  if ($nextActiveLetter) {
    $nextActiveLetter.classList.add('active')
  } else {
    $currentLetter.classList.add('active', 'is-last')
  }
}

function onkeydown(event) {
  const $currentWord = $paragraph.querySelector('p-word.active')
  const $currentLetter = $paragraph.querySelector('p-letter.active')

  const { key } = event
  if (key === ' ') {
    event.preventDefault()

    const $nextWord = $currentWord.nextElementSibling
    const $nextLetter = $nextWord.querySelector('p-letter')

    $currentWord.classList.remove('active', 'invalid')
    $currentLetter.classList.remove('active')

    $nextWord.classList.add('active')
    $nextLetter.classList.add('active')

    $input.value = ''

    const incompleteWord =
      $currentWord.querySelectorAll('p-letter:not(.valid)').length > 0

    const classToAdd = incompleteWord ? 'invalid' : 'valid'

    $currentWord.classList.add(classToAdd)
  }
}

function GameOver() {
  $paragraph.innerHTML = 'Game Over'
}
