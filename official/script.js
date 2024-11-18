// Tworzenie mapy Leaflet z układem współrzędnych CRS Simple (dla obrazków)
var map = L.map("map", {
  crs: L.CRS.Simple, // Prosty CRS, bez geograficznych współrzędnych
  minZoom: -1.6, // Dostosowanie zoomu
  maxZoom: 1,
  zoomControl: false,
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

function searchDistrict() {
  // Pobierz zapytanie użytkownika i zamień na małe litery dla porównania
  var searchTerm = document.getElementById("search").value.toLowerCase();

  // Usuń wszystkie istniejące markery z mapy, aby odświeżyć wyniki
  map.eachLayer(function (layer) {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });

  // Jeśli zapytanie jest puste lub krótsze niż 2 znaki, zakończ funkcję
  if (!searchTerm || searchTerm.length < 2) {
    return;
  }

  var foundMarkers = []; // Tablica na znalezione markery
  var bounds = L.latLngBounds(); // Zasięg, który zostanie dopasowany do wyników

  // Iteruj przez obiekt `dzielnice`, gdzie klucze to nazwy dzielnic
  for (var dzielnica in dzielnice) {
    // Rozbij nazwę dzielnicy na słowa i przekształć na małe litery
    var words = dzielnica.toLowerCase().split(" ");

    // Rozbij zapytanie na części (słowa) oddzielone spacjami
    var searchTerms = searchTerm.split(" ");

    // Sprawdź, czy każde słowo z zapytania pasuje do dowolnego słowa nazwy dzielnicy
    var matches = searchTerms.every((term) =>
      words.some((word) => word.startsWith(term))
    );

    // Jeśli zapytanie pasuje do nazwy dzielnicy
    if (matches) {
      // Pobierz współrzędne danej dzielnicy
      var coords = dzielnice[dzielnica].koordynaty;

      // Utwórz nowy marker na mapie, ustaw popup z nazwą dzielnicy i dodaj do mapy
      var marker = L.marker(coords)
        .addTo(map)
        .bindPopup(`<b>${dzielnica}</b>`)
        .openPopup();

      // Dodaj marker do tablicy wyników
      foundMarkers.push(marker);

      // Rozszerz zasięg mapy, aby uwzględnić ten marker
      bounds.extend(coords);
    }
  }

  // Jeśli znaleziono dokładnie jeden wynik, ustaw widok na ten marker
  if (foundMarkers.length === 1) {
    map.setView(foundMarkers[0].getLatLng(), 12); // Powiększenie do poziomu 12
  }
  // Jeśli znaleziono więcej niż jeden wynik, dopasuj widok mapy do wszystkich wyników
  else if (foundMarkers.length > 1) {
    map.fitBounds(bounds);
  }
}
