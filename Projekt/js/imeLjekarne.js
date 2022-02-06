$(document).ready(function() {


    $.ajax({
        url: "../skripte/ajax.php",
        type: "POST",
        data: {
            imeLjekarne: kolaci()
        },
        dataType: "json",
        async: false,
        success: function(data) {

            ispis = "<h2>Dobro došli: " + data[0].naziv + "</h2>";
            $("#imeLjekarne").append(ispis);
        }

    });
});

function kolaci() {

    uloga = "ljekarna"
    var idUloge;
    var match = document.cookie.match(new RegExp('(^| )' + uloga + '=([^;]+)'));
    if (match) {
        idUloge = match[2];

    } else {
        console.log('--something went wrong---');
    }

    return idUloge;

}