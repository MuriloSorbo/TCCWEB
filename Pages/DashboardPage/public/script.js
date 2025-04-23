document.addEventListener('DOMContentLoaded', function () {
  makeRequest();
});

function makeRequest()
{
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

function StartAllOperations()
{
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

function StopAllOperations()
{
  const request = new XMLHttpRequest();
  const url = '/operation/stop/all';
  
  request.open('POST', url);

  request.addEventListener('load', function () {
    makeRequest();
  });

  request.send();
}

function dealRequest(machine)
{
    const machineJson = JSON.parse(machine)
    
    document.getElementById('machines').innerHTML = '';
    machineJson.machineCodes.forEach(machineCode => addMachine(machineCode));
}

async function addMachine(machineCode)
{
    const request = new XMLHttpRequest();
    const url = '/machines/machineName/' + machineCode;
  
    request.open('GET', url);
    request.addEventListener('load', function () {
      if (this.status == 200) {
        const machine = JSON.parse(this.responseText);
        
        document.getElementById('machines').innerHTML += `<a href='/main/${machineCode}'>${machine.machineName.concat((machine.inOperation) ? ' (Em operacao:' + machine.operationName + ')' : '')}</a><br>`    
      }
    });
    request.send();
}