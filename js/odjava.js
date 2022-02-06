$(document).ready(function() {

    $("#odjava").click(function() {

        document.cookie = 'lijecnik=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/TBP-projekt';
        document.cookie = 'ljekarna=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/TBP-projekt/doctor';
        document.cookie = 'pacijent=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/TBP-projekt';
        location.href = "../index.php";

    });

});