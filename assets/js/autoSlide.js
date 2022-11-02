const sliderContainer = document.querySelector('.slider-container')
const slide1 = document.querySelector('#slide-dot-1')
const slide2 = document.querySelector('#slide-dot-2')
const slide3 = document.querySelector('#slide-dot-3')

sliderContainer.addEventListener('mouseover', function() {
  autoSlideDisabled = true
})

let autoSlideDisabled = false

function s1() {
  if (autoSlideDisabled) {
    return
  }
  slide1.click()
}
function s2() {
  if (autoSlideDisabled) {
    return
  }
  slide2.click()
}

function s3() {
  if (autoSlideDisabled) {
    return
  }
  slide3.click()
}


const funcs = [s1, s2, s3, s1, s2, s3, s1, s2, s3, s1, s2, s3]
const autoSlide = funcs.map((func, idx) => setTimeout(() => func(), 4000 * idx))
