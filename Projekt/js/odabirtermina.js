var uloga = 0;
const days = ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"];
const time = ["07:00:00", "08:00:00", "09:00:00", "10:00:00", "11:00:00", "12:00:00", "13:00:00", "14:00:00", "15:00:00", "16:00:00", "17:00:00", "18:00:00", "19:00:00", "20:00:00", "21:00:00"];

$(document).ready(function() {

    datumxd = document.getElementById("start").value = datum();
    document.getElementById("start").min = datum();
    console.log(kolacDoktor());
    console.log(kolacPacijent());


    prikazivanjeTermina(kolacPacijent());
    dohvatiGrad();
    var uspredivanje = 0;


    $("#grad").click(function() {

        if (document.getElementById("grad").value != 0 && uspredivanje != document.getElementById("grad").value) {

            dohvatiLijecnika();
            uspredivanje = document.getElementById("grad").value;
            if (document.getElementById("rtable") != null) {
                document.getElementById("rtable").remove();
            }
        }
    });

    $("#start").click(function() {

        document.getElementById("prikazTermina").style.visibility = "visible";
    });

    $("#pregledTermina").click(function() {

        prikazivanjeTermina();
        terminiPregled();

    });
    $("#prikazTermina").click(function() {

        console.log("Stisnuto");
        displayAppointment();
        disableInputs();
        enableInputs();

    });


});

function terminiPregled() {

    if (document.getElementById("rtable") != null) {
        document.getElementById("rtable").remove();

    }
    document.getElementById("tablicaIspisa").style.visibility = "visible";


    displayForm = "<table id='rtable'><thead><tr><th>Ime</th><th>Prezime</th><th>Bolnica</th><th>Specijalizacija</th>" +
        "<th>Datum</th><th>Vrijeme</th><th>Otkazati termin</th><th></th></tr></thead>";

    $.ajax({
        url: "../skripte/ajax.php",
        type: "POST",
        data: {
            selectTermini: kolacPacijent()
        },
        dataType: "json",
        async: false,
        success: function(data) {
            console.log(data)
            if (data.postoji != "Ne") {
                $(data).each(function(index, value) {
                    console.log(value.promijena)
                    if (value.promijena == "1") {
                        console.log("Mora uci");
                        displayForm += "<tr></tr></r><td><label>" + value.ime + "</label></td><td><label>" + value.prezime + "</label></td><td><label>" + value.bolnica + "</label></td>"
                        displayForm += "<td><label>" + value.specijalizacija + "</label></td><td><label>" + value.datum + "</label></td><td><label>" + value.vrijemod + "-" + value.vrijemedo + "</label></td>"
                        displayForm += "<td><input onClick='otkazivanje(this.id)' value='Otkaži' id='" + value.idnarucivanje + "' type='button'></td>"
                        displayForm += "<td><input onClick='prihvacanje(this.id)' value='Prihvati' id='" + value.idnarucivanje + "' type='button'></td></tr>"
                    } else {
                        console.log("Dolje");
                        displayForm += "<tr><td><label>" + value.ime + "</label></td><td><label>" + value.prezime + "</label></td><td><label>" + value.bolnica + "</label></td>"
                        displayForm += "<td><label>" + value.specijalizacija + "</label></td><td><label>" + value.datum + "</label></td><td><label>" + value.vrijemod + "-" + value.vrijemedo + "</label></td>"
                        displayForm += "<td><input onClick='otkazivanje(this.id)' value='Otkaži' id='" + value.idnarucivanje + "' type='button'></td></tr>"
                    }

                });
            }

        }


    });
    $("#tablicaIspisa").append(displayForm);

}

function otkazivanje(clicked_id) {

    $.ajax({
        url: "../skripte/ajax.php",
        type: "POST",
        data: {
            otkazivanje: clicked_id
        },
        dataType: "json",
        async: false,
        success: function(data) {
            if (document.getElementById("rtable") != null) {
                document.getElementById("rtable").remove();
            }
            terminiPregled();
        }
    });
}

function prihvacanje(klik_id) {
    console.log(klik_id);
    $.ajax({
        url: "../skripte/ajax.php",
        type: "POST",
        data: {
            prihvacanje: klik_id
        },
        dataType: "json",
        async: false,
        success: function(data) {
            console.log(data)
            if (document.getElementById("rtable") != null) {
                document.getElementById("rtable").remove();
            }
            terminiPregled();
        }
    });
}



