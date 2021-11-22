const button = document.querySelector("#button");


button.addEventListener("click", async (evt) => {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    if (username === "admin" && password === "Projektarbeit-2") {
        window.location.href = 'main.html';
    }
    else {
        alert("Login fehlerhaft");

    }
})