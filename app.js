const API_URL =
  'https://script.google.com/macros/s/AKfycbzed59puhdjCq6XtprrQK9ZqwSLjcc9z212ec9S8ZqIymOICKmmrdsIBwjNoIDCnJvHvw/exec';

let banco = [];
let asignadas = [];

window.onload = async () => {
  try {

    const response = await fetch(
      `${API_URL}?action=questions`,
      {
        method: "GET",
        mode: "cors"
      }
    );

    banco = await response.json();

    console.log("Preguntas cargadas:", banco);

  } catch (error) {

    console.error("Error cargando preguntas:", error);

    alert(
      "No fue posible cargar las preguntas desde Google Sheets."
    );
  }
};

function rnd(a) {

  if (!a || a.length === 0) {
    return null;
  }

  return a[Math.floor(Math.random() * a.length)];
}

function assignQuestions() {

  const n =
    document.getElementById("studentName")
      .value
      .trim();

  if (!n) {
    alert("Ingrese nombre");
    return;
  }

  if (banco.length === 0) {
    alert("No se cargaron preguntas.");
    return;
  }

  const count =
    Math.floor(Math.random
