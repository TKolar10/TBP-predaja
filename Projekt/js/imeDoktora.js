$(document).ready(function() {

    cookie = kolaci();

    $.ajax({
        url: "../skripte/ajax.php",
        type: "POST",
        data: {
            imeDoktora: cookie
        },
        dataType: "json",
        async: false,
        success: function(data) {

            ispis = "<h2>dr. " + data[0].ime + " " + data[0].prezime + "</h2>";
            $("#imeDoktora").append(ispis);
        }

    });
});

function kolaci() {

    uloga = "uloga"
    var idUloge;
    var match = document.cookie.match(new RegExp('(^| )' + uloga + '=([^;]+)'));
    if (match) {
        idUloge = match[2];

    } else {
        console.log('--something went wrong---');
    }

    return idUloge;

}