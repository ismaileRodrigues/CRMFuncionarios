const cadastroForm = document.getElementById('cadastroForm');
const resultado = document.getElementById('resultado');
const pesquisa = document.getElementById('pesquisa');
const lista = document.getElementById('lista');
const formulario = document.getElementById('formulario');
const API_URL = 'https://sheetdb.io/api/v1/mhbjwyvvc2n6q';
let funcionarios = [];
let editandoCPF = null;

cadastroForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const funcionario = {
    Nome: document.getElementById('nome').value,
    CPF: document.getElementById('cpf').value,
    Cargo: document.getElementById('cargo').value,
    Departamento: document.getElementById('departamento').value,
    DataAdmissao: document.getElementById('dataAdmissao').value,
    Salario: document.getElementById('salario').value,
    dataNascimento: document.getElementById('dataNascimento').value,
  };

  try {
    const method = editandoCPF ? 'PATCH' : 'POST';
    const url = editandoCPF ? `${API_URL}/CPF/${editandoCPF}` : API_URL;

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: funcionario })
    });

    if (res.ok) {
      alert(editandoCPF ? 'Funcionário atualizado com sucesso!' : 'Funcionário cadastrado com sucesso!');
      cadastroForm.reset();
      document.getElementById('cpf').disabled = false;
      document.getElementById('form-title').textContent = 'Cadastrar Funcionário';
      editandoCPF = null;
      localStorage.removeItem('funcionarios');
      mostrarLista();
    } else {
      alert('Erro ao salvar. Tente novamente.');
    }
  } catch (error) {
    alert('Erro de conexão com a API.');
    console.error(error);
  }
});

async function carregarFuncionarios() {
  const cache = localStorage.getItem('funcionarios');

  if (cache) {
    funcionarios = JSON.parse(cache);
    exibirFuncionarios();
    console.log('Dados carregados do localStorage.');
  } else {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      funcionarios = data;
      localStorage.setItem('funcionarios', JSON.stringify(data));
      exibirFuncionarios();
      console.log('Dados carregados da API e salvos no localStorage.');
    } catch (error) {
      alert('Erro ao carregar dados.');
      console.error(error);
    }
  }
}

function exibirFuncionarios(listaFiltrada = funcionarios) {
  resultado.innerHTML = '';

  if (listaFiltrada.length === 0) {
    resultado.innerHTML = '<p>Nenhum funcionário encontrado.</p>';
    return;
  }

  listaFiltrada.forEach(func => {
    const div = document.createElement('div');
    div.className = 'funcionario-card';
    div.innerHTML = `
      <h3>${func.Nome}</h3>
      <p><strong>CPF:</strong> ${func.CPF}</p>
      <p><strong>Cargo:</strong> ${func.Cargo}</p>
      <p><strong>Departamento:</strong> ${func.Departamento}</p>
      <p><strong>Admissão:</strong> ${func.DataAdmissao}</p>
      <p><strong>Salário:</strong> R$ ${func.Salario}</p>
      <p><strong>Data de Nascimento:</strong> ${func.dataNascimento}</p>
      <button onclick="editarFuncionario('${func.CPF}')">Editar</button>
      <button onclick="deletarFuncionario('${func.CPF}')">Excluir</button>
    `;
    resultado.appendChild(div);
  });
}

pesquisa.addEventListener('input', () => {
  const termo = pesquisa.value.toLowerCase();
  const filtrados = funcionarios.filter(f => f.Nome.toLowerCase().includes(termo));
  exibirFuncionarios(filtrados);
});

function mostrarLista() {
  formulario.style.display = 'none';
  lista.style.display = 'block';
  carregarFuncionarios();
}

function mostrarFormulario() {
  lista.style.display = 'none';
  formulario.style.display = 'block';
}

function editarFuncionario(cpf) {
  const func = funcionarios.find(f => f.CPF === cpf);
  if (!func) return;

  document.getElementById('nome').value = func.Nome;
  document.getElementById('cpf').value = func.CPF;
  document.getElementById('cpf').disabled = true;
  document.getElementById('cargo').value = func.Cargo;
  document.getElementById('departamento').value = func.Departamento;
  document.getElementById('dataAdmissao').value = func.DataAdmissao;
  document.getElementById('salario').value = func.Salario;
  document.getElementById('dataNascimento').value = func.dataNascimento;

  document.getElementById('form-title').textContent = 'Editar Funcionário';
  editandoCPF = cpf;
  mostrarFormulario();
}

async function deletarFuncionario(cpf) {
  if (!confirm('Tem certeza que deseja excluir este funcionário?')) return;

  try {
    const res = await fetch(`${API_URL}/CPF/${cpf}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      alert('Funcionário deletado com sucesso.');
      localStorage.removeItem('funcionarios');
      mostrarLista();
    } else {
      alert('Erro ao deletar.');
    }
  } catch (error) {
    alert('Erro de conexão ao tentar excluir.');
    console.error(error);
  }
}
