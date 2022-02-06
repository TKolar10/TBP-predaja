var oib;
var nazivSlike = "";
$(document).ready(function() {




    $("#traziPacijenta").click(function(event) {

        ispis = "";
        oib = document.getElementById("oibPacijenta").value;
        // if (oib.length == 11) {

        traziPacijenta();
        ispis = "<button id='dijagnoza'>Dodaj dijagnozu</button>";
        // } else { console.log("napisi gresku") }
        if (document.getElementById("dijagnoza") != null) {
            document.getElementById("dijagnoza").remove();
        }

        $("#dodajGumb").append(ispis);

        $("#dijagnoza").click(function(event) {
            dohvatLijekova();
            doktor = kolaci();
            // document.getElementById("sakriDok").style.visibility = "hidden";


        });

    });
    $("#ocitavanje").click(function(event) {

        ocitovanjeLijeka();
    });




});

function dodajPregledUBazu() {
    var polje = [];
    for (let i = 0; i < brojac + 1; i++) {

        if (document.getElementById("kolicina" + i).value == "" ||
            document.getElementById("lijek" + i).value == "0") {

            prolaz = false;
            brojac = 0;
        }
        polje.push(document.getElementById("lijek" + i).value)
        polje.push(document.getElementById("kolicina" + i).value)

    }
    console.log(polje);


    $.ajax({
        url: "../skripte/ajax.php",
        type: "POST",
        data: {
            nadiPacijenta: document.getElementById("oibPacijenta").value
        },
        dataType: "json",
        async: false,
        success: function(data) {

        }
    });
}

function traziPacijenta() {

    console.log(document.getElementById("oibPacijenta").value);
    displayForm = "<table id='rtable'><thead><tr><th>Datum pregleda</th><th>Prepisani ljekovi</th><th>Dijagnoza</th><th>Nalaz</th></tr></thead>";
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
            console.log(data[0].ime + " " + data[0].prezime);
            ispisOsobe = "<label id='obrisi1'>Ime:</label> <label id='obrisi2'>" + data[0].ime + "</label> <label id='obrisi3'>Prezime:</label> <label id='obrisi4'>" + data[0].prezime + "</label> "
            $("#opisPacijenta").append(ispisOsobe);

            $(data).each(function(index, value) {

                console.log("mora radit");
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

                displayForm += "<tr><td><label>" + value.datumpregleda + "</label></td><td><label style='color:" + boja + ";'>" + prepisanilijekovi + "</label></label></td><td><label>" + value.dijagnoza + "</label></td>";
                if (value.putanja != null) {
                    displayForm += "<td><input onClick='reply_click(this.id)' value='Nalaz' id='" + value.putanja + "' type='button'></td></tr>"
                } else {
                    displayForm += "<td></td></tr>"
                }

            });
            $("#tablicaIspisa").append(displayForm);

        }
    });

}


function kolaci() {
    //  document.cookie = 'cookie1=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/'
    uloga = "uloga"
    var match = document.cookie.match(new RegExp('(^| )' + uloga + '=([^;]+)'));
    if (match) {
        idDok = match[2];
        console.log(idDok);
    } else {
        console.log('--something went wrong---');
    }

    //document.cookie = 'promijena=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    return idDok;

}

function popupWindow(url, windowName, win, w, h) {
    const y = win.top.outerHeight / 2 + win.top.screenY - (h / 2);
    const x = win.top.outerWidth / 2 + win.top.screenX - (w / 2);
    return win.open(url, windowName, `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${y}, left=${x}`);
}

function reply_click(clicked_id) {
    console.log(clicked_id);
    popupWindow("/xampp/apache/" + clicked_id + "", 'test', window, 500, 500);

}

