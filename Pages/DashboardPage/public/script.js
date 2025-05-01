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

      document.getElementById('machines').innerHTML += `
        <div class="machine-card">
          <a href='/main/${machineCode}' class="machine-link">
            <div class="machine-header" style="display: flex; justify-content: space-between; align-items: center;">
              <h3>${machine.machineName}</h3>
              <span id="${timerId}" class="timer">${startTime ? 'Calculando...' : ''}</span>
            </div>
            <span class="status-badge ${machine.inOperation ? 'status-active' : 'status-inactive'}">
              ${machine.inOperation ? 'Em operação: ' + machine.operationName : 'Inativa'}
            </span>
          </a>
          <button onclick="${machine.inOperation ? `stopMachine('${machineCode}')` : `startMachine('${machineCode}')`}" 
                  class="btn ${machine.inOperation ? 'btn-stop' : 'btn-start'}">
            ${machine.inOperation ? 'Parar' : 'Iniciar'}
          </button>
        </div>
      `;

      if (startTime) {
        setInterval(() => {
          const now = new Date();
          const diff = new Date(now - startTime);
          const hours = String(diff.getUTCHours()).padStart(2, '0');
          const minutes = String(diff.getUTCMinutes()).padStart(2, '0');
          const seconds = String(diff.getUTCSeconds()).padStart(2, '0');
          const timerElement = document.getElementById(timerId);
          if (timerElement) {
            timerElement.textContent = `${hours}:${minutes}:${seconds}`;
          }
        }, 1000);
      }
    }
  });
  request.send();
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
