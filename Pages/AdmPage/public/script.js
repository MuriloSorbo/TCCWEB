window.addEventListener('load', function (event) {
    
    const url = '/adm/connections';

    const request = new XMLHttpRequest();
    request.open('GET', url);
    request.addEventListener('load', function () {
        dealConnections(this.responseText);
    });
    request.send();

});

function dealConnections(connections)
{
    
    const items = document.getElementById('items');
    JSON.parse(connections).forEach(connection => 
    {
        items.innerHTML += `<div class="item">
        <p id="companyName">${connection.dbName}</p>
        <p id="codigoDeAcesso">Código de Acesso: </p>
        <p id="accessCode">${connection.accessCode}</p>
    </div>`
    });
}