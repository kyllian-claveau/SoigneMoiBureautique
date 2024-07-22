const API_BASE_URL = 'https://soignemoiproject.online/api';

document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: email, password: password }),
        });

        if (!response.ok) {
            throw new Error('Échec de la connexion');
        }

        const data = await response.json();
        const token = data.token; // Supposons que votre API renvoie un objet avec une clé 'token'

        // Stocker le token dans le localStorage
        localStorage.setItem('authToken', token);
        console.log(`Token stored in localStorage: ${token}`);

        const payload = JSON.parse(atob(token.split('.')[1]));

        if (payload.roles.includes('ROLE_SECRETARY')) {
            document.getElementById('auth-message').innerText = 'Je suis Authentifié';
            window.location.href = 'stays.html';
        } else {
            document.getElementById('auth-message').innerText = 'Accès refusé : vous n\'avez pas les droits nécessaires';
        }
    } catch (error) {
        console.error('Error during authentication:', error);
        document.getElementById('auth-message').innerText = 'Erreur lors de la connexion : ' + error.message;
    }
});
