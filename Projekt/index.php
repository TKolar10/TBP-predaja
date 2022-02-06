<?php
$putanja = dirname($_SERVER["REQUEST_URI"]);
$direktorij = getcwd(); 
$error ="";
+
require 'skripte/connection.php';
$connection = OpenCon();


if(isset($_POST['submitPatReg'])){
    $oib = $_POST['oib'];   
    $ime = $_POST['name'];   
    $prezime = $_POST['surname'];   
    $datumRodenja = $_POST['dateOfBirth'];   
    $lozinka = $_POST['passwordPatReg'];   
    $email = $_POST['emailPatReg'];   
 // dodaj tu varijable za unos u bazu
    $result = pg_query($connection, "SELECT oib FROM pacijent where oib='${oib}'");
    $resultMail = pg_query($connection, "SELECT email FROM pacijent where email='${email}'");
    if(pg_num_rows($result)>0){
        echo '<script>alert("OIB se već koristi!")</script>';
    }
    else{
        $result = pg_query($connection, "INSERT INTO pacijent (ime, prezime,god_rodenja,oib,email,lozinka) VALUES ('{$ime}','{$prezime}','$datumRodenja}',{$oib},'{$email}','{$lozinka}')");
        echo '<script>alert("Uspješno ste registrirani")</script>';
    }
    
}

$result = pg_query($connection, "SELECT ime FROM pacijent");
$obj = pg_fetch_result($result,0,0);

?>


    <!doctype html>
    <html lang="hr">

    <head>
        <title>Početna stanica</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="naslov" content="Početna stranica">
        <meta name="autor" content="Tomislav Kolar">
        <link href="./css/index.css" rel="stylesheet" type="text/css">
        <link href="./css/shared.css" rel="stylesheet" type="text/css">
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <script src="./js/login.js"></script>
        <script src="./js/signUp.js"></script>
     
        </style>
    </head>
    

    <body>

        <header>
        <div class="containerHeader">
            <div class="containerLogo">
                <a class="item" href="./index.php">
                    <img src="./img/E-zdravlje-logos_black.png" width="100" height="100" alt="">
                </a>
                <h1 class="item">E-zdravlje</h1>
            </div>
        </div>

        </header>
        <hr>
        <section class="izborniciSlike">

            <div  class="flip-card"> 
                <div  class="flip-card-inner">
                    <div class="flip-card-front">

                        <img src="./img/patient.png" alt="Pacijent" width="200" height="200" />
                        <h5>Prijava/registracija pacijenta</h5>

                    </div>
                    <div id="disable" class="flip-card-back">
                        <input id="login" name="submit" type="button" value="Prijavi se" >
                    <input id="signUp" name="submit" type="button" value="Registriraj se" >
                      
                    <form method="post" action="" id="loginForm">
                            <label for="xname">E-mail:</label><br>
                            <input type="text" id="emailPat" name="tekst" placeholder="John"><br>
                            <label for="xname">Lozinka:</label><br>
                            <input type="password" id="passwordPat" name="passwordPat" placeholder="Doe"><br><br>
                            <input id="submitPat" name="submitPat" type="button" value="Prijavi se" >
                            <p id="warningPat"></p>
                            <input id="signUpShow" name="submitUpShow" type="button" value="Registriraj se">

                    </form>
                    
                    <form  novalidate autocomplete="off"  method="post" action="" id="signUpForm" style="margin-top: 5px;" class="signUpFormMod">
                            <label for="xname">Ime:</label><br> 
                            <input type="text" id="name" class="discName check" name="name" placeholder="John" autocomplete="off"><br>
                            <label for="xname">Prezime:</label><br> 
                            <input type="text" id="surname" class="discSurname check" name="surname" placeholder="John"><br>
                            <label for="xdate">Datum rođenja:</label><br>
                            <input type="date" id="dateOfBirth" name="dateOfBirth"><br>
                            <label for="xname">E-mail:</label><br>
    
                            <input type="text" id="emailPatReg" class="discSurname check" name="emailPatReg" placeholder="John"><br>
                            <label for="xname">Lozinka:</label><br>
                            <input type="password" id="passwordPatReg" name="passwordPatReg" class="check" placeholder="Doe"><br>
                            <label for="xname">OIB:</label><br>
                            <input type="text" id="oibPat" name="oib" placeholder="Doe" class="check"><br>
                           
                            <input id="submitPatReg" name="submitPatReg" type="submit" value="Registriraj se"  style="margin-top: 5px;" disabled >
                            <input id="loginShow" name="submit" type="button" value="Prijavi se" >
                            

                    </form>
                    </div>
                </div>

            </div>


            <div class="flip-card">
                <div class="flip-card-inner">
                    <div class="flip-card-front">
                        <img src="./img/doctor.png" alt="Liječnik" width="200" height="200" />

                        <h5>Prijava liječnika</h5>
                    </div>
                    <div class="flip-card-back">
                        <form method="post" action="" class="forma">
                            <label for="fname">E-mail:</label><br>
                            <input type="text" id="emailDoc" name="emailDoc" placeholder="John"><br>
                            <label for="lname">Lozinka:</label><br>
                            <input type="password" id="passwordDoc" name="passwordDoc" placeholder="Doe"><br><br>
                            <input id="submitDoc" name="submitDoc" type="button" value="Prijavi se" >
                            <p id="warningDoc"></p>
                           

                        </form>
                    </div>
                </div>
            </div>
    
         
  
            <div class="flip-card">
                <div class="flip-card-inner">
                    <div class="flip-card-front">
                        <img src="./img/pharmacy.png" alt="Ljekarna" width="200" height="200" />

                        <h5>Prijava ljekarnika</h5>
                    </div>
                    <div class="flip-card-back">
                         <form method="post" action="" class="form">
                            <label for="fname">E-mail:</label><br>
                            <input type="text" id="emailStore" name="emailStore" placeholder="John"><br>
                            <label for="lname">Lozinka:</label><br>
                            <input type="password" id="passwordStore" name="passwordStore" placeholder="Doe"><br><br>
                            <input id="submitStore" name="submitStore" type="button" value="Prijavi se" >
                            <p id="warningStore"></p>
                        </form>
                    </div>
                </div>
            </div>

            </div>
        </section>
        <hr>
<footer>
<div class="autor">

        <a href="mailto:tkolar@foi.hr">Tomislav Kolar </a>
        <small>&copy; 2021. Tomislav Kolar </small></small>
</div>
</footer>


    </body>

    </html>