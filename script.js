// Preenche estado e município a partir do CEP
document.getElementById("cep").addEventListener("blur", async function () {
  const cep = this.value.replace(/\D/g, "");
  if (cep.length !== 8) return;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();

    if (data.erro) throw new Error("CEP não encontrado");

    document.getElementById("estado").value = data.uf;
    document.getElementById("municipio").value = data.localidade;
  } catch (err) {
    alert("Erro ao buscar o CEP");
    document.getElementById("estado").value = "";
    document.getElementById("municipio").value = "";
  }
});

// Converte data ISO para dd/mm/aaaa
function formatarDataBR(dataISO) {
  if (!dataISO) return "";
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

// Envia o formulário pro Google Sheets (modo silencioso, no-cors)
document
  .getElementById("form-remob")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const dataISO = document.getElementById("data_filiacao").value;
    const dataFormatada = formatarDataBR(dataISO);

    const formData = {
      data_filiacao: dataFormatada,
      nome: document.getElementById("nome").value,
      cep: document.getElementById("cep").value,
      estado: document.getElementById("estado").value,
      municipio: document.getElementById("municipio").value,
    };

    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbzWPlBGQx0zoJHAjZ6uY7T5-QstGp7qRPn_CZCWwbtdY1oNwqNnoZzVXIyVcwF0gQb4yQ/exec",
        {
          method: "POST",
          mode: "no-cors",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      alert("✅ Dados enviados! Verifique a planilha.");
    } catch (err) {
      alert("❌ Erro ao tentar enviar: " + err.message);
    }
  });
