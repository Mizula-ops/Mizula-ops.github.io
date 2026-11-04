//Kod wzorowany na kodzie z wykładów użyto z wykładów kod do utworzenia mapy L.map(), ustawienie środka i przybliżenia
// Dodanie warstwy mapy, funckja getcurent position oraz drawImage() i getContext do użycia canvas
// Z reszta funckji pomógł mi copilot i chatpgt

// Początkowe współrzędne Szczecina
const latitude = 53.4285;
const longitude = 14.5528;

// Utworzenie mapy
const map = L.map("map").setView([latitude, longitude], 13);

// Dodanie warstwy mapy
L.tileLayer.provider('Esri.WorldImagery').addTo(map);
const locationBtn = document.getElementById("locationBtn");
document.getElementById("locationBtn").addEventListener("click", function(event) {

  if (!navigator.geolocation) {
    console.log("No geolocation.");
    return;
  }
  navigator.geolocation.getCurrentPosition(position => {
    console.log(position);
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    document.getElementById("coordinates").textContent =
      `Współrzędne: ${lat}, ${lon}`;

    map.setView([lat, lon], 15);

    L.marker([lat, lon]).addTo(map).bindPopup("Moja lokalizacja").openPopup();
    }, positionError => {
    console.error(positionError);
  });
});
document.getElementById("downloadBtn").addEventListener("click", function() {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
  leafletImage(map, function(err, canvas) {

    if (err) {
      console.error(err);
      return;
    }

    let rasterMap = document.getElementById("rasterMap");
    let rasterContext = rasterMap.getContext("2d");

    rasterContext.clearRect(0, 0, rasterMap.width, rasterMap.height);

    rasterContext.drawImage(canvas, 0, 0, rasterMap.width, rasterMap.height);
    createBoard();
    createPuzzles(rasterMap);
  });
});
function createPuzzles(canvas) {
  let puzzzleContainer = document.getElementById("puzzleContainer");
  puzzzleContainer.innerHTML = "";
  let pieces = [];
  let rows = 4;
  let cols = 4;
  let pieceWidth = canvas.width / cols;
  let pieceHeight = canvas.height / rows;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let puzzlePiece = document.createElement("canvas");
      puzzlePiece.width = pieceWidth;
      puzzlePiece.height = pieceHeight;

      puzzlePiece.classList.add("puzzle");
      puzzlePiece.draggable = true;
      puzzlePiece.id = `piece-${row * cols + col}`;
      puzzlePiece.addEventListener("dragstart", function(event) {
        event.dataTransfer.setData("text/plain", puzzlePiece.id);
      });
      let context = puzzlePiece.getContext("2d");
      context.drawImage(canvas, col * pieceWidth, row * pieceHeight, pieceWidth, pieceHeight, 0, 0, pieceWidth, pieceHeight);

      pieces.push(puzzlePiece);
    }
  }
  // Algorytm Fisher-Yates do losowego tasowania elementów w tablicy
  for (let i = pieces.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));

    let temp = pieces[i];
    pieces[i] = pieces[j];
    pieces[j] = temp;
  }
  for (let piece of pieces) {
    puzzzleContainer.appendChild(piece);
  }
}

function createBoard() {

  let puzzleBoard = document.getElementById("puzzleBoard");

  puzzleBoard.innerHTML = "";

  for (let i = 0; i < 16; i++) {

    let field = document.createElement("div");

    field.classList.add("puzzleField");
    field.addEventListener("dragover", function(event) {
      event.preventDefault();
    });
    field.addEventListener("drop", function(event) {
      event.preventDefault();
      let pieceId = event.dataTransfer.getData("text/plain");
      let piece = document.getElementById(pieceId);
      if (!piece) {
        return;
      }
      let source = piece.parentElement;
      let otherPiece = field.firstElementChild;
      if (otherPiece !== piece) {
        if (otherPiece) {
          source.appendChild(otherPiece);
        }
        field.appendChild(piece);

        if (checkPuzzle()) {
          console.debug("Wszystkie puzzle zostały poprawnie ułożone!");
          showWinNotification();

        }

      }

    });
    puzzleBoard.appendChild(field);
  }
}

createBoard();
function checkPuzzle() {

  let fields = document.querySelectorAll(".puzzleField");

  for (let i = 0; i < fields.length; i++) {

    let piece = fields[i].firstElementChild;

    if (!piece || piece.id !== `piece-${i}`) {
      return false;
    }
  }

  return fields.length === 16;
}

let puzzleContainer = document.getElementById("puzzleContainer");

puzzleContainer.addEventListener("dragover", function(event) {
  event.preventDefault();
});

puzzleContainer.addEventListener("drop", function(event) {
  event.preventDefault();

  let pieceId = event.dataTransfer.getData("text/plain");
  let piece = document.getElementById(pieceId);

  if (piece && piece.parentElement.classList.contains("puzzleField")) {
    puzzleContainer.appendChild(piece);
  }
});
function showWinNotification() {
  const message = "Gratulacje! Poprawnie ułożyłeś puzzle!";

  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("Puzzle ułożone!", {
      body: message
    });
  } else {
    alert(message);
  }
}
