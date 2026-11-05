const API_URL =
  'https://script.google.com/macros/s/AKfycbzed59puhdjCq6XtprrQK9ZqwSLjcc9z212ec9S8ZqIymOICKmmrdsIBwjNoIDCnJvHvw/exec';

let banco = [];
let asignadas = [];

window.onload = async () => {

  try {

    console.log("Cargando preguntas...");

    const response = await fetch(
      `${API_URL}?action=questions`
    );

    banco = await response.json();

    console.log(
      "Preguntas cargadas:",
      banco
    );

    if (!Array.isArray(banco)) {

      alert(
        "Error: la respuesta del servidor no es válida."
      );

      banco = [];
    }

  } catch (error) {

    console.error(
      "Error cargando preguntas:",
      error
    );

    alert(
      "No fue posible cargar las preguntas."
    );
  }
};

function randomItem(arr) {

  return arr[
    Math.floor(
      Math.random() * arr.length
    )
  ];
}

function assignQuestions() {

  const nombre =
    document
      .getElementById("studentName")
      .value
      .trim();

  if (!nombre) {

    alert(
      "Ingrese su nombre."
    );

    return;
  }

  if (banco.length === 0) {

    alert(
      "No hay preguntas disponibles."
    );

    return;
  }

  const pregunta =
    randomItem(banco);

  asignadas = [pregunta];

  console.log(
    "Pregunta sorteada:",
    pregunta
  );

  document.getElementById(
    "drawResult"
  ).innerHTML =
    `<strong>Pregunta asignada</strong>`;

  render();
}

function render() {

  const contenedor =
    document.getElementById(
      "questionsContainer"
    );

  contenedor.innerHTML = "";

  asignadas.forEach((p, i) => {

    if (!p) {
      return;
    }

    const card =
      document.createElement("div");

    card.className = "card";

    let html = `
      <h3>Pregunta</h3>

      <p>
        <strong>Tipo:</strong>
        ${p.tipo}
      </p>

      <p>
        ${p.pregunta}
      </p>
    `;

    const tipo =
      String(p.tipo)
        .toLowerCase()
        .normalize("NFD")
        .replace(
          /[\u0300-\u036f]/g,
          ""
        );

    if (tipo === "explicacion") {

      html += `
        <textarea
          id="r_${i}"
          rows="6"
          placeholder="Escriba su respuesta">
        </textarea>
      `;

    } else {

      html += `
        <input
          type="file"
          accept="image/*"
          id="f_${i}"
          onchange="preview(this, ${i})">

        <img
          id="img_${i}"
          class="preview"
          style="display:none;">
      `;
    }

    card.innerHTML = html;

    contenedor.appendChild(card);

  });

  document.getElementById(
    "saveBtn"
  ).style.display = "block";
}

function preview(input, index) {

  const file =
    input.files[0];

  if (!file) {
    return;
  }

  const img =
    document.getElementById(
      `img_${index}`
    );

  img.src =
    URL.createObjectURL(file);

  img.style.display =
    "block";
}

function toBase64(file) {

  return new Promise(
    (resolve, reject) => {

      const reader =
        new FileReader();

      reader.readAsDataURL(file);

      reader.onload =
        () => resolve(
          reader.result
        );

      reader.onerror =
        error => reject(
          error
        );
    }
  );
}

async function saveAnswers() {

  try {

    const estudiante =
      document.getElementById(
        "studentName"
      ).value;

    const respuestas = [];

    for (
      let i = 0;
      i < asignadas.length;
      i++
    ) {

      const p =
        asignadas[i];

      const tipo =
        String(p.tipo)
          .toLowerCase()
          .normalize("NFD")
          .replace(
            /[\u0300-\u036f]/g,
            ""
          );

      if (
        tipo ===
        "explicacion"
      ) {

        const texto =
          document
            .getElementById(
              `r_${i}`
            )
            .value
            .trim();

        if (!texto) {

          alert(
            "Debe responder la pregunta."
          );

          return;
        }

        respuestas.push({
          tipo: p.tipo,
          pregunta:
            p.pregunta,
          respuestaTexto:
            texto,
          imagen: ""
        });

      } else {

        const archivo =
          document
            .getElementById(
              `f_${i}`
            )
            .files[0];

        if (!archivo) {

          alert(
            "Debe adjuntar una imagen."
          );

          return;
        }

        const base64 =
          await toBase64(
            archivo
          );

        respuestas.push({
          tipo: p.tipo,
          pregunta:
            p.pregunta,
          respuestaTexto:
            "",
          imagen:
            base64
        });
      }
    }

    const response =
      await fetch(
        `${API_URL}?action=save`,
        {
          method: "POST",
          body:
            JSON.stringify({
              estudiante,
              respuestas
            })
        }
      );

    const result =
      await response.text();

    console.log(
      "Resultado:",
      result
    );

    alert(
      "Respuesta guardada correctamente."
    );

    document.getElementById(
      "saveBtn"
    ).disabled = true;

  } catch (error) {

    console.error(
      error
    );

    alert(
      "Ocurrió un error al guardar."
    );
  }
}
