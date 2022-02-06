$(document).ready(function() {
    console.loq < ("SignUp");
    document.getElementById("submitPatReg").disabled = true;
    $("#gumb").click(function(event) {
        var email = document.getElementById("emailPatReg").value;
        checkMail(email);
        console.log(error);
    });

    $("#name").keyup(function(event) {
        patientName();


    });
    $("#surname").keyup(function(event) {
        patientSName();
    });
    $("#emailPatReg").keyup(function(event) {
        patientEmail();

    });
    $("#passwordPatReg").keyup(function(event) {
        patientPass();
    });
    $("#oibPat").keyup(function(event) {
        patientOib();
    });

    $("#submitPatReg").click(function(event) {
        registrirajPacijenta();
    });


});



function checkMail(mail) {
    $.ajax({
        url: "./skripte/ajax.php",
        type: "POST",
        data: {
            email: mail
        },
        dataType: "json",
        async: false,
        success: function(data) {

            if (data['postoji'] != '0') {
                error = "E-mail je zauzet!"
            } else {
                error = "";

            }
        },
    });


}

function patientName() {

    var name = document.getElementById("name").value.trim();
    var regName = new RegExp(/^[a-zA-ZščćđžŠČĆŽĐ]{3,45}$/);
    var validName = regName.test(name);
    if (!validName) {
        document.getElementById("name").style.background = "red";
    } else {
        document.getElementById("name").style.background = "green";
    }
    return validName;

}

function patientSName() {

    var surname = document.getElementById("surname").value.trim();
    var regSurname = new RegExp(/^[a-zA-ZščćđžŠČĆŽĐ]{3,45}$/);
    var validSurname = regSurname.test(surname);
    if (!validSurname) {
        document.getElementById("surname").style.background = "red";
    } else {
        document.getElementById("surname").style.background = "green";
    }
    return validSurname;
}

function patientEmail() {
    var mail = document.getElementById("emailPatReg").value.trim();
    var regMail = new RegExp(/^([\w\.]+@([\w-]+[\.])+[\w-]{2,4})$/);
    var validMail = regMail.test(mail);
    if (!validMail) {
        document.getElementById("emailPatReg").style.background = "red";
    } else {

        document.getElementById("emailPatReg").style.background = "green";

    }
    return validMail

}

function patientPass() {
    var pass = document.getElementById("passwordPatReg").value.trim();
    var regPass = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/);
    var validPass = regPass.test(pass);
    if (!validPass) {
        document.getElementById("passwordPatReg").style.background = "red";
    } else {
        document.getElementById("passwordPatReg").style.background = "green";
    }
    return validPass;
}

function patientOib() {
    var oib = document.getElementById("oibPat").value.trim();
    var regOib = new RegExp(/^([0-9]{11})$/);
    var validOib = regOib.test(oib);
    if (!validOib) {
        document.getElementById("oibPat").style.background = "red";
    } else {
        document.getElementById("oibPat").style.background = "green";
    }
    return validOib;
}


function correct() {
    var correct = true;
    var inputs = document.getElementsByClassName('check');
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].value == "") {
            correct = false;
            break;
        }
    }
    document.getElementById("submitPatReg").disabled = !correct;
}


document.onkeyup = function() {
    if (patientOib() && patientPass() && patientSName() && patientName() && patientEmail()) {
        console.log("true");
        correct();
    } else {
        document.getElementById("submitPatReg").disabled = true;
    }

}