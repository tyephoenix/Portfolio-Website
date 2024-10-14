var Characters = [
    'Col. Mustard',
    'Prof. Plum',
    'Mr. Green',
    'Mrs. Peacock',
    'Miss Scarlett',
    'Mrs. White'
];

var Rooms = [
    'Hall',
    'Lounge',
    'Dining Room',
    'Kitchen',
    'Ball Room',
    'Conservatory',
    'Billiard Room',
    'Library',
    'Study'
];

var Weapons = [
    'Knife',
    'Candlestick',
    'Revolver',
    'Rope',
    'Lead Pipe',
    'Wrench'
];

var round = 0;
const blackList = new Map();
const cardInHands = new Map();
const rounds = new Map();

window.onload = function() {
    const style = document.createElement('style');
    style.innerText = '.initPage { display: all; } .gamePage { display: none; } .gridPage { display: none; }';
    document.head.appendChild(style);

    let characterSelect = document.getElementById('characterSelect');
    for (i = 0; i < Characters.length; i++) {
        let option = document.createElement('option');
        option.appendChild(document.createTextNode(Characters[i]));
        characterSelect.appendChild(option);
    }
    let roomSelect = document.getElementById('roomSelect');
    for (i = 0; i < Rooms.length; i++) {
        let option = document.createElement('option');
        option.appendChild(document.createTextNode(Rooms[i]));
        roomSelect.appendChild(option);
    }
    let weaponSelect = document.getElementById('weaponSelect');
    for (i = 0; i < Weapons.length; i++) {
        let option = document.createElement('option');
        option.appendChild(document.createTextNode(Weapons[i]));
        weaponSelect.appendChild(option);
    }
    document.getElementById('addHeldCard').addEventListener('click', function () {
        Characters = Characters.filter(function(value, index, array) {
            return value != characterSelect.value;
        });
        Weapons = Weapons.filter(function(value, index, array) {
            return value != weaponSelect.value;
        });
        Rooms = Rooms.filter(function(value, index, array) {
            return value != roomSelect.value;
        });
        let addedCards = document.getElementById('addedCards');
        if (characterSelect.value != 'nil') {
            let e = document.createElement('li');
            e.appendChild(document.createTextNode(characterSelect.value));
            addedCards.appendChild(e);
            cardInHands.set(characterSelect.value, new HeldCard('You', 'character'))
        }
        if (roomSelect.value != 'nil') {
            let e = document.createElement('li');
            e.appendChild(document.createTextNode(roomSelect.value));
            addedCards.appendChild(e);
            cardInHands.set(roomSelect.value, new HeldCard('You', 'room'))
        }
        if (weaponSelect.value != 'nil') {
            let e = document.createElement('li');
            e.appendChild(document.createTextNode(weaponSelect.value));
            addedCards.appendChild(e);
            cardInHands.set(weaponSelect.value, new HeldCard('You', 'weapon'))
        }
        characterSelect.value = 'nil';
        roomSelect.value = 'nil';
        weaponSelect.value = 'nil';
    });
    document.getElementById('start').addEventListener('click', function () {
        style.innerText = '.initPage { display: none; } .gamePage { display: all; } .gridPage { display: none; }';
        for (i = 0; i < Characters.length; i++) {
            let e = document.createElement('li');
            e.appendChild(document.createTextNode(Characters[i]));
            document.getElementById("possibleCharacters").appendChild(e);
        }
        for (i = 0; i < Rooms.length; i++) {
            let e = document.createElement('li');
            e.appendChild(document.createTextNode(Rooms[i]));
            document.getElementById("possibleRooms").appendChild(e);
        }
        for (i = 0; i < Weapons.length; i++) {
            let e = document.createElement('li');
            e.appendChild(document.createTextNode(Weapons[i]));
            document.getElementById("possibleWeapons").appendChild(e);
        }
    });
    document.getElementById('submitRound').addEventListener('click', function () {
        let name = document.getElementById('flashingPlayer').value;
        let character = document.getElementById('flashedCharacter').value;
        document.getElementById('flashedCharacter').value = 'nil';
        let room = document.getElementById('flashedRoom').value;
        document.getElementById('flashedRoom').value = 'nil';
        let weapon = document.getElementById('flashedWeapon').value;
        document.getElementById('flashedWeapon').value = 'nil';
        
        if (name != '') {
            rounds.set(round, new Move(name, character, room, weapon));
        }

        let noPlayers = document.getElementById('noPlayers').value.split(",");
        for (i = 0; i < noPlayers.length; i++) {
            let player = noPlayers[i].replace(/\s/g, '');
            blackList.set(round, new Move(player, character, room, weapon));
        }
    
        round++;
        iterateWebbing();
    });
    document.getElementById('submitShown').addEventListener('click', function() {
        let name = document.getElementById('showingPlayer').value;
        let character = document.getElementById('shownCharacter').value;
        document.getElementById('shownCharacter').value = 'nil';
        let room = document.getElementById('shownRoom').value;
        document.getElementById('shownRoom').value = 'nil';
        let weapon = document.getElementById('shownWeapon').value;
        document.getElementById('shownWeapon').value = 'nil';

        Characters = Characters.filter(function(value, index, array) {
            return value != character;
        });
        Rooms = Rooms.filter(function(value, index, array) {
            return value != room;
        });
        Weapons = Weapons.filter(function(value, index, array) {
            return value != weapon;
        });
        if (character != 'nil') {
            cardInHands.set(character, new HeldCard(name, 'character'));
        }
        if (weapon != 'nil') {
            cardInHands.set(weapon, new HeldCard(name, 'weapon'));
        }
        if (room != 'nil') {
            cardInHands.set(room, new HeldCard(name, 'room'));
        }

        iterateWebbing();
    });
    document.getElementById('viewGrid').addEventListener('click', function () {
        function createNode(element, text) {
            let node = document.createElement(element);
            node.innerText = text;
            return node;
        }
        let grid = document.getElementById('gameTable');
        removeAllChildNodes(grid);
        let titleRow = document.createElement('tr');
        titleRow.appendChild(createNode('th', 'Card'));
        titleRow.appendChild(createNode('th', 'Player'));
        for (i = 0; i < round; i++) {
            titleRow.appendChild(createNode('th', 'Round ' + (i + 1)));
        }
        grid.appendChild(titleRow);
        let characterArr = [];
        let roomArr = [];
        let weaponArr = [];
        for (i = 0; i < Characters.length; i++) {
            characterArr.push(Characters[i]);
        }
        for (i = 0; i < Rooms.length; i++) {
            roomArr.push(Rooms[i]);
        }
        for (i = 0; i < Weapons.length; i++) {
            weaponArr.push(Weapons[i]);
        }
        for (let [key, value] of cardInHands) {
            if (value.type == 'character') {
                characterArr.push(key);
            } else if (value.type == 'room') {
                roomArr.push(key);
            } else if (value.type == 'weapon') {
                weaponArr.push(key);
            }
        }
        for (i = 0; i < characterArr.length; i++) {
            let character = characterArr[i];
            let row = document.createElement('tr');
            row.appendChild(createNode('td', character));
            let holder = cardInHands.has(character) ? cardInHands.get(character).name : ' ';
            row.appendChild(createNode('td', holder));

            for (j = 0; j < round; j++) {
                let move = rounds.get(j);
                if (typeof(move) != 'undefined') {
                    if (move.character == character) {
                        row.appendChild(createNode('td', move.name));
                    } else {
                        row.appendChild(createNode('td', ' '));
                    }
                }
            }

            grid.appendChild(row);
        }
        grid.appendChild(document.createElement('tr'));
        for (i = 0; i < weaponArr.length; i++) {
            let weapon = weaponArr[i];
            let row = document.createElement('tr');
            row.appendChild(createNode('td', weapon));
            let holder = cardInHands.has(weapon) ? cardInHands.get(weapon).name : ' ';
            row.appendChild(createNode('td', holder));

            for (j = 0; j < round; j++) {
                let move = rounds.get(j);
                if (typeof(move) != 'undefined') {
                    if (move.weapon == weapon) {
                        row.appendChild(createNode('td', move.name));
                    } else {
                        row.appendChild(createNode('td', ' '));
                    }
                }
            }

            grid.appendChild(row);
        }
        grid.appendChild(document.createElement('tr'));
        for (i = 0; i < roomArr.length; i++) {
            let room = roomArr[i];
            let row = document.createElement('tr');
            row.appendChild(createNode('td', room));
            let holder = cardInHands.has(room) ? cardInHands.get(room).name : ' ';
            row.appendChild(createNode('td', holder));

            for (j = 0; j < round; j++) {
                let move = rounds.get(j);
                if (typeof(move) != 'undefined') {
                    if (move.room == room) {
                        row.appendChild(createNode('td', move.name));
                    } else {
                        row.appendChild(createNode('td', ' '));
                    }
                }
            }

            grid.appendChild(row);
        }
        style.innerText = '.initPage { display: none; } .gamePage { display: none; } .gridPage { display: all; }';
    })
    document.getElementById('back').addEventListener('click', function () {
        style.innerText = '.initPage { display: none; } .gamePage { display: all; } .gridPage { display: none; }';
    })
}

