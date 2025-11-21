const Types = {
    LOOT: "loot",
    CONS: "consumables",
    ITEM: "item",
    SHOP: "shop"
}
const Rarity = {
    COMM: "common",
    UNCO: "uncommon",
    RARE: "rare",
    LEGE: "legendary"
}

const LOOT_OUTPUT = document.getElementById("loot-output");


function generateLoot() {
    LOOT_OUTPUT.innerHTML = "";
    var result = generateDicesRoll(Types.ITEM);
    result.forEach((x) => {
        var item = getFromJson(Types.ITEM, x.total);
        LOOT_OUTPUT.innerHTML += "Rolled : " + x.total + " (" + x.diceRolls + ") item :" + item.name["en-US"] + "<br>";
    })
    var result = generateDicesRoll(Types.CONS);
    result.forEach((x) => {
        var item = getFromJson(Types.CONS, x.total);
        LOOT_OUTPUT.innerHTML += "Rolled : " + x.total + " (" + x.diceRolls + ") consumable :" + item.name["en-US"] + "<br>";
    })
}

var armors;
var consumables;
var items;
var weapons;

async function getData(type) {
    const url = "assets/" + type + ".json";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error.message);
    }
}


async function init() {
    armors = await getData("armors");
    consumables = await getData("consumables");
    items = await getData("items");
    weapons = await getData("weapons");

}
init();

function getValuesFromInput(type) {
    var result = [];
    result[0] = getValueFromInput(type, Rarity.COMM);
    result[1] = getValueFromInput(type, Rarity.UNCO);
    result[2] = getValueFromInput(type, Rarity.RARE);
    result[3] = getValueFromInput(type, Rarity.LEGE);
    return result;
}

function getValueFromInput(type, rarity) {
    target = rarity + "-" + type + "-generator";
    var result = document.getElementById(target).value
    if (result == null || result == "")
        return 0;
    result = Number(result);
    return result;
}

function generateDicesRoll(type) {
    RollsToDo = getValuesFromInput(type);
    console.log(RollsToDo);
    var result = [];
    for (var j = 0; j < 4; j++) {
        var extraDice = getExtraDice(j, type);
        for (var i = 0; i < RollsToDo[j]; i++) {
            result.push(roll(j + extraDice + 1));
        }
    }
    return result;
}
function roll(numberOfDices) {
    var diceRolls = [];
    var total = 0;
    for (var i = 0; i < numberOfDices; i++) {
        var rolled = Math.floor(Math.random() * 12 + 1);
        total += rolled;
        diceRolls.push(rolled);
    }
    return { total, diceRolls };
}

function getFromJson(type, number) {
    var data;
    switch (type) {
        case Types.ITEM:
            data = items;
            break;
        case Types.CONS:
            data = consumables;
            break;
    }
    return data[number - 1];
}

function getExtraDice(j, type) {
    var rarity;
    switch (j) {
        case 0:
            rarity = Rarity.COMM;
            break;
        case 1:
            rarity = Rarity.UNCO;
            break;
        case 2:
            rarity = Rarity.RARE;
            break;
        case 3:
            rarity = Rarity.LEGE;
            break;
    }
    target = rarity + "-" + type + "-checkbox";
    return document.getElementById(target).checked ? 1 : 0 ;
}