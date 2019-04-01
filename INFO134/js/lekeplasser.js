var lekeplass = 'https://hotell.difi.no/api/json/bergen/lekeplasser?';

// funksjonen som gjør at list lastes in på siden, som tar in en url og en callback funksjon som parameter
// og laster in kart på siden.
function startLekeplass() {
    hentData(lekeplass, lekeplassListe);
    hentData(lekeplass, initMap)
}


function finnlekeplass() {
    hentData(lekeplass, finn);
}

// lager listen på siden.
function lekeplassListe(data) {
    var text;
    text = "<ol>";
    for (i = 0; i < data.entries.length; i++) {
        text += "<li>" + data.entries[i].navn + "</li>";
    }
    text += "</ol>";
    document.getElementById('listeLekeplass').innerHTML = text;

}



// global liste, slik den kan bli brukt i andre funksjoner .
var searchResults = [];

// funksjon som brukest til å søke i listen med value som er i input.
function finn(dataUrl) {
    searchResults = []; // tømmer searchResults
    check(dataUrl);

    updateLekeplass();
    updateMap();
}


//checker om input.value stemmer med searchObj
function check(dataUrl) {
    var sjekk = document.getElementById('finne');
    var searchObj = {"navn": sjekk.value};
    var search = Object.keys(searchObj);
    for (var i = 0; i < dataUrl.entries.length; i++) {
        var checker = 0;
        for (var x = 0; x < search.length; x++) {
            if (dataUrl.entries[i][search[x]] === searchObj[search[x]]) {
                checker++;
            }

        }
        if (checker === search.length) {
            searchResults.push(dataUrl.entries[i]);
        }
    }
}

// opptaderer lekeplass listen
function updateLekeplass() {

    if (searchResults.length > 0) {
        var text;
        text = "<ol>";
        for (i = 0; i < searchResults.length; i++) {
            text += "<li>" + searchResults[i].navn + "</li>";
        }
        text += "</ol>";
        document.getElementById('listeLekeplass').innerHTML = text;
    } else {

        document.getElementById('listeLekeplass').innerHTML = "Det finnest ingen lekeplass med dette navnet";
    }


}

