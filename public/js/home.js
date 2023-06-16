$(document).ready(function () {
    controllerOrders();
    handlers();
});

const baseUrl = 'http://localhost:3000';

const controllerOrders = async () => {
    const orders = await getOrders();
    console.log(orders);
};

const buildOrder = (order) => {
    return `
    <div class="col">
        <div class="card h-100">
            <div class="card-body">
                <h5 class="card-title">${order.customer}</h5>
                <p class="card-text">${order.customer}</p>
                <p class="card-text">${order.customer}</p>
            </div>
            <div class="card-footer">
                <small class="text-muted">Abrir detalhes</small>
            </div>
        </div>
    </div>
    `
}

const getOrders = async() => {
    try {
        const { data } = await axios.get(baseUrl + '/orders');
        $('#ordersInstance').val(JSON.stringify(data))
        return data
    } catch (error) {
        console.error(error);
    }
}

const createOrder = async(order) => {
    try {
        const { data } = await axios.post(baseUrl + '/orders', order);
        return data;
    } catch (error) {
        console.error(error);
        // Você pode querer verificar o formato do erro retornado pela API para melhor manipulá-lo
        toastr("Erro ao criar o pedido: " + error.message); 
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

    $('#itemsList').on('change', 'select, input', function() {
        let total = 0;
        $('#itemsList .row').each(function() {
            const $row = $(this);
            const quantity = Number($row.find('input[type="number"]').val());
            const price = Number($row.find('select option:selected').data('price'));
            total += quantity * price;
        });
        $('#inputTotal').val(total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
    });

    $('#newOrderForm').on('submit', async function(e) {
        e.preventDefault(); // para prevenir a submissão do formulário
        const customer = $('#inputCustomer').val();
        const notes = $('#inputNotes').val();
        const total = parseFloat($('#inputTotal').val().replace('R$', '').replace(',', '.'));
        const status = $('#inputStatus').val();
        const date = new Date().toISOString();
    
        // Iterando pelos items
        let items = [];
        $('#itemsList .row').each(function() {
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
        console.log(orderData);
        const response = await createOrder(orderData);
        if(response) {
            toastr.success("Pedido criado com sucesso!")
        }
    });
    

}
