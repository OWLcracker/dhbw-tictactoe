document.getElementById("menu").addEventListener("click", menu);
historyTableElem = document.getElementById("historyTable");

getHistory();

async function getHistory() {
    session_key = '9a6c2b88-ea60-43cd-bf93-3bb438e61f9f';
    let sessionJson = JSON.parse('{ "sessionkey": "' + session_key + '" }');
    await fetch('http://localhost:3000/getHistory', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(sessionJson),
    })
        .then(async function (data) {
            let historyData = await data.json();
            createTable(historyData);
        })
        .catch((e) => {
            console.error('Error:', e);
        });
}

function createTable(historyData) {
    for (let i = 0; i < historyData.length; i++) {
        let tr = document.createElement('tr');

        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        let td3 = document.createElement('td');

        td1.appendChild(document.createTextNode(historyData[i].time));
        td2.appendChild(document.createTextNode(historyData[i].p_win));
        td3.appendChild(document.createTextNode(historyData[i].p_loose));

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);

        historyTableElem.appendChild(tr);
    }
}

function menu() {
    location.href = "#/menu/";
}