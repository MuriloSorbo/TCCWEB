const menu = document.querySelector(".menu");
const NavMenu = document.querySelector(".nav-menu");

menu.addEventListener("click", () => {
  menu.classList.toggle("ativo");
  NavMenu.classList.toggle("ativo");
});

let lastTemp = 0;
let lastHum = 0;
let operationsList = [];
let setName = false;
let curOpName = "";
let operations = [];
let lastAirHum = 0;
let lastSoloTemperature = 0;

const maxShow = 10;

document.addEventListener("DOMContentLoaded", function () {
  setInterval(askRoutine, 5000);
  setOperation(false, "");
  askRoutine();
});

function askRoutine() {
  const request = new XMLHttpRequest();
  const url = "/download/machinestatus";

  request.open("GET", url);
  request.addEventListener("load", function () {
    if (this.status == 200) {
      dealRequest(this.responseText);
    }
  });
  request.send();

  const request2 = new XMLHttpRequest();
  const url2 = "/download/operationsList";

  request2.open("GET", url2);
  request2.addEventListener("load", function () {
    if (this.status == 200) {
      opList(this.responseText);
    }
  });
  request2.send();
}

function dealRequest(response) {
  json = JSON.parse(response);
  json = json[0];

  setSoloTemperature(json.lstTempSolo);
  setTemperature(json.lstTemp);
  setHumidity(json.lstHum);
  setAirHumidity(json.lstHumAir);
  setMapPos(json.lstGeo.split(",")[0], json.lstGeo.split(",")[1]);
  changeUpdatedTime(json.updatedAt);
  if (!setName) {
    document.getElementById("MACHINE").contentEditable = true;
    document.getElementById("MACHINE").textContent = json.machineName;
    document.getElementById("MACHINE").contentEditable = false;
    setName = true;
  }

  setConnectionStatus(json.connected);

  if (!json.connected) {
    setOperation(false, "");
    return;
  }

  setOperation(json.inOperation, json.operationName);
}

function opList(response) {
  const json = JSON.parse(response);

  if (json.length != operations.length) operations = json;
  else return;

  for (let i = 0; i < Math.min(operations.length, maxShow); i++) {
    const operation = operations[i];

    createButton(operation.opName, convertDateTimeString(operation.dateTime));
  }
}

function setTemperature(val) {
  document.getElementById("tempText").innerHTML = val + "ºC";

  val = parseInt(val);

  startTemp = lastTemp;

  if (val == startTemp) return;

  incrementTemp = val > startTemp ? 1 : -1;

  intervalTemp = setInterval(() => {
    document
      .getElementById("tempCircle")
      .setAttribute("stroke-dasharray", `${startTemp} ${100 - startTemp}`);
    startTemp += incrementTemp;

    if (startTemp == val) clearInterval(intervalTemp);
  }, 10);

  lastTemp = val;
}

function setHumidity(val) {
  document.getElementById("humText").innerHTML = val + "%";

  val = parseInt(val);

  startHum = lastHum;

  if (startHum == val) return;

  incrementHum = val > startHum ? 1 : -1;

  intervalHum = setInterval(() => {
    document
      .getElementById("humCircle")
      .setAttribute("stroke-dasharray", `${startHum} ${100 - startHum}`);
    startHum += incrementHum;

    if (startHum == val) clearInterval(intervalHum);
  }, 10);

  lastHum = val;
}

//aqui começa

function setAirHumidity(val) {
  if (val === undefined || val === null || isNaN(val)) {
    console.warn("⚠ Valor inválido para lstHumAir:", val);
    return;
  }

  val = parseInt(val);
  document.getElementById("airHumText").innerHTML = val + "%"; // Atualiza o número no gráfico

  let startAirHum = lastAirHum;

  if (startAirHum === val) return;

  let incrementAirHum = val > startAirHum ? 1 : -1;

  let intervalAirHum = setInterval(() => {
    document
      .getElementById("airHumCircle")
      .setAttribute("stroke-dasharray", `${startAirHum}, ${100 - startAirHum}`);
    startAirHum += incrementAirHum;

    if (startAirHum === val) clearInterval(intervalAirHum);
  }, 10);

  lastAirHum = val; // Salva o último valor para comparação
}