function iterateWebbing() {
    for (let [key, value] of rounds) {
        let character = value.character;
        let room = value.room;
        let weapon = value.weapon;
        for (let [key0, value0] of blackList) {
            if (value0.name == value.name) {
                if (value0.character == character) {
                    character = 'nil';
                }
                if (value0.room == room) {
                    room = 'nil';
                }
                if (value0.weapon == weapon) {
                    weapon = 'nil';
                }
            }
        }
        for (let [key0, value0] of cardInHands) {
            if (value0.name == value.name && (character == key0 || room == key0 || weapon == key0)) {
                character = 'nil';
                room = 'nil';
                weapon = 'nil';
            } else {
                if (key0 == character) {
                    character = 'nil';
                } else if (key0 == room) {
                    room = 'nil';
                } else if (key0 == weapon) {
                    weapon = 'nil';
                }
            }
        }
        let arr = [];
        if (character != 'nil') {
            arr.push(character);
        }
        if (weapon != 'nil') {
            arr.push(weapon);
        }
        if (room != 'nil') {
            arr.push(room);
        }
        if (arr.length == 1) {
            let type = 'character';
            if (weapon != 'nil') {
                type = 'weapon';
            }
            if (room != 'nil') {
                type = 'room';
            }
            Characters = Characters.filter(function(value0, index, array) {
                return value0 != arr[0];
            });
            Rooms = Rooms.filter(function(value0, index, array) {
                return value0 != arr[0];
            });
            Weapons = Weapons.filter(function(value0, index, array) {
                return value0 != arr[0];
            });
            cardInHands.set(arr[0], new HeldCard(value.name, type));
            iterateWebbing();
        }
    }
    updateUI();
}

function updateUI() {
    removeAllChildNodes(document.getElementById("possibleCharacters"));
    removeAllChildNodes(document.getElementById("possibleRooms"));
    removeAllChildNodes(document.getElementById("possibleWeapons"));
    for (i = 0; i < Characters.length; i++) {
        let e = document.createElement('li');
        e.appendChild(document.createTextNode(Characters[i]));
        document.getElementById("possibleCharacters").appendChild(e);
    }
    for (i = 0; i < Rooms.length; i++) {
        let e = document.createElement('li');
        e.appendChild(document.createTextNode(Rooms[i]));
        document.getElementById("possibleRooms").appendChild(e);
    }
    for (i = 0; i < Weapons.length; i++) {
        let e = document.createElement('li');
        e.appendChild(document.createTextNode(Weapons[i]));
        document.getElementById("possibleWeapons").appendChild(e);
    }
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

class Move {
    constructor(name, character, room, weapon) {
        this.name = name;
        this.character = character;
        this.room = room;
        this.weapon = weapon;
    }
}

class HeldCard {
    constructor(name, type) {
        this.name = name;
        this.type = type;
    }
}