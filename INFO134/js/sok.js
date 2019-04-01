// link til json data fra en url
var link = 'https://hotell.difi.no/api/json/bergen/dokart?';

// laster in listen på siden(html).
function loadListe(data) {
    var text;
    text = "<ol>";
    for (i = 0; i < data.entries.length; i++) {
        text += "<li>" + data.entries[i].plassering + "</li>";
    }
    text += "</ol>";
    document.getElementById('liste').innerHTML = text;
}

// funksjonen som gjør at list lastes in på siden, som tar in en url og en callback funksjon som parameter
function start() {
    hentData(link, loadListe);
    hentData(link, initMap)

}

// avansert søk knappen, som tar in en url og en callback funksjon parameter
function start2() {
    hentData(link, search);

}

function starten() {
    hentData(link, hurtigsok);

}

function getTimeStart() {
    hentData(link, checkTime);

}

var searchResults = [];
var searchObj = {};

// avansert søk funksjonen
function search(dataUrl) {
    searchResults = [];
    searchObj = {};
    var skjekkHerre = document.getElementById('herre');
    var skjekkDame = document.getElementById('dame');
    var skjekkRullestol = document.getElementById('rullestol');
    var skjekkStellerom = document.getElementById('stellerom');
    var skjekkAapen = document.getElementById('aapen');
    var skjekkGratis = document.getElementById('gratis');

    if (skjekkHerre.checked === true) {
        searchObj.herre = "1";
    }
    if (skjekkDame.checked === true) {
        searchObj.dame = "1";
    }
    if (skjekkRullestol.checked === true) {
        searchObj.rullestol = "1";
    }
    if (skjekkStellerom.checked === true) {
        searchObj.stellerom = "1";
    }
    if (skjekkAapen.checked === true) {
        getTimeStart();

    }
        if (skjekkGratis.checked === true) {
            searchObj.pris = "0";
        }
        //
       //if (skjekkHerre.checked === false && skjekkDame.checked === false && skjekkRullestol.checked === false &&
        //     skjekkStellerom.checked === false && skjekkAapen.checked === false && skjekkGratis.checked === false) {
        //     alert(" Ingenting er markert, du må markere en box  ")
        // }
        check(dataUrl);
        updateToalett();
        updateMap();

    }


    function maksPris(dataUrl) {
        var maxPrisListe = [];
        var input = document.getElementById('makspris').value;
        var inputPris = (/[0-9]+/).exec(input);
        for (i = 0; i < dataUrl.entries.length; i++) {
            var prisTilInt = dataUrl.entries[i].pris;
            var prisInt = parseInt(prisTilInt);
            if (prisInt <= inputPris) {
                maxPrisListe.push(dataUrl.entries[i]);
            }
            if (prisTilInt === "NULL") {
                maxPrisListe.push(dataUrl.entries[i]);
            }
        }
        searchObj.makspris = maxPrisListe;
    }


//checker om stemmer med searchObj og legger den til i searchresult
function check(dataUrl) {
    var search = Object.keys(searchObj);
    for (var i = 0; i < dataUrl.entries.length; i++) {
        var Checker = 0;
        for (var x = 0; x < search.length; x++) {
            if (dataUrl.entries[i][search[x]] === searchObj[search[x]]) {
                Checker++;
            }
        }
        if (Checker === search.length) {
            searchResults.push(dataUrl.entries[i]);
        }
    }
}
// update listen toalett .
function updateToalett() {
    if (searchResults.length > 0) {
        var text;
        text = "<ol>";
        for (var i = 0; i < searchResults.length; i++) {
            text += "<li>" + searchResults[i].plassering + "</li>";
        }
        text += "</ol>";
        document.getElementById('liste').innerHTML = text;
    } else {
        document.getElementById('liste').innerHTML = "Det finnest ingen toaletter med de kriteriumene";
    }
}

