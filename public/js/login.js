$(document).ready(function () {
	handlers();
});

const BASE_URL = 'https://lafuria-api-gabrielguedesflores.vercel.app'

const handlers = () => {

	$('#registerSubmit').click(function () {
		let username = $('#registerUsername').val();
		let email = $('#registerEmail').val();
		let password = $('#registerPassword').val();
		if (!username || !email || !password) {
			let toast = new bootstrap.Toast(document.getElementById('formErrorToast'));
			toast.show();
			return;
		}

		let hashedPassword = CryptoJS.SHA256(password);
		let data = {
			username: username,
			email: email,
			password: hashedPassword.toString(),
			role: 'admin',
			dateCreated: new Date().toISOString()
		};

		$('#registerSubmit').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...').addClass('disabled');

		axios.post(`${BASE_URL}/users`, data).then(response => {
			console.log('Success:', response.data);
			axios.post(`${window.location.origin}/start-session`, { userid: response.data._id }).then(response => {
				console.log('Session started:', response.data);
				window.location.replace("/");
			}).catch((error) => {
				console.error('Error:', error);
				$('#registerSubmit').html('Register').removeClass('disabled');
			});
		}).catch((error) => {
			console.error('Error:', error);
			$('#registerSubmit').html('Register').removeClass('disabled');
		});
	});


	$('#loginSubmit').click(function () {
		let email = $('#inputEmail').val();
		let password = $('#inputPassword').val();
		let hashedPassword = CryptoJS.SHA256(password);

		if (!email || !password) {
			var toastEl = document.getElementById('errorToast');
			var toast = new bootstrap.Toast(toastEl);
			toast.show();
			return;
		}

		axios.get(`${BASE_URL}/users`).then(response => {
			let users = response.data;
			let user = users.find(u => u.email === email && u.password === hashedPassword.toString());
			console.log(user._id);
			if (user) {
				console.log('Login successful:', user);
				axios.post(`${window.location.origin}/start-session`, { userid: user._id }).then(response => {
					console.log('Session started:', response.data);
					window.location.replace("/");  // Add this line to redirect to the home page
				}).catch((error) => {
					console.error('Error:', error);
				});
			} else {
				console.log('Invalid email or password.');
			}
		}).catch((error) => {
			console.error('Error:', error);
		});
	});
};
