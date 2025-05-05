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
        <iframe
          src="${machine.mapSrc}"
          width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"
          referrerpolicy="no-referrer-when-downgrade">
        </iframe>
      </div>
      <div class="machine-name">
        <a href="/main/${machine.code}">${machine.machineName}</a>
        <p>${machine.timer}</p>
      </div>
      <div class="machine-status ${machine.inOperation ? 'status-active' : 'status-inactive'}">
        <h4>${machine.inOperation ? 'Em operação: ' + machine.operationName : 'Inativa'}</h4>
      </div>
      <button onclick="${machine.inOperation ? `stopMachine('${machine.code}')` : `startMachine('${machine.code}')`}">
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
