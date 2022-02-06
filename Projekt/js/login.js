$(document).ready(function() {



    document.getElementById("warningStore").style.display = "none";
    document.getElementById("warningDoc").style.display = "none";
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("signUpForm").style.display = "none";



    $("#submitDoc").click(function(event) {
        var email = document.getElementById("emailDoc").value;
        var pass = document.getElementById("passwordDoc").value;
        var selection = this.id;
        validation(event, email, pass, selection);
    });

    $("#submitStore").click(function(event) {

        var email = document.getElementById("emailStore").value;
        var pass = document.getElementById("passwordStore").value;
        var selection = this.id;
        validation(event, email, pass, selection);
    });
    $("#submitPat").click(function(event) {
        var email = document.getElementById("emailPat").value;
        var pass = document.getElementById("passwordPat").value;
        var selection = this.id;
        validation(event, email, pass, selection);
    });
    $("#login").click(function(event) {
        showLoginForm();

    });
    $("#loginShow").click(function(event) {
        showLoginForm();
    });
    $("#signUp").click(function(event) {

        showSignUpForm();


    });
    $("#signUpShow").click(function(event) {

        showSignUpForm();

    });


});

function validation(event, email, pass, selection) {
    var error = "";
    $.ajax({
        url: "./skripte/ajax.php",
        type: "POST",
        data: {
            email: email,
            pass: pass,
            selection: selection
        },
        dataType: "json",
        async: false,
        success: function(data) {

            if (data['postoji'] != '0') {
                if (selection == 'submitDoc') {
                    document.cookie = "doktor=" + data;
                    location.href = "./doctor/izbornik.html";
                } else if (selection == 'submitStore') {
                    document.cookie = "ljekarna=" + data;
                    location.href = "./drugstore/drugstore.html";
                } else {
                    document.cookie = "pacijent=" + data;
                    location.href = "./patient/patient.html";
                }
            } else {
                error += "E-mail ili lozinka nisu ispravni!"
            }
        },
    });
    if (error != "" && selection == 'submitDoc') {
        event.preventDefault();
        document.getElementById("warningDoc").style.display = "block";
        document.getElementById("warningDoc").style.color = "red";
        document.getElementById("warningDoc").innerHTML = error;
    } else if (error != "" && selection == 'submitStore') {
        document.getElementById("warningStore").style.display = "block";
        document.getElementById("warningStore").style.color = "red";
        document.getElementById("warningStore").innerHTML = error;
    } else {
        document.getElementById("warningPat").style.display = "block";
        document.getElementById("warningPat").style.color = "red";
        document.getElementById("warningPat").innerHTML = error;
    }
}



function showSignUpForm() {
    document.getElementById("signUpForm").style.marginTop = "5 %";
    document.getElementById("signUpForm").style.display = "block";
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("login").style.display = "none";
    document.getElementById("signUp").style.display = "none";

}

function showLoginForm() {
    document.getElementById("signUpForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("login").style.display = "none";
    document.getElementById("signUp").style.display = "none";


}