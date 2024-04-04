// ==UserScript==
// @name         minter
// @description  Automatically mint coins if there are resources
// @author       cdneee
// @version      1.01
// @include      https://*/game.php*=snob*
// ==/UserScript==



/* Run every 7 seconds */
setInterval(function() {
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
}, 1200000);

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
