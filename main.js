const $ = (selector = '') => document.querySelector(selector)
const _$ = (element = HTMLElement, selector = '') => element.querySelector(selector)
const $$ = (selector = '') => document.querySelectorAll(selector)
const { format } = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'ARS', currencyDisplay : 'symbol' , maximumFractionDigits : 0})


// Header scroll behaviour
const header = $('header');

let actualScroll = 0

window.addEventListener('scroll', () => {
  const top = Math.min(-(window.scrollY - actualScroll + header.clientHeight), 0)

  if (window.scrollY > actualScroll) {
    actualScroll = window.scrollY
  }

  if (top === 0) {
    actualScroll = window.scrollY + header.clientHeight
  }

  header.setAttribute("style", `--_top-header:${top}px`);
  header.classList.toggle('active', window.scrollY < actualScroll)
  header.classList.toggle('clr', window.scrollY > header.clientHeight)


})

// Cotization behaviour

const problemasSelect = $("#problema")

fetch('./motivos.json')
  .then(response => response.json())
  .then(data => {
    let { values } = data
    values.shift()

    let options = []

    for (const arr of values) {

      let option = {}

      option.label = arr[0]
      option.value = `${arr[1]}&${arr[2]}`

      options.push(option)
    }


    options.map(option => {
      let optionElement = document.createElement('option')
      optionElement.text = option.label
      optionElement.value = option.value

      problemasSelect.append(optionElement)
    })



  })
  .catch(error => console.error('Error al cargar motivos:', error));

problemasSelect.addEventListener('change', () => {


  [min, max] = problemasSelect.value.split('&')

  _$($('#costos'), '.min').innerText = format(min)
  _$($('#costos'), '.max').innerText = format(max)



})

