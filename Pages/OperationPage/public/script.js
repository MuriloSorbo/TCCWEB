let lastTemp = 0;
let lastHum = 0;
let opName = "";
let operationsList = []

document.addEventListener('DOMContentLoaded', function () {
  setInterval(askRoutine, 5000);

  opName = window.location.pathname.substring(11)
  document.getElementById('title').innerHTML = opName

  askRoutine();
  const request = new XMLHttpRequest();
  const url = '/download/operationsLog/' + opName;

  request.open('GET', url);
  request.addEventListener('load', function () {
    if (this.status == 200) {
      dealRequest(this.responseText);
    }
  });
  request.send();
});


function askRoutine() {
  const request2 = new XMLHttpRequest();
  const url2 = '/download/machinestatus';

  request2.open('GET', url2);
  request2.addEventListener('load', function () {
    if (this.status == 200) {
      machineStatus(this.responseText);
    }
  });
  request2.send();
}

function machineStatus(response)
{
  json = JSON.parse(response);
  json = json[0];

  document.getElementById('MACHINE').contentEditable = true;
  document.getElementById('MACHINE').textContent = json.machineName;
  document.getElementById('MACHINE').contentEditable = false;

  setConnectionStatus(json.connected);

  if (!json.connected) 
  {
      setOperation(false, "");
      return;
  }

  setOperation(json.inOperation, json.operationName);
}

function dealRequest(response)
{
  json = JSON.parse(response);

  average = getAverage(json);
  time = getTime(json);

  createTempGraph(getAxisTemp(json))
  createHumGraph(getAxisHum(json))

  // setConnectionStatus(json.connected);

  // if (!json.connected) return;

  document.getElementById('grain').innerHTML = json[0].grain;
  document.getElementById('durTime').innerHTML = time.duration
  setTemperature(average.temp);
  setHumidity(average.humAir);
  changeUpdatedTime(time.start);
  setMapPos(average.geo.split(',')[0], average.geo.split(',')[1]);
  // setOperation(json.inOperation, json.operationName);
  
}

function getTime(json)
{
  return { start: convertDateTimeString(json[0].dateTime), duration: getDurationInMinutes(json[0].dateTime, json[json.length - 1].dateTime)}
}

function getDurationInMinutes(dateTime1, dateTime2)
{
  const date1 = new Date(dateTime1);
  const date2 = new Date(dateTime2);

  let diff = (date2.getTime() - date1.getTime()) / 1000;
  diff /= 60

  return Math.abs(Math.round(diff));
}

function getAxisTemp(json)
{
  const delta = []
  const time = []
  let time0 = false;
  json.forEach(log => {
    delta.push(log.temp);
    
    const dateTime = new Date(log.dateTime);
    if (!time0)  time0 = dateTime;

    elapsed = ((dateTime - time0) / 60000).toFixed(1)

    time.push(elapsed)
  });  

  return { y: delta, x: time }
}

function getAxisHum(json)
{
  const delta = []
  const time = []
  let time0 = false;
  json.forEach(log => {
    delta.push(log.humAir);
    
    const dateTime = new Date(log.dateTime);
    if (!time0)  time0 = dateTime;

    elapsed = ((dateTime - time0) / 60000).toFixed(1)

    time.push(elapsed)
  });  

  return { y: delta, x: time }
}

function getAverage(json)
{
  let temp = 0
  let humAir = 0
  let size = 0;
  let geo = "0.000000, 0.000000";

  json.forEach(log => {
    temp += log.temp;
    humAir += log.humAir;
    size += 1

    if (geo == "0.000000, 0.000000") 
    {
      geo = log.geo;
    }
  });  
  
  return {temp: (temp /= size).toFixed(2), humAir: (humAir /= size).toFixed(2), geo: geo}
}

function setTemperature(val) {  
  document.getElementById('tempText').innerHTML = val + 'ºC';

  val = parseInt(val)

  startTemp = lastTemp;

  if (val == startTemp) return;

  incrementTemp = val > startTemp ? 1 : -1;

  intervalTemp = setInterval(() => {
    document
      .getElementById('tempCircle')
      .setAttribute('stroke-dasharray', `${startTemp} ${100 - startTemp}`);
      startTemp += incrementTemp;

    if (startTemp == val) clearInterval(intervalTemp);
  }, 10);

  lastTemp = val;
}

function setHumidity(val) {
  document.getElementById('humText').innerHTML = val + '%';

  val = parseInt(val)

  startHum = lastHum;

  if (startHum == val) return;

  incrementHum = val > startHum ? 1 : -1;

  intervalHum = setInterval(() => {
    document
      .getElementById('humCircle')
      .setAttribute('stroke-dasharray', `${startHum} ${100 - startHum}`);
      startHum += incrementHum;

    if (startHum == val) clearInterval(intervalHum);
  }, 10);

  lastHum = val;
}

