$(document).ready(function () {
	handlers();
});

const handlers = () => {
	$('#registerSubmit').click(function () {
		var username = $('#registerUsername').val();
		var email = $('#registerEmail').val();
		var password = $('#registerPassword').val();
		var hashedPassword = CryptoJS.SHA256(password); // Importe a biblioteca CryptoJS para que isso funcione

		var data = {
			username: username,
			email: email,
			password: hashedPassword.toString(),
			role: 'admin',
			dateCreated: new Date().toISOString()
		};

		axios.post('http://localhost:3000/users', data)
			.then(response => {
				console.log('Success:', response.data);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	});

	$('#loginSubmit').click(function () {
		var email = $('#inputEmail').val();
		var password = $('#inputPassword').val();
		var hashedPassword = CryptoJS.SHA256(password);
		console.log(email, password, hashedPassword);
		axios.get('http://localhost:3000/users')
			.then(response => {
				var users = response.data;
				var user = users.find(u => u.email === email && u.password === hashedPassword.toString());

				console.log(user._id);
				if (user) {
					console.log('Login successful:', user);
					axios.post('http://localhost:8080/start-session', { userid: user._id })
						.then(response => {
							console.log('Session started:', response.data);
							window.location.replace("/");  // Add this line to redirect to the home page
						})
						.catch((error) => {
							console.error('Error:', error);
						});
				} else {
					console.log('Invalid email or password.');
				}
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	});
};