//aqui termina



function setSoloTemperature(val) {
  // Verificar se `val` é um número válido
  if (isNaN(val) || val === undefined || val === null) {
    console.error("Valor inválido para temperatura do solo:", val);
    return;
  }

  // Atualiza o texto da temperatura no HTML
  document.getElementById("soilTempText").innerHTML = val + "°C";

  val = parseInt(val);

  let startTemp = lastSoloTemperature;

  if (val === startTemp) return;

  let incrementTemp = val > startTemp ? 1 : -1;

  let intervalTemp = setInterval(() => {
    // Garante que os valores não sejam negativos
    let dashValue = Math.max(startTemp, 0);
    let dashRemaining = Math.max(100 - dashValue, 0);

    document
      .getElementById("soilTempCircle")
      .setAttribute("stroke-dasharray", `${dashValue} ${dashRemaining}`);

    startTemp += incrementTemp;

    if (startTemp === val) {
      clearInterval(intervalTemp);
    }
  }, 10);

  lastSoloTemperature = val;
}


//Segundo sensor fim----------------------------

function setOperation(inOperation, opName) {
  if (inOperation) {
    curOpName = opName;
    document.getElementById("opName").innerHTML = "Operação Atual: " + opName;
    document.getElementById("title").style.visibility = "visible";
    document.getElementById("opState").innerHTML = "Em Operação";
    document.getElementById("dotState").style.background = "#f39c12";
  } else {
    curOpName = "";
    document.getElementById("title").style.visibility = "hidden";
    document.getElementById("opState").innerHTML = "Fora de Operação";
    document.getElementById("dotState").style.background = "transparent";
  }
}

function setConnectionStatus(status) {
  if (status) {
    document.getElementById("connectionStatus").innerHTML = "Conectado";
    document.getElementById("connectionStatus").style.color = "#27ae60";
    document.getElementById("dotCon").style.background = "#27ae60";
  } else {
    document.getElementById("connectionStatus").innerHTML = "Desconectado";
    document.getElementById("connectionStatus").style.color = "#e74c3c";
    document.getElementById("dotCon").style.background = "#e74c3c";
  }
}

function changeUpdatedTime(dateTime) {
  const stringDateTime = `Atualizado em: ${convertDateTimeString(dateTime)}`;
  document.getElementById("refreshDate").innerHTML = stringDateTime;
}

function convertDateTimeString(string) {
  const date = new Date(string);

  return `${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}/${
    date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
  }/${date.getFullYear()} - ${
    date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
  }:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}`;
}

function createButton(opName, dateTime) {
  if (operationsList.includes(opName)) return;
  if (curOpName == opName) return;

  operationsList.push(opName);
  const footer = document.getElementById("buttonsContainer");
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");
  footer.appendChild(buttonContainer);

  const button = document.createElement("button");
  button.addEventListener(
    "click",
    () => (window.location.href = "/operation/" + opName)
  );
  button.classList.add("button");
  const btnTitle = document.createElement("span");
  btnTitle.classList.add("btn-title");
  btnTitle.style.display = "inline-block";
  btnTitle.textContent = opName;
  button.appendChild(btnTitle);
  const btnSubtitle = document.createElement("span");
  btnSubtitle.classList.add("btn-subtitle");
  btnSubtitle.textContent = dateTime;
  btnSubtitle.style.display = "inline-block";
  button.appendChild(btnSubtitle);
  buttonContainer.appendChild(button);
}

const editIcon = document.querySelector(".navigation i.material-icons");
const machineName = document.querySelector("#MACHINE");