function setOperation(inOperation, opName)
{
  if (inOperation)
  {
    document.getElementById('opState').innerHTML = "Em Operação";
    document.getElementById('dotState').style.background = "#f39c12";
  }
  else
  {
    document.getElementById('opState').innerHTML = "Fora de Operação";
    document.getElementById('dotState').style.background = "transparent";
  }
}

function setConnectionStatus(status)
{
  if (status)
  {
    document.getElementById('connectionStatus').innerHTML = "Conectado";
    document.getElementById('connectionStatus').style.color = "#27ae60";
    document.getElementById('dotCon').style.background = "#27ae60";
  }
  else
  {
    document.getElementById('connectionStatus').innerHTML = "Desconectado";
    document.getElementById('connectionStatus').style.color = "#e74c3c";
    document.getElementById('dotCon').style.background = "#e74c3c";
  }
}

function changeUpdatedTime(dateTime)
{
  const stringDateTime = `Realizado em: ${dateTime}`;
  document.getElementById('refreshDate').innerHTML = stringDateTime;
}

function convertDateTimeString(string)
{
  const date = new Date(string);

  return `${(date.getDate() < 10) ? '0' + date.getDate() : date.getDate()}/${(date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)}/${date.getFullYear()} - ${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`
}


const editIcon = document.querySelector('.navigation i.material-icons');
const machineName = document.querySelector('#MACHINE');

var map;

function setMapPos(lat, long)
{ 
    // Se o mapa ainda não foi criado, crie-o
    if (!map) {
      // Criar o mapa
      map = new ol.Map({
        
          target: 'map',
          layers: [
              new ol.layer.Tile({
                  source: new ol.source.OSM()
              })
          ],
          view: new ol.View({
              center: ol.proj.fromLonLat([long, lat]),
              zoom: 15
          })
      });

      // Criar uma fonte de vetores para o marcador
      markerSource = new ol.source.Vector();

      // Criar um estilo para o marcador
      var markerStyle = new ol.style.Style({
          image: new ol.style.Icon({
              anchor: [0.5, 1],
              src: '/assets/marker.png' // Ícone do marcador
          })
      });

      // Criar um recurso (feature) para o marcador
      marker = new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.fromLonLat([long, lat]))
      });
      marker.setStyle(markerStyle);

      // Adicionar o marcador à fonte de vetores
      markerSource.addFeature(marker);

      // Criar uma camada de vetores para o marcador
      var markerLayer = new ol.layer.Vector({
          source: markerSource
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

function adjustBrTag() {
  var brElement = document.querySelector('.br');
  if (window.innerWidth < 785) {

    brElement.innerHTML = '<br>';
  } else {

    brElement.innerHTML = '';
  }
}

adjustBrTag();

window.addEventListener('resize', adjustBrTag);

function createTempGraph(data)
{
  const options = {
    series: [{
      name: "Temperatura",
      data: data.y
    }],
    chart: {
      width: window.innerWidth > 1000 ? window.innerWidth - 150 : window.innerWidth - 20,
      height: 350,
      type: 'line',
      zoom: {
        enabled: true
      },
      toolbar: {
        show: true
      }
    },
    colors: ['#EC6200'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'straight'
    },
    title: {
      text: 'Variação de Temperatura',
      align: 'left'
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'],
        opacity: 0.5
      }
    },
    xaxis: {
      categories: data.x,
      tickPlacement: 'on',
      labels: {
        rotate: -45,
        style: {
          fontSize: '10px'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Temperatura (ºC)'
      }
    }
  };
  
  var chart = new ApexCharts(document.querySelector("#chart"), options);
  chart.render();
}


function createHumGraph(data)
{
  const options1 = {
    series: [{
      name: "Umidade",
      data: data.y
    }],
    chart: {
      width: window.innerWidth > 1000 ? window.innerWidth - 150 : window.innerWidth - 20,
      height: 400,
      type: 'line',
      zoom: {
        enabled: true
      },
      toolbar: {
        show: true
      }
    },
    colors: ['#1abc9c'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'straight'
    },
    title: {
      text: 'Variação de Umidade',
      align: 'left'
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'],
        opacity: 0.5
      }
    },
    xaxis: {
      categories: data.x,
      tickPlacement: 'on',
      labels: {
        rotate: -45,
        style: {
          fontSize: '10px'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Umidade (%)'
      }
    }
  };
  
  var chart1 = new ApexCharts(document.querySelector("#chart1"), options1);
  chart1.render();
}




