var emailForm = document.querySelector('.emailForm')
var formSpinner = document.querySelector('.spinner')
var thankyouMsg = document.querySelector('#thank-you')
var requiredMsg = document.querySelector('#requiredMsg')
var submitBtn = document.querySelector('#submitBtn')

var nameInput = document.querySelector('#nameInput')
var emailInput = document.querySelector('#emailInput')
var messageInput = document.querySelector('#messageInput')
// var mobileInput = document.querySelector('#mobileInput')
// var addressInput = document.querySelector('#addressInput')
// var postcodeInput = document.querySelector('#postcodeInput')
// var suburbInput = document.querySelector('#suburbInput')

var nameContents = nameInput.value
var emailContents = emailInput.value
var messageContents = messageInput.value
// var mobileContents = mobileInput.value
// var addressContents = addressInput.value
// var postcodeContents = postcodeInput.value
// var suburbContents = suburbInput.value
var emailValidRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
var formValid = false

nameInput.addEventListener('input', () => {
  nameContents = nameInput.value
  if (nameContents.length > 0) {
    nameInput.style.borderColor = '#B8E7F0'
    var nameArr = nameContents.split(' ')
    if (nameArr.length == 1) {
      nameInput.value = nameArr[0][0].toUpperCase() + nameArr[0].slice(1)
    } else if (nameArr.length == 2) {
      nameInput.value =
        nameArr[0][0].toUpperCase() +
        nameArr[0].slice(1) +
        ' ' +
        nameArr[1][0].toUpperCase() +
        nameArr[1].slice(1)
    } else if (nameArr.length > 2) {
      nameInput.value =
        nameArr[0][0].toUpperCase() +
        nameArr[0].slice(1) +
        ' ' +
        nameArr[1][0].toUpperCase() +
        nameArr[1].slice(1) +
        ' ' +
        nameArr[2][0].toUpperCase() +
        nameArr[2].slice(1)
    }
  }
})

emailInput.addEventListener('input', () => {
  emailContents = emailInput.value
  if (emailContents.match(emailValidRegex)) {
    emailInput.style.borderColor = 'yellowgreen'
    emailInput.style.borderWidth = '2px'
    formValid = true
  } else {
    emailInput.style.borderColor = '#B8E7F0'
    formValid = false
  }
})

messageInput.addEventListener('input', () => {
  messageContents = messageInput.value
  if (messageContents.length > 0) {
    messageInput.style.borderColor = '#B8E7F0'
  }
})

// mobileInput.addEventListener('input', () => {
//   mobileContents = mobileInput.value
//   if (mobileContents.length === 10 || mobileContents.length === 8) {
//     mobileInput.style.borderColor = 'yellowgreen'
//     mobileInput.className = 'validationTick'
//   } else {
//     mobileInput.style.borderColor = 'none'
//     mobileInput.className = ''
//   }
// })

submitBtn.addEventListener('click', e => {
  if (e.preventDefault) e.preventDefault()
  if (e.stopPropagation) e.stopPropagation()

  nameContents = nameInput.value
  messageContents = messageInput.value

  if (!emailContents.match(emailValidRegex)) {
    emailInput.style.borderColor = 'red'
    formValid = false
  }
  if (!messageContents) {
    messageInput.style.borderColor = 'red'
    formValid = false
  }
  if (!nameContents) {
    nameInput.style.borderColor = 'red'
    formValid = false
  }
  if (formValid == true) {
    // submitBtn.className = "submitting"
    // formSpinner.style.display = 'block'
    submitBtn.disabled = true
    axios({
      url:
        window.location.protocol === 'http:'
          ? 'http://localhost:3000/api/sendMail'
          : 'https://www.carnegiemedical.com.au/api/sendMail',
      method: 'POST',
      data: {
        nameContents,
        emailContents,
        messageContents,
      },
    })
      .then(res => {
        console.log(res.data)
      })
      .catch(error => {
        if (error.response) {
          // Request made and server responded
          console.log(error.response.data)
          console.log(error.response.status)
          console.log(error.response.headers)
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request)
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message)
        }
      })
      .finally(
        setTimeout(function () {
          emailForm.style.display = 'none'
          thankyouMsg.style.display = 'block'
        }, 2000),
      )
    // .finally({ will always execute no matter what server sends back as the status codes })
    // don't really need to use finally here but sometimes we will need to use it as a catchall
  } else {
    submitBtn.className = 'button submit'
  }
})

// Add functionality to delete all characters that aren't Alpha chars in the Name input
// replace(/^[A-Za-z'\ ]/g, '') - to get rid of any non Alpha chars in the string
