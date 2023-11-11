function handleSubmit() {
    var selectedValue = document.querySelector(
      'input[name="role"]:checked'
    ).value;
    if (selectedValue === "Pharmacist") {
      document.getElementById("insertionForm").action = "/insert_pharma";
    } else if (selectedValue === "Doctor") {
      document.getElementById("insertionForm").action = "/insert_doc";
  }
}