// Fonction pour obtenir l'heure actuelle et l'afficher
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    const timeString = `${hours}:${minutes}:${seconds}`;
    document.getElementById('clock').textContent = timeString;
}

// Fonction pour obtenir la localisation approximative
function updateLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                // Appel à l'API de géocodage inversé pour obtenir la ville
                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`)
                    .then(response => response.json())
                    .then(data => {
                        const city = data.address.city || data.address.town || data.address.village || 'Ville inconnue';
                        const locationString = `Vous êtes à ${city}`;
                        document.getElementById('location').textContent = locationString;
                    })
                    .catch(error => {
                        console.error('Erreur lors de la récupération de la localisation:', error);
                        document.getElementById('location').textContent = 'Localisation non disponible';
                    });
            },
            (error) => {
                console.error('Erreur de géolocalisation :', error);
                document.getElementById('location').textContent = 'Localisation non disponible';
            }
        );
    } else {
        document.getElementById('location').textContent = 'Géolocalisation non supportée';
    }
}

// Fonction pour ajouter une ville à l'historique
function addToHistory(cityName, fromSuggestion = false) {
    const historyList = document.getElementById('history-list');
    const now = new Date();
    const timestamp = now.toLocaleString(); // Date et heure actuelles

    const listItem = document.createElement('li');
    listItem.textContent = `${cityName} - Visité le ${timestamp}`;
    
    if (fromSuggestion) {
        listItem.textContent += ' (vue avec les suggestions)';
    }
    
    historyList.appendChild(listItem);
}

// Initialiser la carte
const map = L.map('map').setView([46.603354, 1.888334], 6); // Centré sur la France

// Ajouter une couche de tuiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Points de la France
const points = [
    { name: 'Paris', coords: [48.8566, 2.3522], info: 'Capitale de la France, connue pour la Tour Eiffel et le Musée du Louvre.', wiki: 'https://fr.wikipedia.org/wiki/Paris' },
    { name: 'Marseille', coords: [43.2965, 5.3698], info: "La plus grande ville portuaire de France, célèbre pour son Vieux-Port et sa Bouillabaisse.", wiki: 'https://fr.wikipedia.org/wiki/Marseille' },
    { name: 'Lyon', coords: [45.7640, 4.8357], info: 'Connu pour ses monuments historiques et architecturaux, ainsi que pour sa cuisine.', wiki: 'https://fr.wikipedia.org/wiki/Lyon' },
    { name: 'Toulouse', coords: [43.6047, 1.4442], info: 'La quatrième plus grande ville de France, connue pour son industrie aérospatiale et ses bâtiments en terre cuite rose.', wiki: 'https://fr.wikipedia.org/wiki/Toulouse' },
    { name: 'Nice', coords: [43.7102, 7.2620], info: 'Ville de la Côte dAzur connue pour ses plages méditerranéennes et sa Promenade des Anglais.', wiki: 'https://fr.wikipedia.org/wiki/Nice' },
    { name: 'Nantes', coords: [47.2184, -1.5536], info: 'Situé sur la Loire, connu pour son histoire maritime et les Machines de lÎle de Nantes.', wiki: 'https://fr.wikipedia.org/wiki/Nantes' },
    { name: 'Strasbourg', coords: [48.5734, 7.7521], info: 'Connue pour sa belle vieille ville, sa cathédrale gothique et comme siège de plusieurs institutions européennes.', wiki: 'https://fr.wikipedia.org/wiki/Strasbourg' },
    { name: 'Montpellier', coords: [43.6111, 3.8767], info: 'Ville du sud de la France connue pour ses rues médiévales et la place historique de la Comédie.', wiki: 'https://fr.wikipedia.org/wiki/Montpellier' },
    { name: 'Bordeaux', coords: [44.8378, -0.5792], info: 'Célèbre pour son vin et son architecture historique, dont la place de la Bourse et le miroir dEau.', wiki: 'https://fr.wikipedia.org/wiki/Bordeaux' },
    { name: 'Lille', coords: [50.6292, 3.0573], info: 'Ville du nord de la France connue pour sa scène culturelle dynamique et son centre historique.', wiki: 'https://fr.wikipedia.org/wiki/Lille' }
];

let currentCity = null; // Variable pour stocker la ville actuelle

// Ajouter des marqueurs et des popups
points.forEach(point => {
    L.marker(point.coords).addTo(map)
        .bindPopup(`<b>${point.name}</b><br>${point.info}<br><a href="${point.wiki}" target="_blank">En savoir plus</a>`)
        .on('click', function () {
            document.getElementById('info').innerHTML = `<b>${point.name}</b><br>${point.info}<br><a href="${point.wiki}" target="_blank">En savoir plus</a>`;
            addToHistory(point.name); // Ajoute la ville à l'historique
        });
});



















function showSuggestions() {
    const input = document.getElementById('search-bar').value.toLowerCase();
    const suggestionsList = document.getElementById('suggestions-list');
    suggestionsList.innerHTML = ''; // Vide la liste des suggestions

    if (input.length > 0) {
        points.forEach(point => {
            if (point.name.toLowerCase().startsWith(input)) {
                const suggestionItem = document.createElement('li');
                suggestionItem.textContent = point.name;
                suggestionItem.onclick = () => selectCity(point.name);
                suggestionsList.appendChild(suggestionItem);
            }
        });
    }
}

// Fonction pour rechercher et centrer la ville sur la carte
function searchCity() {
    const input = document.getElementById('search-bar').value.toLowerCase();
    const city = points.find(point => point.name.toLowerCase() === input);

    if (city) {
        centerMap(city.name);
        addToHistory(city.name, true); // Ajoute la ville à l'historique avec indication
    } else {
        alert('Ville non trouvée');
    }
}

// Fonction pour sélectionner une ville via les suggestions
function selectCity(cityName) {
    document.getElementById('search-bar').value = cityName;
    centerMap(cityName);
    addToHistory(cityName, true); // Ajoute la ville à l'historique avec indication
}

// Fonction pour centrer la carte sur une ville
function centerMap(cityName) {
    const city = points.find(point => point.name === cityName);
    if (city) {
        map.setView(city.coords, 10); // Centre la carte sur les coordonnées de la ville
        L.popup()
            .setLatLng(city.coords)
            .setContent(`<b>${city.name}</b><br>${city.info}<br><a href="${city.wiki}" target="_blank">En savoir plus</a>`)
            .openOn(map);
        addToHistory(city.name); // Ajoute la ville à l'historique
    }
}