function checkTime(dataUrl) {
    var aapen = [];
    //henter ut lokaltid, gjør om til string og kombinerer tid og minutt til ett tall
    var tid = new Date();
    var tidString = tid.toString();
    var time = tidString.substr(16, 2);
    var min = tidString.substr(19, 2);
    var lokaltidCombo = time + min;

    var all = /(ALL)/ig;

    if (tid.getDay() <= 5) {
        for (i = 0; i < dataUrl.entries.length; i++) {
            if (dataUrl["entries"][i]["tid_hverdag"].match(all)) {
                aapenHverdag.push(dataUrl.entries[i]);
            }
            else {
                var hentTidString = dataUrl.entries[i].tid_hverdag;

                var aapenTime = hentTidString.substr(0, 2);
                var aapenMin = hentTidString.substr(3, 2);
                var aapenCombo = aapenTime + aapenMin;

                var stengTime = hentTidString.substr(8, 2);
                var stengMin = hentTidString.substr(11, 2);
                var stengCombo = stengTime + stengMin;

                if (aapenCombo < lokaltidCombo && stengCombo > lokaltidCombo) {
                    aapenHverdag.push(dataUrl.entries[i]);
                }
            }
        }
    }
    if (tid.getDay() === 6) {
        for (i = 0; i < dataUrl.entries.length; i++) {
            if (dataUrl["entries"][i]["tid_lordag"].match(all)) {
                aapen.push(dataUrl.entries[i]);
            }
            else {
                var lorHentTidString = dataUrl.entries[i].tid_hverdag;

                var lorAapenTime = lorHentTidString.substr(0, 2);
                var lorAapenMin = lorHentTidString.substr(3, 2);
                var lorAapenCombo = lorAapenTime + lorAapenMin;

                var lorStengTime = lorHentTidString.substr(8, 2);
                var lorStengMin = lorHentTidString.substr(11, 2);
                var lorStengCombo = lorStengTime + lorStengMin;

                if (lorSapenCombo < lokaltidCombo && lorStengCombo > lokaltidCombo) {
                    aapen.push(dataUrl.entries[i]);
                }
            }
        }
    }
    if (tid.getDay() === 0) {
        for (i = 0; i < dataUrl.entries.length; i++) {
            if (dataUrl["entries"][i]["tid_sondag"].match(all)) {
                aapen.push(dataUrl.entries[i]);
            }
            else {
                var sonHentTidString = dataUrl.entries[i].tid_hverdag;

                var sonAapenTime = sonHentTidString.substr(0, 2);
                var sonAapenMin = sonHentTidString.substr(3, 2);
                var sonAapenCombo = sonAapenTime + sonAapenMin;

                var sonStengTime = sonHentTidString.substr(8, 2);
                var sonStengMin = sonHentTidString.substr(11, 2);
                var sonStengCombo = sonStengTime + sonStengMin;

                if (sonAapenCombo < lokaltidCombo && sonStengCombo > lokaltidCombo) {
                    aapen.push(dataUrl.entries[i]);
                }
            }
        }
    }
    return aapen;
}

// bruker regex til å sjekke om input stemmer med regex
function hurtigsok(dataUrl) {
    searchObj = {};
    searchResults = [];
    var aappen = /(åpen)/i;
    var herre = /(herre)|(gutt)/i;
    var dame = /(dame)|(jente)/i;
    var rullestol = /(rullestol)/i;
    var stelle = /(stellerom)/i;
    var gratis = /(gratis)/i;

    if (herre.test(rasktsok.value)) {
        searchObj.herre = "1";
    }
    if (dame.test(rasktsok.value)) {
        searchObj.dame = "1";
    }
    if (rullestol.test(rasktsok.value)) {
        searchObj.rullestol = "1";
    }
    if (stelle.test(rasktsok.value)) {
        searchObj.stellerom = "1";
    }
    if (gratis.test(rasktsok.value)) {
        searchObj.pris = "0";
    }
    if (aappen.test(rasktsok.value)) {

    }
    check(dataUrl);
    updateToalett();
    updateMap();
}













