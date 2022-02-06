$(document).ready(function() {

    ljekarnaPrikaz();


});

function ljekarna() {


    displayForm = "<table id='rtable'><thead><tr><th>Povečaj za</th></tr></thead>";
    $.ajax({
        url: "../skripte/ajax.php",
        type: "POST",
        data: {
            skladiste: kolaci()
        },
        dataType: "json",
        async: false,
        success: function(data) {
            console.log(data);
            idPacijenta = data[0].idpacijent;


            $(data).each(function(index, value) {


                displayForm += "<tr><td><input id='" + index + "' type='text' value=''></input></td><td><input onClick='reply_click(this.id)' type='button' id='" + value.idljekarna + "|" + value.naziv + "|" + index + "' value='Potvrdi'></td></tr>";
            });
            $("#tablicaIspisa").append(displayForm);
        }
    });

}

function ljekarnaPrikaz() {
    if (document.getElementById("rtable")) {
        document.getElementById("rtable").remove();
    }
    console.log("kolaci" + kolaci());
    displayForm = "<table id='rtable'><thead><tr><th>Naziv</th><th>Kolicina</th></tr></thead>";
    $.ajax({
        url: "../skripte/ajax.php",
        type: "POST",
        data: {
            skladiste: kolaci()
        },
        dataType: "json",
        async: false,
        success: function(data) {
            console.log(data);
            idPacijenta = data[0].idpacijent;


            $(data).each(function(index, value) {


                displayForm += "<tr><td><label>" + value.naziv + "</label></td><td><input disabled style='text-align:center;' id='kolicina" + index + " type='text' value='" + value.kolicina + "'></input></td></tr>";
            });
            $("#tablicaIspisa").append(displayForm);
        }
    });
    ljekarna();
}


function kolaci() {
    //  document.cookie = 'cookie1=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/'

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

function reply_click(clicke_id) {
    console.log(clicke_id);
    kolicina = clicke_id.split('|');
    console.log(document.getElementById(kolicina[2]).value);
    //var kolicina = document.getElementById
    updateSkladiste = clicke_id.split('|');
    slanjeUpdate = [updateSkladiste[0], updateSkladiste[1], document.getElementById(kolicina[2]).value];
    console.log(slanjeUpdate[1]);

    $.ajax({
        url: "../skripte/ajax.php",
        type: "POST",
        data: {
            updateSkladiste: slanjeUpdate
        },
        dataType: "json",
        async: false,
        success: function(data) {
            console.log(data);
            console.log(document.getElementById("rtable").value == null);
            if (document.getElementById("rtable").value == null) {
                document.getElementById("rtable").remove();
            }
            ljekarnaPrikaz();


        }
    });

}