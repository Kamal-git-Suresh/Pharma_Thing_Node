//const { application, response } = require("express");
var rows = undefined;
function sendHello(pat_id, presc_id, doc_id) {
  var aaa = "hello";
  const dataToSend = {
    pat_id: pat_id,
    presc_id: presc_id,
    doc_id: doc_id,
  };
  console.log(dataToSend);
  fetch("/hello", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataToSend),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("AAAA");
      }
      return response.json();
    })
    .then((data) => {
      console.log("data: ", data.JSON);
      console.log("button Id: ", data.doc_id, "-", data.presc_id);
      var button = document.getElementById(data.presc_id);
      button.innerText = "Prescribed";
      button.disabled = true;
    })
    .catch((error) => {
      console.log("error: ", error);
    });
}

function triggerAnimation() {
  var element = document.getElementById("searchbar");
  console.log("this is working");
  element.classList.add("animate_up");
}

function handleSubmit() {
  pat_id = document.getElementById("pat_id").value;
  const dataToSend = {
    pat_id: pat_id,
  };
  console.log("Id from textbox = ", pat_id);
  fetch("/search_pat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataToSend),
  })
    .then((response) => {
      if (!response.ok) {
        console.log("noooo");
        displayError();
        const tableBody = document.getElementById("table_body");
        tableBody.style.visibility = 'hidden';
        throw new Error('No patient');
      }
      return response.json();
    })
    .then((responseJSON) => {
      console.log("response: ", responseJSON);
      const tableBody = document.getElementById("table_body");
      tableBody.style.visibility = 'visible';
      const table = document.getElementById("pat_table");
      const tbody = table.querySelector("tbody");
      const pat_id = document.getElementById('pat_name_label');
      pat_id.innerText = 'Name: ' + responseJSON[0].pat_name;
      const pat_age = document.getElementById('pat_age_label');
      pat_age.innerText = 'Age: ' + responseJSON[0].pat_age;
      const pat_sex = document.getElementById('pat_sex_label');
      pat_sex.innerText = 'Sex: ' + responseJSON[0].pat_sex;
      console.log(pat_id);
      tbody.innerHTML = ``;
      responseJSON.forEach((item) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.doc_id}</td>
            <td>${item.presc_id}</td>
            <td>${item.presc_name}</td>
            <td>${item.presc_date}</td>
            <td>${item.amount}</td>
            <td><button type="button" onclick="sendHello(${item.pat_id}, ${item.presc_id})" id = "${item.presc_id}" >Prescribe</button></td>
        `;
        tbody.appendChild(row);
      });
      table.style.display = "table";
    });
}

function displayError() {
  errorDialog = document.getElementById("error-container");
  errorDialog.style.visibility = "visible";
  console.log("error dialog: ", errorDialog);
  setTimeout(function() {
    errorDialog.style.display = "none";
  }, 2000);
}

function hideError() {
  errorDialog = document.getElementById("error-container");
  errorDialog.style.visibility = "hidden";
}