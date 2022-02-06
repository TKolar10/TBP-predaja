$(document).ready(function() {

    console.log("Usli smo");
    $.ajax({
        url: "../skripte/ajax.php",
        type: "POST",
        data: {
            imePacijenta: kolaciPacijent()
        },
        dataType: "json",
        async: false,
        success: function(data) {

            ispis = "<h2>Pozdrav " + data[0].ime + " " + data[0].prezime + "</h2>";
            $("#imePacijenta").append(ispis);
        }

    });
    promijenaTermina()
});

function kolaciPacijent() {
    uloga = "pacijent"
    var idUloge;
    var match = document.cookie.match(new RegExp('(^| )' + uloga + '=([^;]+)'));
    if (match) {
        idUloge = match[2];

    } else {
        console.log('--something went wrong---');
    }
    return idUloge;

}

function promijenaTermina() {
    $.ajax({
        url: "../skripte/ajax.php",
        type: "POST",
        data: {
            promijenaTermina: kolaciPacijent()
        },
        dataType: "json",
        async: false,
        success: function(data) {
            if (data["postoji"] == "Da") {
                tresi()
            }
        }

    });

}

function tresi() {
    if (document.getElementById('tresi')) {
        document.getElementById('tresi').style.animation = "shake 2s infinite";
    }

}