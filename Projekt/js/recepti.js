$(document).ready(function() {
    console.log(kolaci())
    $("#traziPacijenta").click(function() {
        if (document.getElementById("oibPacijenta").value.length == 11) {
            traziPacijenta();
        } else { console.log("neradi"); }
    });
});

function traziPacijenta() {


    console.log(document.getElementById("oibPacijenta").value);

    displayForm = "<table id='rtable'><thead><tr><th>Datum prepisivanja</th><th>Prepisani ljekovi</th><th>Izdaj lijekove</th></tr></thead>";
    $.ajax({
        url: "../skripte/ajax.php",
        type: "POST",
        data: {
            nadiPacijenta: document.getElementById("oibPacijenta").value
        },
        dataType: "json",
        async: false,
        success: function(data) {
            console.log(data);
            idPacijenta = data[0].idpacijent;


            $(data).each(function(index, value) {

                if (value.izdan == null) {


                    prepisanilijekovi = value.recept;

                    if (prepisanilijekovi !== null) {
                        prepisanilijekovi = value.recept.replace('{', '');
                        prepisanilijekovi = prepisanilijekovi.replace('}', '')

                    }
                    displayForm += "<tr><td><label>" + value.datumpregleda + "</label></td><td><label>" + prepisanilijekovi + "</label></td><td><input onClick='reply_click(this.id)' type='button' id='" + value.idpregled + "|" + prepisanilijekovi + "' value='Izdaj'></td></tr>";
                }

            });
            $("#tablicaIspisa").append(displayForm);

        }
    });

}


function kolaci() {
    //  document.cookie = 'cookie1=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/'
    idDok = 0
    uloga = "ljekarna"
    var match = document.cookie.match(new RegExp('(^| )' + uloga + '=([^;]+)'));
    if (match) {
        idDok = match[2];

    } else {
        console.log('--something went wrong---');
    }

    //document.cookie = 'promijena=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    return idDok;

}

function reply_click(clicked_id) {
    console.log(clicked_id);
    idRecept = clicked_id.replaceAll("|", "-");
    idRecept = idRecept.replaceAll(":", "-");
    idRecept = idRecept.replaceAll(",", "-");
    polje = idRecept.split("-");
    nazivLjekova = [];
    kolicinaLjekova = [];
    console.log(polje);
    console.log(polje.length);
    for (let i = 1; i < polje.length; i = i + 2) {

        nazivLjekova.push(polje[i]);

    }
    for (let i = 2; i < polje.length; i = i + 2) {
        kolicinaLjekova.push(polje[i]);

    }
    kolac = kolaci();
    console.log(polje[0] + " - " + nazivLjekova + " - " + kolicinaLjekova + " - " + kolac);

    $.ajax({
        url: "../skripte/ajax.php",
        type: "POST",
        data: {
            idRecept: polje[0],
            nazivLjekova: nazivLjekova,
            kolicinaLjekova: kolicinaLjekova,
            cookie: kolac

        },
        dataType: "json",
        async: false,
        success: function(data) {

            idPacijenta = data[0].idpacijent;
            if (document.getElementById("rtable") != null) {
                document.getElementById("rtable").remove();
            }
            traziPacijenta();

        }
    });

}