var link = 'https://tp.data.uib.no/KEYadyga6u4a/ws/room/2.0/rooms.php?id=213';

function startRom() {
    hentData(link, createList);

}


function sortNummer() {
    hentData(link,sortStørrelse );
}



function createList(rom) {
    var text;
    text = "<ol>";
    for (var i = 0; i < rom.data.length; i++) {
        text += "<li>" + rom.data[i].name + " ," + "størrelse:" +  rom.data[i].size   + "</li>";
    }
    text += "</ol>";
    document.getElementById('rom').innerHTML = text;
}


 var navnN =[];

function sortStørrelse (rom) {
     navnN = [];
    for (var i = 0; i < rom.data.length; i++) {
        navnN.push(rom.data[i])
    }
    navnN.sort(function(a, b){return b.size - a.size});

    updateListeRom();

}



function updateListeRom() {
    var text;
    text = "<ol>";
    for (var i = 0; i < navnN.length; i++) {
        text += "<li>" + navnN[i].name + " ," + "størrelse:" +  navnN[i].size + "</li>";
    }
    text += "</ol>";
    document.getElementById('rom').innerHTML = text;
}
