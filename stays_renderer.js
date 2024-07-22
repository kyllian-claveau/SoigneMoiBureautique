const API_BASE_URL = 'https://soignemoiproject.online/api';

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOMContentLoaded event triggered');

    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            document.body.innerHTML = '<div class="alert alert-danger" role="alert">Erreur : Token d\'authentification manquant</div>';
            return;
        }

        console.log('Token found:', token);

        const response = await fetch(`${API_BASE_URL}/stays`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: token }),
        });

        if (!response.ok) {
            throw new Error('Erreur lors du chargement des séjours');
        }

        const stays = await response.json();
        console.log('Stays data:', stays);

        const stayList = document.getElementById('stay-list');
        stays.forEach(stay => {
            console.log('Processing stay:', stay);
            const stayItem = document.createElement('div');
            stayItem.className = 'bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300';
            stayItem.innerHTML = `
                <div class="flex justify-between items-center mb-2">
                    <h5 class="text-lg font-semibold">Séjour de ${stay.user_firstname} ${stay.user_lastname}</h5>
                    <small class="text-gray-600">${stay.start_date} - ${stay.end_date || 'En cours'}</small>
                </div>
				<p class="text-gray-700 mb-1"><strong>Docteur consulté :</strong> ${stay.doctor_firstname} ${stay.doctor_lastname}</p>
                <p class="text-gray-700 mb-1"><strong>Spécialité du docteur:</strong> ${stay.specialty_name}</p>
                <p class="text-gray-700"><strong>Raison:</strong> ${stay.reason}</p>
            `;
            stayItem.addEventListener('click', () => {
                console.log(`Navigating to stay details for stay id: ${stay.id}`);
                window.location.href = `stay_details.html?id=${stay.id}`;
            });
            stayList.appendChild(stayItem);
        });
    } catch (error) {
        console.error('Error fetching stays:', error);

        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
        }

        document.body.innerHTML = '<div class="alert alert-danger" role="alert">Erreur lors du chargement des séjours : ' + error.message + '</div>';
    }
});
