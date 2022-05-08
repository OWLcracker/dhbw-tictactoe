document.getElementById("menu").addEventListener("click", menu);
historyTableElem = document.getElementById("historyTable");

getHistory();

async function getHistory() {
    let sessionJson = JSON.parse('{ "sessionkey": "' + user.session_key + '" }');
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
    console.log(historyData);
    let tb = document.createElement('tbody');
    let tr = document.createElement('tr');

    let th1 = document.createElement('th');
    let th2 = document.createElement('th');
    let th3 = document.createElement('th');
    let th4 = document.createElement('th');

    th1.appendChild(document.createTextNode('Date'));
    th2.appendChild(document.createTextNode('Winner'));
    th3.appendChild(document.createTextNode('Looser'));
    th4.appendChild(document.createTextNode('Draw?'));

    tr.appendChild(th1);
    tr.appendChild(th2);
    tr.appendChild(th3);
    tr.appendChild(th4);

    tb.appendChild(tr);

    for (let i = 0; i < historyData.length; i++) {
        tr = document.createElement('tr');

        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        let td3 = document.createElement('td');
        let td4 = document.createElement('td');

        td1.appendChild(document.createTextNode(convertTimestamp(historyData[i].time)));
        td2.appendChild(document.createTextNode(historyData[i].p_win));
        td3.appendChild(document.createTextNode(historyData[i].p_loose));
        if (historyData[i].is_draw) {
            td4.appendChild(document.createTextNode('X'));
        } else {
            td4.appendChild(document.createTextNode(''));
        }

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);

        tb.appendChild(tr);
    }

    historyTableElem.appendChild(tb);
}

function convertTimestamp(timestamp) {
    const timestampSplit = timestamp.split('T');
    const date = timestampSplit[0];
    const time = timestampSplit[1].substring(0, 8);
    return date + ' ' + time;
}

function menu() {
    location.href = "#/menu/";
}