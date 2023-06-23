$(document).ready(function () {
	$('.buildCards').html(`
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Carregando...</span>
        </div>
    `);
	controllerOrders();
	handlers();
});
const baseUrl = 'https://lafuria-api-gabrielguedesflores.vercel.app';

// Controllers
const handlers = async () => {
	let itemCounter = 0;  // Contador para gerar IDs únicos para os campos de produto/quantidade
	$('#addItemBtn').on('click', async () => {
		const products = await getProducts();
		const productOptions = products.map(product =>
			`<option value="${product._id}" data-price="${product.price}">${product.name} - ${product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} Un</option>`
		).join('');
		const newItemFields = `
            <div class="row">
                <div class="col-8">
                    <label for="inputProduct-${itemCounter}" class="form-label">Produto</label>
                    <select class="form-select" aria-label="Default select example" id="inputProduct-${itemCounter}">
                        ${productOptions}
                    </select>
                </div>
                <div class="col-4">
                    <label for="inputQtd-${itemCounter}" class="form-label">Quantidade</label>
                    <input type="number" class="form-control" id="inputQtd-${itemCounter}">
                </div>
            </div></ br>
        `;
		$('#itemsList').append(newItemFields);
		itemCounter++;
	});

	$('#itemsList').on('change', 'select, input', function () {
		let total = 0;
		$('#itemsList .row').each(function () {
			const $row = $(this);
			const quantity = Number($row.find('input[type="number"]').val());
			const price = Number($row.find('select option:selected').data('price'));
			total += quantity * price;
		});
		$('#inputTotal').val(total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
	});

	$('#newOrderForm').on('submit', async function (e) {
		e.preventDefault(); // para prevenir a submissão do formulário
		const customer = $('#inputCustomer').val();
		const notes = $('#inputNotes').val();
		const total = parseFloat($('#inputTotal').val().replace('R$', '').replace(',', '.'));
		const status = $('#inputStatus').val();
		const date = new Date().toISOString();

		// Iterando pelos items
		let items = [];
		$('#itemsList .row').each(function () {
			const $row = $(this);
			const product_id = $row.find('select').val();
			const quantity = Number($row.find('input[type="number"]').val());
			const price = Number($row.find('select option:selected').data('price'));
			items.push({
				product_id,
				quantity,
				price,
			});
		});

		const orderData = {
			customer,
			items,
			total,
			status,
			notes,
			date
		};
		const response = await createOrder(orderData);
		if (response) {
			toastr.success("Pedido criado com sucesso!")
			location.reload();
		}
	});

	$(document).on('click', '.order-detail-button', async function () {
		const orders = JSON.parse($("#ordersInstance").val())
		const orderId = $(this).data('order-id');
		const order = orders.find(order => order._id === orderId);
		const products = await getProducts();
		console.log('products', products);
		const productOptions = products.map(product =>
			`<option value="${product._id}" data-price="${product.price}">${product.name} - ${product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} Un</option>`
		).join('');
		console.log('productOptions', productOptions);

		let itemFieldsHtml = '';
			order.items.forEach((item, index) => {
			const productOptions = products.map(product =>
					`<option value="${product._id}" data-price="${product.price}" ${product._id === item.product_id ? 'selected' : ''}>${product.name} - ${product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} Un</option>`
			).join('');
			itemFieldsHtml += `
				<div class="row" id="editOrderItem${index}">
					<div class="col-8">
						<label for="editOrderItemProduct${index}" class="form-label">Produto</label>
						<select class="form-select" id="editOrderItemProduct${index}">
							${productOptions}
						</select>
					</div>
					<div class="col-4">
						<label for="editOrderItemQtd${index}" class="form-label">Quantidade</label>
						<input type="number" class="form-control" id="editOrderItemQtd${index}" value="${item.quantity}">
					</div>
				</div></ br>
			`;
		});
	
		const orderDetailsHtml = `
			<form id="editOrderForm" class="row g-3">
				<div class="col-6" style="display: none;" id="div-input_id">
					<label for="editOrderForm-input_id" class="form-label">Id da Comanda</label>
					<input type="text" class="form-control" id="editOrderForm-input_id" value="${order._id}">
				</div>
				<div class="col-12" id="div-inputCustomer">
					<label for="editOrderForm-inputCustomer" class="form-label">Cliente</label>
					<input type="text" class="form-control" id="editOrderForm-inputCustomer" value="${order.customer}">
				</div>
					<div class="col-12" id="div-inputNotes">
					<label for="editOrderForm-inputNotes" class="form-label">Observações</label>
					<textarea class="form-control" id="editOrderForm-inputNotes" rows="3" value="${order.notes}"></textarea>
				</div>
				<div class="col-6" id="div-inputStatus">
					<label for="editOrderForm-inputStatus" class="form-label">Status</label>
					<select class="form-select" aria-label="Default select example" id="editOrderForm-inputStatus">
						<option value="open" selected>Aberta</option>
						<option value="closed">Fechada</option>
					</select>
				</div>
				<div class="col-6" id="div-inputTotal">
					<label for="editOrderForm-inputTotal" class="form-label">Total</label>
					<input type="text" class="form-control" id="editOrderForm-inputTotal" value="${order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}">
				</div>
				<div id="editOrderItems"><hr>
					${itemFieldsHtml}
				</div>
				<br>
				<div class="col-6">
					<button type="button" class="btn btn-primary" id="editOrderForm-addNewItem"><i class="fas fa-plus"></i> Adicionar Item</button>
				</div>
				<div class="col-6">
					<button type="submit" style="float: right;" class="btn btn-success"><i class="fas fa-check"></i> Salvar Informações</button>
				</div>
					
			</form>
    `;
		order.items.forEach((item, index) => {
			$(`#editOrderItemProduct${index}`).val(item.product_id);
		});
		$('#orderDetailsModalBody').html(orderDetailsHtml);
		$('#orderDetailsModal').modal('show');
	});

	$(document).on('submit', '#editOrderForm', async function (e) {
		e.preventDefault();
		const orders = JSON.parse($("#ordersInstance").val())
		const orderId = $('#editOrderForm-input_id').val();
		const newCustomer = $('#editOrderForm-inputCustomer').val();
		const newNotes = $('#editOrderForm-inputNotes').val();
		const newStatus = $('#editOrderForm-inputStatus').val();
		const newTotal = parseFloat($('#editOrderForm-inputTotal').val().replace('R$', '').replace(',', '.'));
	
		// Iterando pelos itens
		let items = [];
		$('#editOrderItems .row').each(function () {
			const $row = $(this);
			const product_id = $row.find('select').val();
			const quantity = Number($row.find('input[type="number"]').val());
			const price = Number($row.find('select option:selected').data('price'));
			items.push({
				product_id,
				quantity,
				price,
			});
		});
		// Montando o objeto do pedido atualizado
		const updatedOrder = {
			_id: orderId,
			customer: newCustomer,
			notes: newNotes,
			status: newStatus,
			total: newTotal,
			items: items
		};
		try {
			const { data } = await axios.put(baseUrl + '/orders/' + orderId, updatedOrder);
			location.reload();
			return data;
		} catch (error) {
			console.error(error);
		}
		$('#orderDetailsModal').modal('hide');
	});
	
	$(document).on('click', '#editOrderForm-addNewItem', async function () {
		const products = await getProducts();
		const productOptions = products.map(product =>
			`<option value="${product._id}" data-price="${product.price}">${product.name} - ${product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} Un</option>`
		).join('');

		const newItemFields = `
            <div class="row">
                <div class="col-8">
                    <label for="editOrderForm-inputProduct" class="form-label">Produto</label>
                    <select class="form-select" aria-label="Default select example" id="editOrderForm-inputProduct">
                        ${productOptions}
                    </select>
                </div>
                <div class="col-4">
                    <label for="editOrderForm-inputQtd" class="form-label">Quantidade</label>
                    <input type="number" class="form-control" id="editOrderForm-inputQtd">
                </div>
            </div></ br>
        `;
		$('#editOrderItems').append(newItemFields);
	});

	$(document).on('change', '#editOrderItems select, #editOrderItems input', function () {
		let total = 0;
		$('#editOrderItems .row').each(function () {
			const $row = $(this);
			const quantity = Number($row.find('input[type="number"]').val());
			const price = Number($row.find('select option:selected').data('price'));
			total += quantity * price;
		});
		$('#editOrderForm-inputTotal').val(total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
	});
}

const controllerOrders = async () => {
	const orders = await getOrders();
	console.log(orders);
	$('.buildCards').empty();
	orders.forEach(order => {
		if (order.status === 'open') {
			$('.buildCards').append(buildOrder(order));
		}
	});
};

// Builds
const buildOrder = (order) => {
	return `
        <div class="col">
            <div class="card h-100">
                <div class="card-body">
                <h5 class="card-title"><i class="fas fa-user"></i> ${order.customer}</h5>
                <p class="card-text">${order.notes}</p>
                <p class="card-text">${order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                </div>
                <div class="card-footer d-flex justify-content-between align-items-center">
                <small class="text-muted">Aberto</small>
                <button class="btn btn-primary order-detail-button" data-order-id="${order._id}">
                    <i class="fas fa-edit"></i> Detalhes
                </button>
                </div>
            </div>
        </div>
    `
}

// APIs
const getOrders = async () => {
	try {
		const { data } = await axios.get(baseUrl + '/orders');
		$('#ordersInstance').val(JSON.stringify(data))
		return data
	} catch (error) {
		console.error(error);
	}
}

const getProducts = async () => {
	try {
		const { data } = await axios.get(baseUrl + '/products');
		$('#productsInstance').val(JSON.stringify(data))
		return data
	} catch (error) {
		console.error(error);
	}
}

const createOrder = async (order) => {
	try {
		const { data } = await axios.post(baseUrl + '/orders', order);
		return data;
	} catch (error) {
		console.error(error);
		// Você pode querer verificar o formato do erro retornado pela API para melhor manipulá-lo
		toastr("Erro ao criar o pedido: " + error.message);
	}
}




