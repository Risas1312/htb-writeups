const loginScreen = document.getElementById("loginScreen");
const app = document.getElementById("app");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");

const correctPassword = "htbprivate2026";

loginBtn.addEventListener("click", () => {
  if (passwordInput.value === correctPassword) {
    loginScreen.classList.add("hidden");
    app.classList.remove("hidden");
  } else {
    alert("Contraseña incorrecta");
    passwordInput.value = "";
  }
});

passwordInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    if (passwordInput.value === correctPassword) {
      loginScreen.classList.add("hidden");
      app.classList.remove("hidden");
    } else {
      alert("Contraseña incorrecta");
      passwordInput.value = "";
    }
  }
});
