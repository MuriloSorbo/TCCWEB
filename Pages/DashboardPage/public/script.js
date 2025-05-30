// Gerando o mapa com várias localizações
// Inicializa o mapa no centro das localizações
const map = L.map('map').setView([-23.5015, -47.4526], 13);

// Camada de fundo
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Lista de localizações [latitude, longitude, descrição]
const locais = [
  [-23.5015, -47.4526, "Local 1"],
  [-23.5050, -47.4600, "Local 2"],
  [-23.4950, -47.4500, "Local 3"]
];

// Adiciona marcadores
locais.forEach(([lat, lng, descricao]) => {
  L.marker([lat, lng]).addTo(map).bindPopup(descricao);
});

//----------------------------------------------------------------------------------------------------------------


document.addEventListener('DOMContentLoaded', function () {
  makeRequest();
});

function makeRequest() {
  const request = new XMLHttpRequest();
  const url = '/machines';

  request.open('GET', url);
  request.addEventListener('load', function () {
    if (this.status == 200) {
      dealRequest(this.responseText);
    }
  });
  request.send();
}

function StartAllOperations() {
  const opName = document.getElementById('opName').value;

  console.log(opName);

  const request = new XMLHttpRequest();
  const url = '/operation/start/all/' + opName;

  request.open('POST', url);

  request.addEventListener('load', function () {
    makeRequest();
  });

  request.send();
}

function StopAllOperations() {
  const request = new XMLHttpRequest();
  const url = '/operation/stop/all';

  request.open('POST', url);

  request.addEventListener('load', function () {
    makeRequest();
  });

  request.send();
}

function dealRequest(machine) {
  const machineJson = JSON.parse(machine)

  document.getElementById('machines').innerHTML = '';
  machineJson.machineCodes.forEach(machineCode => addMachine(machineCode));
}

async function addMachine(machineCode) {
  const request = new XMLHttpRequest();
  const url = '/machines/machineName/' + machineCode;

  request.open('GET', url);
  request.addEventListener('load', function () {
    if (this.status == 200) {
      const machine = JSON.parse(this.responseText);

      let startTime = machine.inOperation ? new Date(machine.operationStartTime) : null;
      const timerId = `timer-${machineCode}`;

      // Exemplo de dados da máquina
      // const machine = {
      //   code: 'XY123',
      //   name: 'Máquina XY',
      //   mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58544.82331172776!2d-47.4873856!3d-23.494656!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c5f51a01916eaf%3A0x95fb7a34d2c347e9!2sTauste%20Itavuvu!5e0!3m2!1sen!2sbr!4v1746103284497!5m2!1sen!2sbr',
      //   timer: '00:17:54',
      //   inOperation: true,
      //   operationName: 'Corte'
      // };


      document.getElementById('machines').innerHTML += `
        <div class="machine-card">
      <div class="map-card">
        <div class="map" id="map${machineCode}"></div>
      </div>
      <div class="machine-name">
        <a href="/main/${machineCode}">${machine.machineName}</a>
      </div>
      <div class="machine-status ${machine.inOperation ? 'status-active' : 'status-inactive'}">
        <h4>${machine.inOperation ? 'Em operação: ' + machine.operationName : 'Fora de operação'}</h4>
      </div>
      <button onclick="${machine.inOperation ? `stopMachine('${machine.code}')` : `startMachine('${machine.code}')`}">
        ${machine.inOperation ? 'Parar' : 'Iniciar'}
      </button>
    </div>
      `;

      setMapPos(machine.lstGeo.split(',')[0], machine.lstGeo.split(',')[1], 'map' + machineCode);
    }
  });
  request.send();
}

function setMapPos(lat, long, target) {
  // Se o mapa ainda não foi criado, crie-o
  
    // Criar o mapa
    const map = new ol.Map({
      target: target,
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
}

// Funções auxiliares adicionadas:
function startMachine(code) {
  const opName = document.getElementById('opName').value;
  const request = new XMLHttpRequest();
  request.open('POST', `/operation/start/${code}/${opName}`);
  request.addEventListener('load', function () {
    makeRequest();
  });
  request.send();
}

function stopMachine(code) {
  const request = new XMLHttpRequest();
  request.open('POST', `/operation/stop/${code}`);
  request.addEventListener('load', function () {
    makeRequest();
  });
  request.send();
}
