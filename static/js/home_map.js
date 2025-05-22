document.addEventListener("DOMContentLoaded", function () {
    const events = window.eventsData;
    const userLocation = window.userLocation;

    var defaultLatLng = [39.925533, 32.866287];  // Örneğin Ankara koordinatları
    var map = L.map('map').setView(
    userLocation ? [userLocation.lat, userLocation.lng] : defaultLatLng,
    10
    );


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap katkıda bulunanlar'
    }).addTo(map);


    const greenIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const redIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const blueIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    events.forEach(event => {
        if (event.lat && event.lng) {
            const icon = event.is_completed ? greenIcon : redIcon;

            const popupContent = `
                <strong>${event.title}</strong><br>
                ${event.date}<br>
                <button onclick="location.href='${event.detail_url}'">Detayları Gör</button>
            `;
            L.marker([event.lat, event.lng], { icon: icon })
                .addTo(map)
                .bindPopup(popupContent);
        }
    });

    if (userLocation) {
        L.marker([userLocation.lat, userLocation.lng], { icon: blueIcon })
            .addTo(map)
            .bindPopup(`<strong>Senin Konumun</strong>`);

            const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: blueIcon })
            .addTo(map)
            .bindPopup(`<strong>Buradasınız</strong><br>Konumunuza en yakın etkinliklere göz atın!`)
            .openPopup(); // Sayfa yüklendiğinde otomatik olarak göster
    }
});
