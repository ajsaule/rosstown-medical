var nameInput = document.getElementById("input-name")
var emailInput = document.querySelector("#input-email")
var nameContents = nameInput.value

nameInput.addEventListener("input", (e) => {
    nameContents = nameInput.value
    if (nameContents.length > 2) {
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
    console.log('email')
})

// replace(/^[A-Za-z'\ ]/g, '') - to get rid of any non Alpha chars in the string