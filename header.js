const header = document.querySelector('header');

let actualScroll = 0

window.addEventListener('scroll',()=>{
  const top = Math.min(-(window.scrollY - actualScroll + header.clientHeight), 0)

  if (window.scrollY  > actualScroll) {
    actualScroll = window.scrollY
  }

  if (top === 0) {
    actualScroll = window.scrollY + header.clientHeight
  }
  
  header.setAttribute("style", `--_top:${top}px`);
  header.classList.toggle('active',window.scrollY < actualScroll)
  header.classList.toggle('clr',window.scrollY > header.clientHeight)


})

fetch('./motivos.json')
  .then(response => response.json())
  .then(data => {
    let {values} = data
    let keys = values.shift()

    let options = []

    for (const arr of values) {

      let option = {}

      for (const j in arr) {
        option[keys[j]] = arr[j]
      }

      options.push(option)
    }

    console.table(options);
    
  })
  .catch(error => console.error('Error al cargar motivos:', error));
