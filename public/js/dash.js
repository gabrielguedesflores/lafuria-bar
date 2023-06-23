// Função para obter as vendas
const getOrders = async () => {
	try {
		const { data } = await axios.get("https://lafuria-api-gabrielguedesflores.vercel.app/orders");
		return data;
	} catch (error) {
		console.error(error);
	}
};

const getProducts = async () => {
	try {
		const { data } = await axios.get("https://lafuria-api-gabrielguedesflores.vercel.app/products");
		return data
	} catch (error) {
		console.error(error);
	}
}

const createChart = (contextId, chartType, chartData, chartOptions) => {
	let ctx = document.getElementById(contextId).getContext('2d');
	let chart = new Chart(ctx, {
		type: chartType,
		data: chartData,
		options: chartOptions
	});
};

$(document).ready(async function () {
	let rawData = await getOrders();
	let totalSales = rawData.reduce((acc, cur) => acc + cur.total, 0);
	document.getElementById('totalYearlySales').textContent = `R$ ${totalSales.toFixed(2)}`;

	// Obtém o mês atual
	let currentDate = new Date();
	let currentYear = currentDate.getFullYear();
	let currentMonth = currentDate.getMonth() + 1;
	if (currentMonth < 10) {
		currentMonth = '0' + currentMonth;
	}
	let currentPeriod = `${currentYear}-${currentMonth}`;

	let totalMonthlySales = rawData
		.filter(order => order.date.slice(0, 7) === currentPeriod)
		.reduce((acc, cur) => acc + cur.total, 0);
	document.getElementById('totalMonthlySales').textContent = `R$ ${totalMonthlySales.toFixed(2)}`;

	// Converte o número do mês para nome do mês
	let monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
	document.getElementById('monthlyDescription').textContent = `Valor total do mês de ${monthNames[currentDate.getMonth()]}`;


	

	// Produtos mais vendidos 
	const products = await getProducts();
	let productNames = products.reduce((acc, cur) => {
		acc[cur._id] = cur.name;
		return acc;
	}, {});

	let productSalesCounts = rawData.reduce((acc, cur) => {
		cur.items.forEach(item => {
			// Use o nome do produto em vez do ID
			let productName = productNames[item.product_id];
			if (acc[productName]) {
				acc[productName] += item.quantity;
			} else {
				acc[productName] = item.quantity;
			}
		});
		return acc;
	}, {});
	let productSalesCountsData = {
		labels: Object.keys(productSalesCounts),
		datasets: [{
			data: Object.values(productSalesCounts),
			// As configurações de cor e borda vão aqui
		}]
	};
	createChart('productSalesCountsChart', 'doughnut', productSalesCountsData, {/* As opções do gráfico vão aqui */ });



	// Vendas por mẽs
	let salesByMonth = rawData.reduce((acc, cur) => {
		let month = cur.date.slice(0, 7); // Pegamos o ano e o mês
		if (acc[month]) {
			acc[month] += cur.total;
		} else {
			acc[month] = cur.total;
		}
		return acc;
	}, {});
	let salesByMonthData = {
		labels: Object.keys(salesByMonth),
		datasets: [{
			label: 'Vendas por Mês',
			data: Object.values(salesByMonth),
			// As configurações de cor e borda vão aqui
		}]
	};
	createChart('salesByMonthChart', 'bar', salesByMonthData, {/* As opções do gráfico vão aqui */ });




	// Sales By Product Chart
	let salesByProduct = rawData.reduce((acc, cur) => {
		cur.items.forEach(item => {
			if (acc[item.productId]) {
				acc[item.productId] += item.price;
			} else {
				acc[item.productId] = item.price;
			}
		});
		return acc;
	}, {});
	let salesByProductData = {
		labels: Object.keys(salesByProduct),
		datasets: [{
			label: 'Vendas por Produto',
			data: Object.values(salesByProduct),
			// As configurações de cor e borda vão aqui
		}]
	};
	createChart('salesByProductChart', 'bar', salesByProductData, {/* As opções do gráfico vão aqui */ });

});
