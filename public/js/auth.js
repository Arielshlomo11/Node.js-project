function handleLogin(e) {
  e.preventDefault();
  let userEmail = document.getElementById("email");
  let userPassword = document.getElementById("password");

  if (
    userEmail.value &&
    userPassword.value &&
    userEmail.value !== userPassword.value
  ) {
    firebase
      .auth()
      .signInWithEmailAndPassword(userEmail.value, userPassword.value)
      .then((userCredential) => {
        var user = userCredential.user;
        window.location.href = "./dashboard.html";
      })
      .catch(function (error) {
        // Show an error message
        var errorMessage = JSON.parse(error.message)?.error.message.replace(
          /_/g,
          " "
        );
        alert(errorMessage);
      });
  }
}

function handleRegistration(e) {
  e.preventDefault();
  let userEmail = document.getElementById("email");
  let userPassword = document.getElementById("password");

  if (
    userEmail.value &&
    userPassword.value &&
    userEmail.value !== userPassword.value
  ) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(userEmail.value, userPassword.value)
      .then(function () {
        alert("Account Created Successfully !");
        window.location.href = "./login.html";
      })
      .catch(function (error) {
        // Show an error message
        var errorMessage = JSON.parse(error.message)?.error.message.replace(
          /_/g,
          " "
        );
        alert(errorMessage);
      });
  }
}

function signOut(e) {
  e.preventDefault();
  firebase
    .auth()
    .signOut()
    .then(
      function () {
        alert("Sign Out Successfully !");
        window.location.href = "./login.html";
        localStorage.clear();
      },
      function (error) {
        console.error("Sign Out Error", error);
      }
    );
}
