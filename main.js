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



// Código de órbitas animadas eliminado - ahora usamos diseño estático
// La sección "Presentación" ahora usa un diseño estático profesional con efectos hover

// Mobile Navigation Toggle
const navToggle = $('.nav-toggle')
const nav = $('nav')
const navLinks = [...$$('nav a')]

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true'

    // Toggle estados
    navToggle.setAttribute('aria-expanded', !isOpen)
    nav.classList.toggle('nav-open')
    header.classList.toggle('nav-active')

    // Prevenir scroll cuando el menú está abierto
    document.body.style.overflow = !isOpen ? 'hidden' : ''
  })

  // Los links ahora se manejan con el smooth scroll más abajo
  // (Combinado para evitar conflictos)

  // Cerrar menú al hacer click en el overlay
  header.addEventListener('click', (e) => {
    if (header.classList.contains('nav-active') && e.target === header) {
      navToggle.setAttribute('aria-expanded', 'false')
      nav.classList.remove('nav-open')
      header.classList.remove('nav-active')
      document.body.style.overflow = ''
    }
  })

  // Cerrar menú con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('nav-open')) {
      navToggle.setAttribute('aria-expanded', 'false')
      nav.classList.remove('nav-open')
      header.classList.remove('nav-active')
      document.body.style.overflow = ''
    }
  })
}

// Smooth Scroll personalizado más lento
const smoothScrollTo = (target, duration = 1800) => {
  const targetElement = $(target)
  if (!targetElement) return

  // Respetar preferencias de accesibilidad
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) {
    targetElement.scrollIntoView({ block: 'start' })
    return
  }

  const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 80
  const startPosition = window.pageYOffset
  const distance = targetPosition - startPosition
  let startTime = null

  // Easing function para animación suave (ease-in-out-cubic)
  const easeInOutCubic = (t) => {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
  }

  const animation = (currentTime) => {
    if (startTime === null) startTime = currentTime
    const timeElapsed = currentTime - startTime
    const progress = Math.min(timeElapsed / duration, 1)
    const ease = easeInOutCubic(progress)

    window.scrollTo(0, startPosition + distance * ease)

    if (timeElapsed < duration) {
      requestAnimationFrame(animation)
    }
  }

  requestAnimationFrame(animation)
}

// Aplicar smooth scroll a todos los links del nav - Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const allNavLinks = [...$$('nav a[href^="#"]')]

  console.log('Smooth scroll activado en', allNavLinks.length, 'links')

  allNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()

      const targetId = link.getAttribute('href')
      console.log('Navegando a:', targetId)

      // Cerrar menú mobile si está abierto
      if (navToggle && nav.classList.contains('nav-open')) {
        navToggle.setAttribute('aria-expanded', 'false')
        nav.classList.remove('nav-open')
        header.classList.remove('nav-active')
        document.body.style.overflow = ''

        // Pequeño delay para que el menú se cierre antes del scroll
        setTimeout(() => {
          smoothScrollTo(targetId)
        }, 300)
      } else {
        // Desktop: scroll inmediato
        smoothScrollTo(targetId)
      }
    })
  })
})