$(document).ready(function() {
    console.log(document.cookie)
    $("#povratak").click(function(event) {
        window.opener.location.href = window.opener.location.href;
        window.close();
    });


});