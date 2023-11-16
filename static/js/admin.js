function handleSubmit() {
  var selectedValue = document.querySelector(
    'input[name="role"]:checked'
  ).value;
  id = document.getElementById("id");
  password = document.getElementById("password");
  Name = document.getElementById("name");

  console.log(selectedValue);
  console.log("does this shit even run");
  if (selectedValue === "Pharmacist") {
    console.log("Pharma insert");
    const dataToSend = {
      id: id.value,
      password: password.value,
      Name: Name.value,
    };

    fetch("/insert_pharma", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    }).then((response) => {
      if (!response.ok) {
        throw new Error("AAAA from pharma");
      }
      return response.json();
    })
      .then((data) => {
        console.log('ok');
        var successText = document.getElementById('success');
        successText.innerText = 'Added Pharmasist';
        successDialogShow();
      })
    //document.getElementById("insertionForm").action = "/insert_pharma";
  } else if (selectedValue === "Doctor") {
    console.log("Doctor insert");
    email = document.getElementById("email");
    spec = document.getElementById("spec");
    exp = document.getElementById("exp");
    age = document.getElementById("age");

    const dataToSend = {
      id: id.value,
      password: password.value,
      Name: Name.value,
      email: email.value,
      spec: spec.value,
      exp: exp.value,
      age: age.value,
    };

    fetch("/insert_doc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    }).then((response) => {
      if (!response.ok) {
        throw new Error("AAAA from doc");
      }
      return response.json();
    })
      .then((data) => {
        console.log('ok');
        var successText = document.getElementById('success');
        successText.innerText = 'Added Doctor';
        successDialogShow();
      })

    //document.getElementById("insertionForm").method = "POST";
    //document.getElementById("insertionForm").action = "/insert_doc";
  }
}

function successDialogShow() {
  successDialog = document.getElementById("success-container");
  successDialog.style.visibility = "visible";
  console.log("error dialog: ", successDialog);
  setTimeout(function() {
    successDialog.style.display = "none";
  }, 2000);
}