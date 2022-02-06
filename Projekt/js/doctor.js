var polje = [];
var ob = {};
var trenutni = "";
const days = ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"];
const time = ["07:00:00", "08:00:00", "09:00:00", "10:00:00", "11:00:00", "12:00:00", "13:00:00", "14:00:00", "15:00:00", "16:00:00", "17:00:00", "18:00:00", "19:00:00", "20:00:00", "21:00:00"];
var cookie = 0;
$(document).ready(function() {



    //document.getElementById("termin").style.visibility = "hidden";


    displaygumbiCUD();
    displayAppointment();

    $("#azuriranje").click(function() {
        disableInputs();
        enableInputs();
        prikazivanjeAzuriranja()

        $("#updateTime").click(function() {

            updateWorkTime();

        });

    });

    $("#dodavanje").click(function() {
        if (document.getElementById("formAdd") != null) {
            document.getElementById("formAdd").remove();
        }
        disableInputs();
        enableAddInputs();

    });
    $("#brisanje").click(function() {
        if (document.getElementById("formAdd") != null) {
            document.getElementById("formAdd").remove();
        }
        disableInputs();
        enableInputs();

    });





});


function reply_click(clicked_id) {
    var bool = document.getElementById(clicked_id).value;

    if (bool != "") {
        array = bool.split('-');

        if (document.getElementById("vrijemeOd") != null && document.getElementById("vrijemeDo") != null) {
            document.getElementById("vrijemeOd").value = array[0];
            document.getElementById("vrijemeDo").value = array[1];
            var termin = document.getElementById(clicked_id).className;
            var terminId = termin.replace(/Termin/g, "");
            document.getElementById("termin").value = terminId;
        } else {
            poljeInsert = [];
            arrayId = clicked_id.split('X');
            poljeInsert.push(arrayId[0], array[0], array[1]);
            deleteWorkTime(poljeInsert);
        }
    } else {
        poljeInsert = [];
        array = clicked_id.split('X');
        broj = parseInt(array[1]) + 1;
        poljeInsert.push(array[0], time[array[1]], time[broj]);
        addNewTermin(poljeInsert, clicked_id);
    }



}

function addInArray(clicked_id) {
    if (polje.length == 0) {
        polje.push(clicked_id);
    }
    for (let i = 0; i < polje.length; i++) {
        if (!polje.includes(clicked_id)) {
            polje.push(clicked_id);
        }
    }
}

function displayAppointment() {
    var i = 0;
    var displayForm = "";

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
            termin2: kolaci()
        },
        dataType: "json",
        async: false,
        success: function(data) {
            console.log(data)
            displayForm += "</form>";
            $("#tablicaIspisa").append(displayForm);
            setWorkTime(data, time, days);
            disableInputs();

        }
    });

}

function setWorkTime(data, time, days) {
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < 5; j++) {
            for (let k = 0; k < 14; k++) {

                if (data[i].vrijemod == time[k] && data[i].naziv == days[j]) {

                    if (data[i].naziv == "Ponedjeljak") {
                        document.getElementById("PonedjeljakX" + k).value = data[i].vrijemod.substr(0, 5) + "-" + data[i].vrijemedo.substr(0, 5);
                        document.getElementById("PonedjeljakX" + k).classList.add("Termin" + data[i].idtermin);
                    } else if (data[i].naziv == "Utorak") {
                        document.getElementById("UtorakX" + k).value = data[i].vrijemod.substr(0, 5) + "-" + data[i].vrijemedo.substr(0, 5);
                        document.getElementById("UtorakX" + k).classList.add("Termin" + data[i].idtermin);

                    } else if (data[i].naziv == "Srijeda") {
                        document.getElementById("SrijedaX" + k).value = data[i].vrijemod.substr(0, 5) + "-" + data[i].vrijemedo.substr(0, 5);
                        document.getElementById("SrijedaX" + k).classList.add("Termin" + data[i].idtermin);

                    } else if (data[i].naziv == "Četvrtak") {
                        document.getElementById("ČetvrtakX" + k).value = data[i].vrijemod.substr(0, 5) + "-" + data[i].vrijemedo.substr(0, 5);
                        document.getElementById("ČetvrtakX" + k).classList.add("Termin" + data[i].idtermin);

                    } else if (data[i].naziv == "Petak") {
                        document.getElementById("PetakX" + k).value = data[i].vrijemod.substr(0, 5) + "-" + data[i].vrijemedo.substr(0, 5);
                        document.getElementById("PetakX" + k).classList.add("Termin" + data[i].idtermin);

                    } else break;

                }
            }
        }

    }
}

