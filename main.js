const $ = (selector = '') => document.querySelector(selector)
const _$ = (element = HTMLElement, selector = '') => element.querySelector(selector)
const $$ = (selector = '') => document.querySelectorAll(selector)
const { format } = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', currencyDisplay: 'code', maximumFractionDigits: 0 })


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

// Roadmap 

const guide_items = [...$$('.guia .guide-item .circle')]
let last_intersected = 0

const observer_guide_items = new IntersectionObserver((entries) => {



  entries.map((entry, i) => {

    if (entry.isIntersecting) {
      entry.target.classList.add('active')
      last_intersected = guide_items.indexOf(entry.target)    
    }

    if (last_intersected == 0) {
      guide_items.map((guide_item,i) => {
        if (i != 0) {
          guide_item.classList.remove('active')
        }
      })
    }





  })


}, { threshold: 1 });

guide_items.map(guide_item => observer_guide_items.observe(guide_item))



// Orbiting electrons

let t = 0
const electrons = $$('.electron')

function orbite(){
  t = Date.now() / 2000
  

  electrons.forEach((electron) => {

    const { delay, speed } = electron.dataset

    

    let posX = (Math.sin(t * speed - delay * 2) + 1) * 50
    let posY = (Math.cos(t * speed - delay * 2) + 1) * 50 

    let data = {
      left: `${posX}%`,
      top: `${posY}%`,
      "--_scale": Math.min((posY / 100) + 0.5, 1)
    }

    electron.setAttribute('style', Object.entries(data).map(([key, value]) => `${key}:${value}`).join(';'))
        
  })
  requestAnimationFrame(orbite)
}

orbite()