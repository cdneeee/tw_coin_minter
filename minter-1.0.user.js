// ==UserScript==
// @name         minter
// @description  Automatically mint coins if there are resources
// @author       cdneee
// @version      1.1
// @include      https://*/game.php*=snob*
// ==/UserScript==


let scriptStatus;
let scriptRunningInterval;
let cooldownDuration;

/* Run every 7 seconds */
function startScript(){
    scriptRunningInterval = setInterval(function() {
    if (!scriptStatus) {
        clearInterval(scriptRunningInterval);}
    else{
        var wood = resInfo("wood");
        var stone = resInfo("stone");
        var iron = resInfo("iron");

        var woodPriceString = document.querySelector('#coin_cost_wood .value').textContent;
        woodPriceString = woodPriceString.replace(/\D/g, '');
        var woodPrice = parseInt(woodPriceString, 10);

        var stonePriceString = document.querySelector('#coin_cost_stone .value').textContent;
        stonePriceString = stonePriceString.replace(/\D/g, '');
        var stonePrice = parseInt(stonePriceString, 10);

        var ironPriceString = document.querySelector('#coin_cost_iron .value').textContent;
        ironPriceString = ironPriceString.replace(/\D/g, '');
        var ironPrice = parseInt(ironPriceString, 10);

        var coins = maxCoins(wood, stone, iron, woodPrice, stonePrice, ironPrice);

        if(coins > 0){
            document.querySelector('#coin_mint_count').value = coins;
            document.getElementsByClassName("btn btn-default")[0].click();
        }
    }
    }, cooldownDuration);
}


init();
function init() {
    const putEleBefore = document.getElementById("content_value");
    let newDiv = document.createElement("div");
    let newTable = `<table id="autoMintTable">
        <tr>
            <td><button id="startMintingScript" class="btn">Start</button></td>
        </tr>
        <tr>
            <td>Mint cooldown:</td>
            <td><input id='CooldownInput' style='width:30px'></td>
            <td><button id='CooldownBtn' class='btn'>OK</button></td>
            <td><span id='CooldownText'></span></td>
        </tr>
        </table>`;

    newDiv.innerHTML = newTable;
    putEleBefore.parentElement.parentElement.insertBefore(newDiv, putEleBefore.parentElement);

    eventListeners();

    if (localStorage.scriptStatus) {
        scriptStatus = JSON.parse(localStorage.scriptStatus);
        if (scriptStatus) {
            document.getElementById("startMintingScript").innerText = "Stop";
            startScript();
        }
    }

}


function maxCoins(wood, stone, iron, woodPrice, stonePrice, ironPrice){
    var woodCoins = Math.floor(wood / woodPrice);
    var stoneCoins = Math.floor(stone / stonePrice);
    var ironCoins = Math.floor(iron / ironPrice);

    return Math.min(woodCoins, stoneCoins, ironCoins)

}

function isInteger(x) {
    "use strict";
    return (typeof x === 'number') && (x % 1 === 0);
}


function eventListeners() {

    document.getElementById("startMintingScript").addEventListener("click", function() {
        if (document.getElementById("startMintingScript").innerText === "Start") {
            document.getElementById("startMintingScript").innerText = "Stop";
            scriptStatus = true;
            localStorage.scriptStatus = JSON.stringify(scriptStatus);
            startScript(); // Start the script
        } else {
            document.getElementById("startMintingScript").innerText = "Start";
            scriptStatus = false;
            localStorage.scriptStatus = JSON.stringify(scriptStatus);
            clearInterval(scriptRunningInterval); // Stop the script by clearing the interval
        }
    });
}
document.getElementById("CooldownBtn").addEventListener("click", function () {
    let cDur = parseInt(document.getElementById("CooldownInput").value);
    if (!isNaN(cDur) && cDur > 0) {
        cooldownDuration = cDur * 60000
    } else {
        alert("Please enter a valid number");
    }
});

/* Call for every resource to get the info */
function resInfo(res) {
    var number;
    switch(res) {
        case "wood":
            number = 0;
            break;
        case "stone":
            number = 1;
            break;
        case "iron":
            number = 2;
            break;
    }
    var inVillage = parseInt(document.getElementById(res).innerText);
    return inVillage;
}
