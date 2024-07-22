const API_BASE_URL = 'https://soignemoiproject.online/api';

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const stayId = urlParams.get('id');

    if (!stayId) {
        document.getElementById('stay-details').innerHTML = '<div class="alert alert-danger" role="alert">Erreur : ID de séjour manquant</div>';
        return;
    }

    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            document.getElementById('stay-details').innerHTML = '<div class="alert alert-danger" role="alert">Erreur : Token d\'authentification manquant</div>';
            return;
        }

        console.log('Token found:', token);

        const response = await fetch(`${API_BASE_URL}/stays/${stayId}/details`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: token }),
        });

        if (!response.ok) {
            throw new Error('Erreur lors du chargement des détails du séjour');
        }

        const stayDetails = await response.json();
        console.log('Stay details:', stayDetails);

        const stayDetailsDiv = document.getElementById('stay-details');
        if (!stayDetailsDiv) {
            throw new Error('Element with ID "stay-details" not found');
        }

        stayDetailsDiv.innerHTML = `
            <div class="bg-white shadow-md rounded-lg p-6">
                <h2 class="text-2xl font-bold mb-4">${stayDetails.user_firstname} ${stayDetails.user_lastname}</h2>
				<p class="mb-2"><strong>Docteur consulté:</strong> ${stayDetails.doctor_firstname} ${stayDetails.doctor_lastname}</p>
                <p class="mb-2"><strong>Spécialité du docteur:</strong> ${stayDetails.specialty_name}</p>
                <p class="mb-2"><strong>Raison:</strong> ${stayDetails.reason}</p>
                <p class="mb-2"><strong>Début:</strong> ${stayDetails.start_date}</p>
                <p class="mb-2"><strong>Fin:</strong> ${stayDetails.end_date || 'En cours'}</p>
            </div>
        `;

        const prescriptionsDiv = document.getElementById('prescriptions');
        const reviewsDiv = document.getElementById('reviews');

        // Grouper les prescriptions et les avis par date
        const groupedData = {};

        stayDetails.prescriptions.forEach(prescription => {
            const date = prescription.date;
            if (!groupedData[date]) {
                groupedData[date] = { prescriptions: [], reviews: [] };
            }
            groupedData[date].prescriptions.push(prescription);
        });

        stayDetails.reviews.forEach(review => {
            const date = review.date;
            if (!groupedData[date]) {
                groupedData[date] = { prescriptions: [], reviews: [] };
            }
            groupedData[date].reviews.push(review);
        });

        Object.keys(groupedData).sort().forEach(date => {
            const group = groupedData[date];

            const dateCard = document.createElement('div');
            dateCard.className = 'bg-white shadow-md rounded-lg p-6';

            const dateHeader = document.createElement('h5');
            dateHeader.className = 'text-xl font-bold mb-4';
            dateHeader.innerText = `Prescription(s) et avis du ${date}`;
            dateCard.appendChild(dateHeader);

            if (group.prescriptions.length > 0) {
                const prescriptionsHeader = document.createElement('h6');
                prescriptionsHeader.className = 'text-lg font-semibold mb-2 text-blue-600';
                prescriptionsHeader.innerText = 'Prescriptions:';
                dateCard.appendChild(prescriptionsHeader);

                group.prescriptions.forEach(prescription => {
                    const medications = prescription.medications.map(med => `<li>${med.name} - ${med.dosage}</li>`).join('');
                    const prescriptionDiv = document.createElement('div');
                    prescriptionDiv.className = 'mb-4';
                    prescriptionDiv.innerHTML = `
                        <p class="mb-1"><strong>Du </strong> ${prescription.start_date} <strong>au</strong> ${prescription.end_date}</p>
                        <ul class="list-disc list-inside pl-4">${medications}</ul>
                    `;
                    dateCard.appendChild(prescriptionDiv);
                });
            }

            if (group.reviews.length > 0) {
                const reviewsHeader = document.createElement('h6');
                reviewsHeader.className = 'text-lg font-semibold mb-2 text-blue-600';
                reviewsHeader.innerText = 'Avis:';
                dateCard.appendChild(reviewsHeader);

                group.reviews.forEach(review => {
                    const reviewDiv = document.createElement('div');
                    reviewDiv.className = 'mb-4';
                    reviewDiv.innerHTML = `
                        <p class="mb-1"><strong>${review.title}</strong></p>
                        <p>${review.description}</p>
                    `;
                    dateCard.appendChild(reviewDiv);
                });
            }

            prescriptionsDiv.appendChild(dateCard);
        });

    } catch (error) {
        console.error('Error fetching stay details:', error);

        document.getElementById('stay-details').innerHTML = '<div class="alert alert-danger" role="alert">Erreur lors du chargement des détails du séjour : ' + error.message + '</div>';
    }
});
