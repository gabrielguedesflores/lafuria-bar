$(document).ready(function () {
	// $('#productPrice').mask('R$ ##,00', { reverse: true });
	$('#productPrice').maskMoney({ prefix:'R$ ', allowNegative: true, thousands:'.', decimal:',', affixesStay: true});
	$('#newProductPrice').maskMoney({ prefix:'R$ ', allowNegative: true, thousands:'.', decimal:',', affixesStay: true});
	productsController();
	handler();
});

let productsList = []; // Variável global para armazenar a lista de produtos

const baseUrl = 'http://localhost:3000';

const handler = async() => {
	$('#editProductForm').on('submit', async function (e) {
		e.preventDefault();
		let product = {
			_id: $('#productId').val(),
			name: $('#productName').val(),
			description: $('#productDescription').val(),
			price: parseFloat($('#productPrice').val().replace(/[^\d,]/g, '').replace(',', '.')),
			category: $('#productCategory').val()
		};
		console.log('product', product);
		const put = await putProduct(product)
	});

	$('#addProductForm').on('submit', async function (e) {
		e.preventDefault();
		let product = {
			name: $('#newProductName').val(),
			description: $('#newProductDescription').val(),
			price: parseFloat($('#newProductPrice').val().replace(/[^\d,]/g, '').replace(',', '.')),
			category: $('#newProductCategory').val()
		};
		const create = await createProduct(product);
	});
	
}

const getProducts = async () => {
	try {
		const { data } = await axios.get(baseUrl + '/products');
		productsList = data; // Armazenando os produtos na variável global
		return data;
	} catch (error) {
		console.error(error);
	}
}

const putProduct = async (product) => {
	try {
		const { data } = await axios.put(`${baseUrl}/products/${product._id}`, product);
		console.log(data);
		location.reload();
		return data;
	} catch (error) {
		console.error(error);
	}
}

const editProduct = (id) => {
	// Procurando o produto na lista de produtos
	const product = productsList.find(product => product._id === id);
	$('#productId').val(product._id);
	$('#productName').val(product.name);
	$('#productDescription').val(product.description);
	$('#productPrice').val(product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
	$('#productCategory').val(product.category);
	$('#editProductModal').modal('show');
}

const createProduct = async (product) => {
	try {
		const { data } = await axios.post(`${baseUrl}/products`, product);
		console.log(data);
		location.reload();
		return data;
	} catch (error) {
		console.error(error);
	}
}

const deleteProduct = async(id) => {
	// Implementar função para excluir produto
	console.log('Excluir produto: ', id);
	try {
		const { data } = await axios.delete(`${baseUrl}/products/${id}`)
		console.log(data);
		location.reload();
		return data;
	} catch (error) {
		console.error(error);
	}
}

const productsController = async () => {
	const products = await getProducts();
	let productRows = products.map(product => {
		return `
			<tr>
				<td>${product.name}</td>
				<td>${product.description}</td>
				<td>${product.category}</td>
				<td>${product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
				<td>
					<button class="btn btn-sm btn-primary" onclick="editProduct('${product._id}')"><i class="fas fa-edit"></i> Editar</button>
					<button class="btn btn-sm btn-danger" onclick="deleteProduct('${product._id}')"><i class="fas fa-trash-alt"></i> Excluir</button>
				</td>
			</tr>
		`;
	}).join('');
	$('#productList').html(productRows);
}
