const slides1 = document.querySelector('#slide-dot-1')
const slides2 = document.querySelector('#slide-dot-2')
const slides3 = document.querySelector('#slide-dot-3')

let autoSlideDisabled = false

function s1() {
  if (autoSlideDisabled) {
    return
  }
  slides1.click()
}
function s2() {
  if (autoSlideDisabled) {
    return
  }
  slides2.click()
}

function s3() {
  if (autoSlideDisabled) {
    return
  }
  slides3.click()
}

const funcs = [s1, s2, s3]
const autoSlide = funcs.map((func, idx) => setTimeout(() => func(), 4000 * idx))
