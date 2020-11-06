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
        axios
            .post('/api', {
                nameContents,
                emailContents,
                messageContents
            })
            .then(res => {
                console.log(res.data)
            })
        sendMail()
        // send of request to SendgridAPI
        // can we talk to the Vercel FaaS here? 
    } else {
        submitBtn.className = ""
    }
})

// Add functionality to delete all characters that aren't Alpha chars in the Name input
// replace(/^[A-Za-z'\ ]/g, '') - to get rid of any non Alpha chars in the string
