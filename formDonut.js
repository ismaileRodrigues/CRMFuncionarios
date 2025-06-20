// Seleciona todos os inputs do formulário
let inputs = document.querySelectorAll('#formFuncionario input');

// Adiciona o evento de envio ao formulário
document.querySelector('#formFuncionario').addEventListener('submit', (event) => {
  event.preventDefault();

  // Coleta os dados do formulário
  let data = new FormData(event.target);

  // Envia os dados para a API do Google Sheets
  fetch('https://sheetdb.io/api/v1/mhbjwyvvc2n6q', {
    method: 'POST',
    body: data
  })
    .then(response => {
      if (response.ok) {
        alert('Funcionário cadastrado com sucesso!');
        // Limpa os campos do formulário
        inputs.forEach(input => input.value = '');
      } else {
        alert('Erro ao enviar os dados. Tente novamente.');
      }
    })
    .catch(error => {
      console.error('Erro ao enviar:', error);
      alert('Erro ao enviar os dados.');
    });
});
