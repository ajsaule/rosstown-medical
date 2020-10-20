let submitButton = document.getElementById("email-submit")

function toggleClass() {
    console.log(submitButton.className)
    console.log('working')
    if (submitButton.className == "") {
        submitButton.className = "submitting"
    } else {
        submitButton.className = ""
    }
}

submitButton.addEventListener("click", e => {
    e.preventDefault()
    toggleClass()
})

// the scrips should not be loaded if we are trying to target a non-parsed node
