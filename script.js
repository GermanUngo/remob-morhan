// Preenche estado e município a partir do CEP
document.getElementById('cep').addEventListener('blur', async function () {
  const cep = this.value.replace(/\D/g, '');
  if (cep.length !== 8) return;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();

    if (data.erro) throw new Error("CEP não encontrado");

    document.getElementById('estado').value = data.uf;
    document.getElementById('municipio').value = data.localidade;
  } catch (err) {
    alert('Erro ao buscar o CEP');
    document.getElementById('estado').value = '';
    document.getElementById('municipio').value = '';
  }
});

// Converte data ISO para dd/mm/aaaa
function formatarDataBR(dataISO) {
  if (!dataISO) return '';
  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
}

// Envia o formulário pro Google Sheets
document.getElementById('form-remob').addEventListener('submit', async function (e) {
  e.preventDefault();

  const dataISO = document.getElementById('data_filiacao').value;
  const dataFormatada = formatarDataBR(dataISO);

  const formData = {
    data_filiacao: dataFormatada,
    nome: document.getElementById('nome').value,
    cep: document.getElementById('cep').value,
    estado: document.getElementById('estado').value,
    municipio: document.getElementById('municipio').value
  };

  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbzurJeEfqULt5LgGIP6RtOB32pfR8SqwKqRGHo_g3rW7vWciDtuycO6YZ0-A-lLlHuDOg/exec', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    alert('✅ Sucesso: ' + result.mensagem);
  } catch (err) {
    alert('❌ Erro ao enviar dados: ' + err.message);
  }
});
