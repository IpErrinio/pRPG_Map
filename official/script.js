// Tworzenie mapy Leaflet z układem współrzędnych CRS Simple (dla obrazków)
var map = L.map("map", {
  crs: L.CRS.Simple, // Prosty CRS, bez geograficznych współrzędnych
  minZoom: -1, // Dostosowanie zoomu
  maxZoom: 1,
  zoomControl: true,
  maxBounds: [
    [0, 0],
    [1545, 1545],
  ], // Granice mapy ustawione na rozmiar obrazu
  maxBoundsViscosity: 1.0, // Zabezpiecza przed przesunięciem mapy poza granice
});

// Ustawienie granic mapy odpowiadających rozdzielczości obrazu (1545x1545 pikseli)
var bounds = [
  [0, 0],
  [1545, 1545],
]; // Granice obrazu to jego rzeczywiste rozmiary

// Ustawienie obrazu mapy w pełnych wymiarach
var image = L.imageOverlay("images/mapa_ctvrti.jpg", bounds).addTo(map);
map.fitBounds(bounds); // Dopasowanie widoku mapy do obrazu

// Funkcja do wyszukiwania dzielnic
function searchDistrict() {
  var searchTerm = document.getElementById("search").value.toLowerCase();

  // Usuwanie istniejących markerów
  map.eachLayer(function (layer) {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });

  // Jeśli pole wyszukiwania jest puste, zakończ funkcję
  if (!searchTerm) {
    return;
  }

  // Wyszukaj jeśli użytkownik wpisze minimum 2 litery
  if (searchTerm.length < 2) {
    return;
  }

  var foundMarkers = [];
  var bounds = L.latLngBounds(); // Tworzenie obiektu do zbierania granic

  // Przeszukiwanie bazy dzielnic
  for (var dzielnica in dzielnice) {
    if (dzielnica.toLowerCase().includes(searchTerm.toLowerCase())) {
      var coords = dzielnice[dzielnica].koordynaty;

      // Dodanie markera w znalezionej dzielnicy
      var marker = L.marker(coords)
        .addTo(map)
        .bindPopup(`<b>${dzielnica}</b>`)
        .openPopup();
      foundMarkers.push(marker); // Dodanie markera do tablicy
      bounds.extend(coords); // Dodanie koordynatów do granic
    }
  }

  if (foundMarkers.length === 1) {
    map.setView(coords, 0);
    // Jeśli jest tylko jeden wynik, zbliż na ten wynik
  } else if (foundMarkers.length > 1) {
    // Jeśli jest więcej wyników, wyśrodkuj mapę na wszystkie wyniki
    map.fitBounds(bounds);
  }
}

// Funkcja przekształcająca piksele na współrzędne na mapie Leaflet
function przeksztalcNaWspolrzedne(x, y) {
  return [y, x]; // Leaflet używa współrzędnych w odwróconej kolejności
}

// function searchDistrict() {
//   var searchTerm = document.getElementById("search").value.toLowerCase();

//   // Usuwanie istniejących markerów
//   map.eachLayer(function (layer) {
//     if (layer instanceof L.Marker) {
//       map.removeLayer(layer);
//     }
//   });

//   // Jeśli pole wyszukiwania jest puste, zakończ funkcję
//   if (!searchTerm) {
//     return;
//   }

//   var found = false;

//   // Przeszukiwanie bazy dzielnic
//   for (var dzielnica in dzielnice) {
//     if (dzielnica.toLowerCase().includes(searchTerm.toLowerCase())) {
//       var coords = dzielnice[dzielnica].koordynaty;

//       // Dodanie markera w znalezionej dzielnicy
//       L.marker(coords).addTo(map).bindPopup(`<b>${dzielnica}</b>`).openPopup();
//       map.setView(coords, 0); // Zoom na znalezioną dzielnicę
//       found = true;
//     }
//   }
// }
