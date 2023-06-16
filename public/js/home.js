$(document).ready(function () {
    controllerOrders();
    // Botão "Abrir Comanda"
    document.getElementById('addOrderBtn').addEventListener('click', function () {
        var myModal = new bootstrap.Modal(document.getElementById('addOrderModal'));
        myModal.show();
    });

    // Botões "Abrir Detalhes" - como podem existir vários botões, utilizamos querySelectorAll
    document.querySelectorAll('.open-details-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var myModal = new bootstrap.Modal(document.getElementById('openDetailsModal'));
            myModal.show();
        });
    });
});

const controllerOrders = async () => {
    const orders = await getOrders();
    console.log(orders);
};

const baseUrl = 'http://localhost:3000';

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

const getOrders = async () => {
    try {
        const { data } = await axios.get(baseUrl + '/orders');
        return data
    } catch (error) {
        console.error(error);
    }
}