function dohvatiGrad() {
    $.ajax({
        url: "../skripte/ajax.php",
        type: "POST",
        data: {
            grad: ""
        },
        dataType: "json",
        async: false,
        success: function(data) {

            selectGrad = document.getElementById('grad');

            for (let i = 0; i < data.length; i++) {
                var option = document.createElement('option');
                option.value = data[i].idgrad;
                option.innerHTML = data[i].ime;
                selectGrad.appendChild(option);
            }
        }
    });
}

function dohvatiLijecnika() {
    var idGrad = document.getElementById("grad").value;
    $.ajax({
        url: "../skripte/ajax.php",
        type: "POST",
        data: {
            doktor: idGrad
        },
        dataType: "json",
        async: false,
        success: function(data) {
            var selectDoktor = document.getElementById("doktor");
            var length = selectDoktor.options.length;

            for (i = length + 1; i > 0; i--) {
                selectDoktor.options[i] = null;
            }

            selectDoktor = document.getElementById('doktor');
            for (let i = 0; i < data.length; i++) {
                var option = document.createElement('option');
                option.value = data[i].idlijecnik;
                option.innerHTML = data[i].ime + " " + data[i].prezime + " | " + data[i].naziv;
                selectDoktor.appendChild(option);
            }


        }
    });
}

function displayAppointment() {

    if (document.getElementById("rtable") != null) {
        document.getElementById("rtable").remove();
    }

    var displayForm = "";
    terminVarijabla = document.getElementById("doktor").value;
    datumVarijabla = document.getElementById("start").value;


    displayForm = "<form id='formaTermina' method='post'>";
    //displayForm += "<table id='rtable'><thead><tr><th >Ponedjeljak</th><th  >Utorak</th><th  >Srijeda</th><th  >Četvrtak</th><th  >Petak</th></tr></thead>";
    displayForm = "<table id='rtable'><thead><tr><th></th><th scope='col'>Ponedjeljak</th><th scope='col' >Utorak</th><th scope='col' >Srijeda</th><th scope='col' >Četvrtak</th><th scope='col' >Petak</th></tr></thead>";
    for (let i = 0; i < 14; i++) {
        displayForm += "<td id='checkTime" + i + "'>" + (i + 7) + ":00</td>" +
            "<td><input id=PonedjeljakX" + i + " type='button' name='workTime' onClick='reply_click(this.id)'>" +
            "<td><input id=UtorakX" + i + " type='button' name='workTime' onClick='reply_click(this.id)'>" +
            "<td><input id=SrijedaX" + i + " type='button' name='workTime' onClick='reply_click(this.id)'>" +
            "<td><input id=ČetvrtakX" + i + " type='button' name='workTime' onClick='reply_click(this.id)'>" +
            "<td><input id=PetakX" + i + " type='button' name='workTime' onClick='reply_click(this.id)'></tr>"
    }
    $.ajax({
        url: "../skripte/ajax.php",
        type: "POST",
        data: {
            termin: terminVarijabla,
            datumTermina: datumVarijabla
        },
        dataType: "json",
        async: false,
        success: function(data) {

            displayForm += "</form>";
            $("#tablicaIspisa").append(displayForm);
            setWorkTime(data, time, days);
        }
    });



}

function setWorkTime(data, time, days) {


    for (let i = 0; i < data.length; i++) {

        for (let j = 0; j < 5; j++) {
            for (let k = 0; k < 14; k++) {

                if (data[i].vrijemod == time[k] && data[i].naziv == days[j]) {
                    if (data[i].naziv == "Ponedjeljak" && data[i].datum != document.getElementById("start").value) {

                        document.getElementById("PonedjeljakX" + k).value = data[i].vrijemod.substr(0, 5) + "-" + data[i].vrijemedo.substr(0, 5);
                        document.getElementById("PonedjeljakX" + k).classList.add("ponedjeljak");

                    } else if (data[i].naziv == "Utorak" && data[i].datum != document.getElementById("start").value) {
                        document.getElementById("UtorakX" + k).value = data[i].vrijemod.substr(0, 5) + "-" + data[i].vrijemedo.substr(0, 5);
                        document.getElementById("UtorakX" + k).classList.add("utorak");

                    } else if (data[i].naziv == "Srijeda" && data[i].datum != document.getElementById("start").value) {
                        document.getElementById("SrijedaX" + k).value = data[i].vrijemod.substr(0, 5) + "-" + data[i].vrijemedo.substr(0, 5);
                        document.getElementById("SrijedaX" + k).classList.add("srijeda");

                    } else if (data[i].naziv == "Četvrtak" && data[i].datum != document.getElementById("start").value) {
                        document.getElementById("ČetvrtakX" + k).value = data[i].vrijemod.substr(0, 5) + "-" + data[i].vrijemedo.substr(0, 5);
                        document.getElementById("ČetvrtakX" + k).classList.add("četvrtak");

                    } else if (data[i].naziv == "Petak" && data[i].datum != document.getElementById("start").value) {
                        document.getElementById("PetakX" + k).value = data[i].vrijemod.substr(0, 5) + "-" + data[i].vrijemedo.substr(0, 5);
                        document.getElementById("PetakX" + k).classList.add("petak");

                    } else break;

                }
            }
        }


    }
}