function dijagnozaPacijenta(lijekovi) {

    ispis = "<div class='pregled'>"
    ispis += "<input type='text' name='dijagnoza' id='tekstDijagnoze' placeholder='Tekst dijagnoze'><div class='kutijaRazdvajanje'>"
    ispis += "<select name='lijek0' id='lijek0'><option value='0'>Odaberi lijek</option>"
    for (let i = 0; i < lijekovi.length; i++) {
        ispis += "<option value='" + lijekovi[i].naziv + "'>" + lijekovi[i].naziv + "</option><br>";
    }
    ispis += "</select><input type='text' name='kolicina0' id='kolicina0' placeholder='Kolicina' /><button id='dodavanje' onclick='dodavanjeRecept(this.id)' >+</button></div><div id='receptLijek'></div>"
    ispis += "<input type='file' name='inputfile' id='inputfile' >"
    ispis += "<input style='width:100px; background:green; color: white; border-radius:10%;' type='button' id='dodajPregled' value='Potvrdi pregled' onclick='ocitovanjeLijeka();'></div> </div>"
    $("#unosPregleda").append(ispis);

}

function dohvatLijekova() {
    $.ajax({
        url: "../skripte/ajax.php",
        type: "POST",
        data: {
            lijek: ""
        },
        dataType: "json",
        async: false,
        success: function(data) {
            dijagnozaPacijenta(data);
        }
    });


}
let brojac = 0;

function dodavanjeRecept() {
    brojac++;
    console.log(brojac);

    prolaz = true;

    if (brojac < 6) {


        for (let i = 0; i < brojac; i++) {

            if (document.getElementById("kolicina" + i).value == "" ||
                document.getElementById("lijek" + i).value == "0") {
                prolaz = false;
                brojac = 0;
            }
        }
        if (prolaz) {
            $.ajax({
                url: "../skripte/ajax.php",
                type: "POST",
                data: {
                    lijek: ""
                },
                dataType: "json",
                async: false,
                success: function(data) {
                    ispis = "<div class='kutijaRastavljanje'><select class='item' id='lijek" + brojac + "'><option value='0'>Odaberi lijek</option><br> ";
                    for (let i = 0; i < data.length; i++) {
                        ispis += "<option value='" + data[i].naziv + "'>" + data[i].naziv + "</option>";
                    }
                    ispis += "</select><input class='item' type='text' id='kolicina" + brojac + "'  placeholder='Kolicina'/></div>"
                    $("#receptLijek").append(ispis);

                }
            });
        } else console.log("nije dobro");
    } else { console.log("neide vise"); }

}

function ocitovanjeLijeka(params) {
    ispis = "{";
    console.log(brojac);
    for (let i = 0; i <= brojac; i++) {

        if (i == brojac) {
            console.log("treba uci");
            ispis += '"' + document.getElementById("lijek" + i).value + ':' + document.getElementById("kolicina" + i).value + '"';
        } else {
            console.log("ulazi u tu");
            ispis += '"' + document.getElementById("lijek" + i).value + ':' + document.getElementById("kolicina" + i).value + '",';
        }

    }
    ispis += "}";
    idDok = kolaci();
    var file_data = document.getElementById("inputfile")
    var datoteka = "prazno";

    if (file_data.files.length != 0) {
        datoteka = $('#inputfile').prop('files')[0];
        datoteka = datoteka.name;
    } else {
        console.log("Tu ulaziaaaaaaaaaaaaaaa");
        datoteka = "prazno";
    }

    var tekstDijagnoze = document.getElementById("tekstDijagnoze").value;
    korisnik = document.getElementById("oibPacijenta").value;
    console.log(idDok + " | " + korisnik + " | " + ispis + " | " + datoteka + " | " + tekstDijagnoze);

    $.ajax({
        url: "../skripte/ajax.php",
        type: "POST",
        data: {
            dok: idDok,
            pacijent: korisnik,
            lijekoviUnos: ispis,
            nazivSlike: datoteka,
            tekst: tekstDijagnoze
        },
        dataType: "json",
        async: false,
        success: function(data) {
            console.log(data)
            if (data == "Vratilo") {
                if (document.getElementById("rtable") != null) {
                    document.getElementById("rtable").remove();
                    document.getElementById("obrisi1").remove();
                    document.getElementById("obrisi2").remove();
                    document.getElementById("obrisi3").remove();
                    document.getElementById("obrisi4").remove();
                    traziPacijenta();
                }
            }
        }
    });

}

$.ajax({

    url: "../skripte/ajax.php",
    type: "POST",
    data: {
        lijek: ""
    },
    dataType: "json",
    async: false,
    success: function(data) {

        dijagnozaPacijenta(data);

    }
});