function disableInputs() {
    var inputs = document.getElementsByTagName("INPUT");
    for (var i = 3; i < inputs.length; i++) {

        if (inputs[i].type === 'button') {
            inputs[i].disabled = true;
        } else {
            inputs[i].disabled = false;
        }
    }
}

function enableInputs() {
    var inputs = document.getElementsByTagName("INPUT");
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].type === 'button' && inputs[i].value != "") {
            inputs[i].disabled = false;
        }
    }

}

function enableAddInputs() {
    var inputs = document.getElementsByTagName("INPUT");
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].type === 'button' && inputs[i].value == "") {
            inputs[i].disabled = false;
        }
    }

}

function updateWorkTime() {
    console.log("U update je uslo");
    var vrijemeOd = document.getElementById("vrijemeOd").value;
    var vrijemeDo = document.getElementById("vrijemeDo").value;
    var termin = document.getElementById("termin").value;

    $.ajax({
        url: "../skripte/ajax.php",
        type: "POST",
        data: {
            vrijemeod: vrijemeOd,
            vrijemedo: vrijemeDo,
            termin: termin
        },
        dataType: "json",
        async: false,
        success: function(data) {
            console.log("uspjesno");
            console.log(data);
            document.getElementById("rtable").remove();
            displayAppointment();
            enableInputs();

        }
    });

}

function prikazivanjeOpcija() {
    var odabir = "";
    odabir = " <select name='selected' id='selected'>" +
        "<option value=''>Odaberite dan</option>" +
        "<option value='1'>Ponedjeljak</option>" +
        "<option value='2'>Utorak</option>" +
        "<option value='3'>Srijeda</option>" +
        "<option value='4'>Četvrtak</option>" +
        "<option value='5'>Petak</option>"
    $("#inputiAzuriranja").append(odabir);
}

function prikazivanjeAzuriranja() {
    var odabir = "";
    odabir = "<form action='' method='post' id='formAdd'>" +
        "<input id='vrijemeOd' type='text'>" +
        "<input id='vrijemeDo' type='text'>" +
        "<input name ='updateTime' type='button' id='updateTime' value='Potvrdi'></form>"
    $("#inputiAzuriranja").append(odabir);
}

function displaygumbiCUD() {
    var odabir = "";
    odabir =
        " <input type='button' id='azuriranje' name='gumb' value='Ažuriranje'>" +
        " <input  type='button' id='dodavanje' value='Dodavanje'>"
    $("#gumbiCU").append(odabir);

}

function addNewTermin(poljeInsert, clicked_id) {
    var dan = konverzijaDana(poljeInsert[0]);
    console.log("ovo je doktor" + kolaci());
    $.ajax({
        url: "../skripte/ajax.php",
        type: "POST",
        data: {
            dan: dan,
            od: poljeInsert[1],
            do: poljeInsert[2],
            dok: kolaci()
        },
        dataType: "json",
        async: false,
        success: function(data) {
            if (data == "Vratilo") {
                document.getElementById("rtable").remove();
                displayAppointment();
                disableInputs();
                enableAddInputs();
            }
        }
    });



}

function konverzijaDana(params) {
    if (params == "Ponedjeljak") {
        params = 1;
    } else if (params == "Utorak") {
        params = 2;
    } else if (params == "Srijeda") {
        params = 3;
    } else if (params == "Četvrtak") {
        params = 4;
    } else {
        params = 5;
    }
    return params;

}

function deleteWorkTime(poljeInsert) {
    var dan = konverzijaDana(poljeInsert[0]);
    poljeBrisanje = [dan, poljeInsert[1], poljeInsert[2], kolaci()];
    console.log(dan + " " + poljeInsert[1] + " " + poljeInsert[2] + " " + kolaci())
    $.ajax({
        url: "../skripte/ajax.php",
        type: "POST",
        data: {
            prijenos: poljeBrisanje
        },
        dataType: "json",
        async: false,
        success: function(data) {
            console.log(data);
            if (data == "Vratilo") {
                document.getElementById("rtable").remove();
                displayAppointment();
                disableInputs();
                enableInputs();
            }
        }
    });

}



function kolaci() {
    uloga = "doktor"
    var match = document.cookie.match(new RegExp('(^| )' + uloga + '=([^;]+)'));
    return match[2];
}