editIcon.addEventListener("click", () => {
  machineName.contentEditable = true;
  machineName.style.color = "#707070";
  machineName.focus();

  machineName.addEventListener("keydown", (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      if (machineName.textContent.length < 1) return;
      updateMachineName(machineName.textContent);
      machineName.contentEditable = false;
      machineName.style.color = "";
      machineName.style.outline = "";
    } else if (
      machineName.textContent.length >= 10 &&
      event.key !== "Backspace"
    ) {
      event.preventDefault();
    }
  });
});

function updateMachineName(name) {
  const request = new XMLHttpRequest();
  const url = "/upload/machineName";

  request.open("POST", url);
  request.setRequestHeader("Content-Type", "application/json");
  const data = {
    machineName: name,
  };
  request.addEventListener("load", function () {
    if (this.status == 200) {
      console.log("okay");
    }
  });
  request.send(JSON.stringify(data));
}

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.toLowerCase();
  document.getElementById("showAll").style.visibility =
    searchTerm == "" ? "visible" : "hidden";

  if (searchTerm == "") {
    const footer = document.getElementById("buttonsContainer");
    footer.innerHTML = "";
    operationsList = [];
    for (let i = 0; i < Math.min(operations.length, maxShow); i++) {
      const operation = operations[i];

      createButton(operation.opName, convertDateTimeString(operation.dateTime));
    }
    return;
  }

  const footer = document.getElementById("buttonsContainer");
  footer.innerHTML = "";
  operationsList = [];
  const output = operations.filter((operation) =>
    operation.opName.toLowerCase().includes(searchTerm)
  );

  output.forEach((operation) =>
    createButton(operation.opName, convertDateTimeString(operation.dateTime))
  );
});

var map;

function setMapPos(lat, long) {
  // Se o mapa ainda não foi criado, crie-o
  if (!map) {
    // Criar o mapa
    map = new ol.Map({
      target: "map",
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM(),
        }),
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([long, lat]),
        zoom: 15,
      }),
    });

    // Criar uma fonte de vetores para o marcador
    markerSource = new ol.source.Vector();

    // Criar um estilo para o marcador
    var markerStyle = new ol.style.Style({
      image: new ol.style.Icon({
        anchor: [0.5, 1],
        src: "/assets/marker.png", // Ícone do marcador
      }),
    });

    // Criar um recurso (feature) para o marcador
    marker = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat([long, lat])),
    });
    marker.setStyle(markerStyle);

    // Adicionar o marcador à fonte de vetores
    if (lat * long != 0) markerSource.addFeature(marker);

    // Criar uma camada de vetores para o marcador
    var markerLayer = new ol.layer.Vector({
      source: markerSource,
    });

    // Adicionar a camada de vetores ao mapa
    map.addLayer(markerLayer);
  } else {
    // Atualizar a posição do marcador existente
    if (lat !== 0 && long !== 0) {
      marker.setGeometry(new ol.geom.Point(ol.proj.fromLonLat([long, lat])));
    }

    // Atualizar a visualização do mapa
    map.getView().setCenter(ol.proj.fromLonLat([long, lat]));
  }
}

function ShowAll() {
  const footer = document.getElementById("buttonsContainer");
  footer.innerHTML = "";
  document.getElementById("showAll").innerHTML = "Mostrar Menos";
  document.getElementById("showAll").onclick = ShowLess;
  operationsList = [];
  operations.forEach((operation) =>
    createButton(operation.opName, convertDateTimeString(operation.dateTime))
  );
}

function ShowLess() {
  const footer = document.getElementById("buttonsContainer");
  footer.innerHTML = "";
  document.getElementById("showAll").innerHTML = "Mostrar Mais";
  document.getElementById("showAll").onclick = ShowAll;
  operationsList = [];

  for (let i = 0; i < Math.min(operations.length, maxShow); i++) {
    const operation = operations[i];

    createButton(operation.opName, convertDateTimeString(operation.dateTime));
  }
}
