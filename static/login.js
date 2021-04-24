function getHouses() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "/houses");
    xhr.send();
    xhr.onreadystatechange = function() {
        if(xhr.readyState==4) {
            if(xhr.status==200) {
                let res = JSON.parse(xhr.responseText);
                renderHouses(res);
            }
        }
    }
}

function renderHouses(houses) {
    let res = '';
    for(let k in houses) {
        res += renderHouse(
            houses[k]["imageURL"],
            houses[k]["houseId"],
            houses[k]["redId"],
            houses[k]["blackId"],
            houses[k]["viewerNum"],
            houses[k]["viewerLimit"]
            )
    }
    document.getElementById("houses").innerHTML = res;
}

function renderHouse(imageURL, houseId, redId, blackId, viewerNum, viewerLimit) {
    let buttonDisable1 = ''
    let buttonDisable2 = ''
    if(redId && blackId) {
        buttonDisable1 = `disable="disable" style="background-color: #888"`;
    }
    if(parseInt(viewerNum) >= parseInt(viewerLimit)) {
        buttonDisable2 = `disable="disable" style="background-color: #888"`;
    }
    imageURL = imageURL ? imageURL : '';
    houseId = houseId ? houseId : '';
    redId = redId ? redId : '';
    blackId = blackId ? blackId : '';
    return `
    <div class="house">
        <div class="pic">
            <img src="${imageURL}">
        </div>
        <div class="houseMessage">
            <div>房间号:<span>${houseId}</span></div>
            <div>红方ID:<span>${redId}</span></div>
            <div>黑方ID:<span>${blackId}</span></div>
            <div>观战人数:<span>${viewerNum}/${viewerLimit}</span></div>
            <div class="join">
                <button ${buttonDisable1} onclick="joinHouse(${houseId})">加入房间</button>
                <button ${buttonDisable2} onclick="viewPlay(${houseId})">观战</button>
            </div>
        </div>
    </div>
    `
}

function joinHouse(houseId) {
    window.location.href = `/joinhouse?houseId=${houseId}`;
}

function viewPlay(houseId) {
    window.location.href = `/viewplay?houseId=${houseId}`;
}

function quickStart() {
    window.location.href = "/quickstart";
}
function offline() {
    window.location.href = "/offline";
}
function createHouse() {
    window.location.href = "/createhouse";
}
getHouses();
window.setInterval(getHouses, 3000);