function disableInputs() {
    var inputs = document.getElementsByTagName("INPUT");
    for (var i = 0; i < inputs.length; i++) {

        if (inputs[i].type === 'button') {
            inputs[i].disabled = true;
        } else {
            inputs[i].disabled = false;
        }
    }
}

function datum() {
    mjesec = 0;
    var datum = Date();
    split = datum.split(' ');

    if (split[1] == "Jan") {
        mjesec = '01';
    } else if (split[1] == "Feb") {
        mjesec = '02';
    } else if (split[1] == "Mar") {
        mjesec = '03';
    } else if (split[1] == "Apr") {
        mjesec = '04';
    } else if (split[1] == "May") {
        mjesec = '05';
    } else if (split[1] == "Jun") {
        mjesec = '06';
    } else if (split[1] == "Jul") {
        mjesec = '07';
    } else if (split[1] == "Aug") {
        mjesec = '08';
    } else if (split[1] == "Sept") {
        mjesec = '09';
    } else if (split[1] == "Oct") {
        mjesec = 10;
    } else if (split[1] == "Nov") {
        mjesec = 11;
    } else {
        mjesec = 12;
    }
    datumIspis = split[3] + "-" + mjesec + "-" + split[2];
    return datumIspis;

}

function enableInputs() {

    inputs = document.getElementsByClassName(konverzijaDatuma());

    for (let i = 0; i < inputs.length; i++) {
        inputs[i].disabled = false;
        console.log(inputs[i]);
    }
}

function reply_click(clicked_id) {
    var bool = document.getElementById(clicked_id).value;
    array = bool.split('-');
    zauzimanjeRezervacije();
    document.getElementById("pregledTermina").style.visibility = "visible";

    document.getElementById("rtable").remove();


}

function konverzijaDatuma() {
    var vrijeme = new Date(document.getElementById("start").value);
    danUTjednu = vrijeme.toLocaleDateString("hr", { weekday: 'long' });
    console.log("ovo je danuTjednu" + danUTjednu);
    console.log(danUBroju = konverzijaDana(danUTjednu));
    return danUTjednu;
}

function zauzimanjeRezervacije() {


    var doktor = document.getElementById("doktor").value;
    danUTjednu = konverzijaDatuma();
    danUBroju = konverzijaDana(danUTjednu);
    console.log(danUTjednu);
    console.log("ovo je doktor" + doktor);
    picker = document.getElementById("start").value;
    podaci = [];
    console.log(danUBroju + " | " + array[0] + " | " + array[1] + " | " + kolacPacijent() + " | " + doktor + " | " + picker);
    if (doktor != 0) {
        podaci = [danUBroju, array[0], array[1], kolacPacijent(), doktor, picker];
    }

    $.ajax({
        url: "../skripte/ajax.php",
        type: "POST",
        data: {
            podaci: podaci
        },
        dataType: "json",
        async: false,
        success: function(data) {
            console.log("Upisano");
            alert("Odabrali ste termin " + picker + " od: " + array[0] + " do: " + array[1]);
            displayAppointment();
        }
    });
}

function kolacDoktor() {
    uloga = "doktor"
    var match = document.cookie.match(new RegExp('(^| )' + uloga + '=([^;]+)'));
    return match[2];
}

function kolacPacijent() {
    uloga = "pacijent"
    var match = document.cookie.match(new RegExp('(^| )' + uloga + '=([^;]+)'));
    return match[2];
}

function konverzijaDana(params) {
    if (params == "ponedjeljak") {
        params = 1;
    } else if (params == "utorak") {
        params = 2;
    } else if (params == "srijeda") {
        params = 3;
    } else if (params == "cetvrtak") {
        params = 4;
    } else {
        params = 5;
    }
    return params;

}

function prikazivanjeTermina(uloga) {

    $.ajax({
        url: "../skripte/ajax.php",
        type: "POST",
        data: {
            ulogaKorisnika: kolacPacijent()
        },
        dataType: "json",
        async: false,
        success: function(data) {
            if (data["postoji"] == "Ne") {

                document.getElementById("pregledTermina").style.visibility = "hidden";
            }

        }
    });
}