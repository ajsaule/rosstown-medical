var nameInput = document.querySelector("#input-name")
var emailInput = document.querySelector("#input-email")
var submitBtn = document.querySelector("#email-submit")

var nameContents = nameInput.value
var emailContents = emailInput.value
var emailValid = false
var emailValidRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

nameInput.addEventListener("input", () => {
    nameContents = nameInput.value
    if (nameContents.length > 0) {
        var nameArr = nameContents.split(' ')
        if (nameArr.length == 1) {
            nameInput.value = nameArr[0][0].toUpperCase() + nameArr[0].slice(1)
        } else if (nameArr.length == 2) { 
            nameInput.value = nameArr[0][0].toUpperCase() + nameArr[0].slice(1) + ' '
            + nameArr[1][0].toUpperCase() + nameArr[1].slice(1)
        } else if (nameArr.length > 2) {
            nameInput.value = nameArr[0][0].toUpperCase() + nameArr[0].slice(1) + ' '
            + nameArr[1][0].toUpperCase() + nameArr[1].slice(1) + ' ' 
            + nameArr[2][0].toUpperCase() + nameArr[2].slice(1)
        }
    }
})

emailInput.addEventListener("input", () => {
    emailContents = emailInput.value
    if (emailContents.match(emailValidRegex)) {
        emailInput.style.borderColor = 'yellowgreen'
        emailValid = true
    } else {
        emailInput.style.borderColor = '#B8E7F0'
        emailValid = false 
    }
})

submitBtn.addEventListener('click', (e) => {
    e.preventDefault()
    if (!emailContents.match(emailValidRegex)) {
        emailInput.style.borderColor = 'red'
        emailValid = false
    } 
    if (emailValid == true) {
        submitBtn.className = "submitting"
        // send of request to SendgridAPI
    } else {
        submitBtn.className = ""
    }
})

// replace(/^[A-Za-z'\ ]/g, '') - to get rid of any non Alpha chars in the string

