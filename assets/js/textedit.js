var nameInput = document.querySelector("#input-name")
var emailInput = document.querySelector("#input-email")
var messageInput = document.querySelector("#input-message")
var submitBtn = document.querySelector("#email-submit")

var nameContents = nameInput.value
var emailContents = emailInput.value
var messageContents = messageInput.value
var emailValidRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
var formValid = false

nameInput.addEventListener("input", () => {
    nameContents = nameInput.value
    if (nameContents.length > 0) {
        nameInput.style.borderColor = '#B8E7F0'
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
        emailInput.style.borderWidth = '2px'
        formValid = true
    } else {
        emailInput.style.borderColor = '#B8E7F0'
        formValid = false 
    }
})

messageInput.addEventListener("input", () => {
    messageContents = messageInput.value 
    if (messageContents.length > 0) {
        messageInput.style.borderColor = '#B8E7F0'
    }
})


submitBtn.addEventListener('click', (e) => {
    e.preventDefault()
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
        submitBtn.className = "submitting"
        // send of request to SendgridAPI
        // can we talk to the Vercel FaaS here? 
        axios({
            url: 'http://localhost:5000/api',
            method: 'POST',
            data: {
                nameContents: nameContents,
                emailContents: emailContents,
                messageContents: messageContents
            }
        })
        .then(res => {
            console.log(res.data)
        })
        .catch(function (error) {
            if (error.response) {
                // Request made and server responded
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
        })
        // send of request to SendgridAPI
        // can we talk to the Vercel FaaS here? 
        // .finally({ will always execute no matter what server sends back as the status codes })
    } else {
        submitBtn.className = ""
    }
})

// Add functionality to delete all characters that aren't Alpha chars in the Name input
// replace(/^[A-Za-z'\ ]/g, '') - to get rid of any non Alpha chars in the string
