$(document).ready(function() {



    prikazBolesti();
    $("#bolest").click(function(event) {

        prikazBolesti();

    });


    $("#recepti").click(function(event) {

        prikazRecepata();

    });

});


function kolaci() {
    idUloga = 0;
    uloga = "pacijent"
    var match = document.cookie.match(new RegExp('(^| )' + uloga + '=([^;]+)'));
    if (match) {
        idUloga = match[2];
    } else {
        console.log('--something went wrong---');
    }
    return idUloga;
}

function prikazBolesti() {
    if (document.getElementById("rtable") != null) {
        document.getElementById("rtable").remove();
    }

    displayForm = "<table id='rtable'><thead><tr><th>Ime</th><th>Prezime</th><th>Bolnica</th><th>Specijalizacija</th>" +
        "<th>Datum</th><th>Prepisani lijekovi</th><th>Nalaz</th></tr></thead>";
    $.ajax({
        url: "../skripte/ajax.php",
        type: "POST",
        data: {
            povijestBolesti: kolaci()
        },
        dataType: "json",
        async: false,
        success: function(data) {


            $(data).each(function(index, value) {

                prepisanilijekovi = value.recept;

                if (prepisanilijekovi !== null) {
                    prepisanilijekovi = value.recept.replace('{', '');
                    prepisanilijekovi = prepisanilijekovi.replace('}', '')

                } else {
                    prepisanilijekovi = "Nisu prepisani";
                }
                if (value.lijekovi !== null && value.izdan === null) {
                    boja = '#8c1212';
                } else(boja = 'black');

                displayForm += "<tr><td><label>" + value.ime + "</label></td><td><label>" + value.prezime + "</label></label></td><td><label>" + value.naziv + "</label></td>"
                displayForm += "<td><label>" + value.spec + "</label></td><td><label>" + value.datumpregleda + "</label></label></td><td><label>" + prepisanilijekovi + "</label></td>"
                if (value.putanja !== null) {
                    displayForm += "<td><input onClick='reply_click(this.id)' value='Nalaz' id='" + value.putanja + "' type='button'></td></tr>"
                } else {
                    displayForm += "<td></td></tr>"
                }

            });
            $("#tablicaIspisa").append(displayForm);

        }
    });
}

function reply_click(clicked_id) {
    popupWindow("../img/" + clicked_id + "", 'test', window, 500, 500);
}


function popupWindow(url, windowName, win, w, h) {
    const y = win.top.outerHeight / 2 + win.top.screenY - (h / 2);
    const x = win.top.outerWidth / 2 + win.top.screenX - (w / 2);
    return win.open(url, windowName, `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${y}, left=${x}`);
}

function prikazRecepata() {
    document.getElementById("rtable").remove();
    displayForm = "<table id='rtable'><thead><tr><th>Lijekovi</th><th>Prepisan</tr></thead>";
    $.ajax({
        url: "../skripte/ajax.php",
        type: "POST",
        data: {
            receptiPacijent: kolaci()
        },
        dataType: "json",
        async: false,
        success: function(data) {
            console.log(data)
            $(data).each(function(index, value) {

                prepisanilijekovi = value.recept;
                prepisanilijekovi = value.recept.replace('{', '');
                prepisanilijekovi = prepisanilijekovi.replace('}', '')
                displayForm += "<tr><td><label>" + prepisanilijekovi + "</label></td><td><label>" + value.datumpregleda + "</label></td>"

            });
            $("#tablicaIspisa").append(displayForm);

        }
    });

}