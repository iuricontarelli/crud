"use strict"; // Habilita o modo estrito do JavaScript para garantir boas práticas de codificação.

// Funções para abrir e fechar o modal
const openModal = () =>
	document.getElementById("modal").classList.add("active"); // Adiciona a classe "active" ao modal
const closeModal = () => {
	clearFields(); // Limpa os campos do formulário
	document.getElementById("modal").classList.remove("active"); // Remove a classe "active" do modal
};

// Funções para interagir com o armazenamento local
const getLocalStorage = () =>
	JSON.parse(localStorage.getItem("db_client")) ?? []; // Obtém os dados do armazenamento local
const setLocalStorage = (dbClient) =>
	localStorage.setItem("db_client", JSON.stringify(dbClient)); // Define os dados no armazenamento local

// Operações CRUD (Create, Read, Update, Delete)
const deleteClient = (index) => {
	const dbClient = readClient(); // Obtém os dados dos clientes
	dbClient.splice(index, 1); // Remove o cliente com o índice especificado
	setLocalStorage(dbClient); // Atualiza os dados no armazenamento local
};

const updateClient = (index, client) => {
	const dbClient = readClient(); // Obtém os dados dos clientes
	dbClient[index] = client; // Atualiza o cliente com o índice especificado
	setLocalStorage(dbClient); // Atualiza os dados no armazenamento local
};

const readClient = () => getLocalStorage(); // Lê os dados dos clientes

const createClient = (client) => {
	const dbClient = getLocalStorage(); // Obtém os dados dos clientes
	dbClient.push(client); // Adiciona um novo cliente
	setLocalStorage(dbClient); // Atualiza os dados no armazenamento local
};

// Função para verificar se os campos do formulário são válidos
const isValidFields = () => {
	return document.getElementById("form").reportValidity(); // Verifica a validade dos campos do formulário
};

// Interação com o layout

// Função para limpar os campos do formulário
const clearFields = () => {
	const fields = document.querySelectorAll(".modal-field"); // Obtém todos os campos do formulário
	fields.forEach((field) => (field.value = "")); // Limpa o valor de cada campo
	document.getElementById("nome").dataset.index = "new"; // Define o índice do campo "nome" como "new"
	document.querySelector(".modal-header>h2").textContent = "Novo Cliente"; // Altera o título do modal
};

// Função para salvar um novo cliente ou atualizar um cliente existente
const saveClient = () => {
	if (isValidFields()) {
		// Verifica se os campos do formulário são válidos
		const client = {
			nome: document.getElementById("nome").value,
			email: document.getElementById("email").value,
			celular: document.getElementById("celular").value,
			cidade: document.getElementById("cidade").value,
		}; // Obtém os valores dos campos do formulário
		const index = document.getElementById("nome").dataset.index; // Obtém o índice do cliente
		if (index == "new") {
			// Se o índice for "new", cria um novo cliente
			createClient(client);
			updateTable(); // Atualiza a tabela de clientes
			closeModal(); // Fecha o modal
		} else {
			// Caso contrário, atualiza o cliente existente
			updateClient(index, client);
			updateTable(); // Atualiza a tabela de clientes
			closeModal(); // Fecha o modal
		}
	}
};

// Função para criar uma nova linha na tabela de clientes
const createRow = (client, index) => {
	const newRow = document.createElement("tr"); // Cria um novo elemento <tr>
	newRow.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.email}</td>
        <td>${client.celular}</td>
        <td>${client.cidade}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `; // Define o conteúdo HTML da nova linha
	document.querySelector("#tableClient>tbody").appendChild(newRow); // Adiciona a nova linha à tabela de clientes
};

// Função para limpar a tabela de clientes
const clearTable = () => {
	const rows = document.querySelectorAll("#tableClient>tbody tr"); // Obtém todas as linhas da tabela
	rows.forEach((row) => row.parentNode.removeChild(row)); // Remove todas as linhas da tabela
};

// Função para atualizar a tabela de clientes
const updateTable = () => {
	const dbClient = readClient(); // Obtém os dados dos clientes
	clearTable(); // Limpa a tabela de clientes
	dbClient.forEach(createRow); // Cria uma nova linha na tabela para cada cliente
};

// Função para preencher os campos do formulário com os dados de um cliente
const fillFields = (client) => {
	document.getElementById("nome").value = client.nome;
	document.getElementById("email").value = client.email;
	document.getElementById("celular").value = client.celular;
	document.getElementById("cidade").value = client.cidade;
	document.getElementById("nome").dataset.index = client.index; // Define o índice do cliente no campo "nome"
};

// Função para editar um cliente
const editClient = (index) => {
	const client = readClient()[index]; // Obtém o cliente com o índice especificado
	client.index = index; // Define o índice do cliente
	fillFields(client); // Preenche os campos do formulário com os dados do cliente
	document.querySelector(
		".modal-header>h2"
	).textContent = `Editando ${client.nome}`; // Altera o título do modal
	openModal(); // Abre o modal
};

// Função para editar ou excluir um cliente
const editDelete = (event) => {
	if (event.target.type == "button") {
		// Verifica se o elemento clicado é um botão
		const [action, index] = event.target.id.split("-"); // Divide o ID do botão em ação e índice

		if (action == "edit") {
			// Se a ação for editar, chama a função editClient
			editClient(index);
		} else {
			// Se a ação for excluir, chama a função deleteClient
			const client = readClient()[index];
			const response = confirm(
				`Deseja realmente excluir o cliente ${client.nome}`
			); // Pede confirmação ao usuário
			if (response) {
				deleteClient(index); // Exclui o cliente
				updateTable(); // Atualiza a tabela de clientes
			}
		}
	}
};

// Atualiza a tabela de clientes ao carregar a página
updateTable();

// Adiciona ouvintes de eventos para interações com o layout
document
	.getElementById("cadastrarCliente")
	.addEventListener("click", openModal); // Abre o modal ao clicar no botão "Cadastrar Cliente"

document.getElementById("modalClose").addEventListener("click", closeModal); // Fecha o modal ao clicar no botão "Fechar"

document.getElementById("salvar").addEventListener("click", saveClient); // Salva os dados do cliente ao clicar no botão "Salvar"

document
	.querySelector("#tableClient>tbody")
	.addEventListener("click", editDelete); // Edita ou exclui um cliente ao clicar nos botões "Editar" ou "Excluir"

document.getElementById("cancelar").addEventListener("click", closeModal); // Fecha o modal ao clicar no botão "Cancelar"
