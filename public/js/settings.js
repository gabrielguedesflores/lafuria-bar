$(document).ready(function () {
	userController()
});
const baseUrl = 'http://localhost:3000';
const userController = async () => {
	const userid = getCookie('userid');
	const user = await getUser(userid);
	if (user) {
		$('#username').val(user.username)
		$('#role').val(user.role)
		$('#email').val(user.email)
		$('#profileImage').val(user.profileImage)
		$('#coverImage').val(user.coverImage)
	}
}

const getUser = async (userid) => {
	try {
		const { data } = await axios.get(baseUrl + '/users');
		const user = data.find(user => user._id === userid);
		return user;
	} catch (error) {
		console.error(error);
	}
}

function getCookie(name) {
	var cookieArr = document.cookie.split(";");
	for (var i = 0; i < cookieArr.length; i++) {
		var cookiePair = cookieArr[i].split("=");
		if (name == cookiePair[0].trim()) {
			return decodeURIComponent(cookiePair[1]);
		}
	}

	return null;
}

const setupFormSubmission = () => {
	$('form').on('submit', async function (e) {
		e.preventDefault();
		const username = $('#username').val();
		const role = $('#role').val();
		const email = $('#email').val();
		const password = $('#password').val();
		const profileImage = $('#profileImage').val();
		const coverImage = $('#coverImage').val();

		const updatedUser = {
			username,
			role,
			email,
			password,
			profileImage,
			coverImage,
		};
		console.log('updatedUser', updatedUser);
		// try {
		// 	const userid = getCookie('userid');
		// 	await updateUser(userid, updatedUser);
		// 	alert('User updated successfully');
		// } catch (error) {
		// 	console.error(error);
		// 	alert('Error updating user');
		// }
	});
}

const updateUser = async (userid, updatedUser) => {
	try {
			await axios.put(`${baseUrl}/users/${userid}`, updatedUser);
	} catch (error) {
			console.error(error);
			throw error;
	}
}