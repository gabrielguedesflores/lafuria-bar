$(document).ready(function () {
    axios.post('http://localhost:8080/end-session', {}, { withCredentials: true })
        .then(response => {
            console.log('Logout successful:', response.data);
            window.location.href = '/login';
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});