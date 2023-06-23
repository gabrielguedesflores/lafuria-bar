$(document).ready(function () {
	ordersController();
});

let ordersList = []; // Variável global para armazenar a lista de comandas

const baseUrl = 'https://lafuria-api-gabrielguedesflores.vercel.app';

const getOrders = async () => {
	try {
		const { data } = await axios.get(baseUrl + '/orders');
		ordersList = data; // Armazenando as comandas na variável global
		return data;
	} catch (error) {
		console.error(error);
	}
}

const ordersController = async () => {
	const orders = await getOrders();
	let orderRows = orders.map(order => {
		// return `
		// 	<tr>
		// 		<td>${order.customer}</td>
		// 		<td>${new Date(order.date).toLocaleDateString('pt-BR')}</td>
		// 		<td>${order.status}</td>
		// 		<td>${order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
		// 		<td>
		// 			<button class="btn btn-sm btn-primary" onclick="editOrder('${order._id}')"><i class="fas fa-edit"></i> Editar</button>
		// 			<button class="btn btn-sm btn-danger" onclick="deleteOrder('${order._id}')"><i class="fas fa-trash-alt"></i> Excluir</button>
		// 		</td>
		// 	</tr>
		// `;
		return `
			<tr>
				<td>${order.customer}</td>
				<td>${new Date(order.date).toLocaleDateString('pt-BR')}</td>
				<td>${order.status === "open" ? "Aberto" : "Fechada"}</td>
				<td>${order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
			</tr>
		`;
	}).join('');

	$('#orderList').html(orderRows);
}

// Placeholder para funções de edição e exclusão de comandas
const editOrder = (id) => {
	console.log('Editar comanda: ', id);
	// Implementar função para editar a comanda
}

const deleteOrder = (id) => {
	console.log('Excluir comanda: ', id);
	// Implementar função para excluir a comanda
}
