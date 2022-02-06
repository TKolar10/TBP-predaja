<?php 
require '../skripte/connection.php';
$connection = OpenCon();
$nest="";
@$src = $_FILES['file']['tmp_name'];
@$targ = "../img/".$_FILES['file']['name'];
@$targPath = "/xampp/apache/".$_FILES['file']['name'];
move_uploaded_file($src, $targPath);

if(isset(($_POST['dok']),($_POST['pacijent']),($_POST['lijekoviUnos']),$_POST['nazivSlike']))
{

    $dok= ($_POST['dok']);
    $pacijent= ($_POST['pacijent']);
    $lijekoviUnos= ($_POST['lijekoviUnos']);
    $nazivSlike= ($_POST['nazivSlike']);

    $newPath = "../img/";
    $newName  = $newPath."{$nazivSlike}";
    @$copied = copy($targPath , $newName);
   
}

  

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <title>Doktor termini</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="naslov" content="Početna stranica">
    <meta name="autor" content="Tomislav Kolar">
    <link href="../css/shared.css" rel="stylesheet" type="text/css">
    <link href="../css/pregledDok.css" rel="stylesheet" type="text/css">

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  
    <script src="../js/pregled.js"></script>
    <script src="../js/odjava.js"></script>
    <script src="../js/imeDoktora.js"></script>



   

</head>

<body>
<header>
        <div class="containerHeader">
            <div class="containerLogo">
                <a class="item" href="./izbornik.html">
                    <img src="../img/E-zdravlje-logos_black.png" width="100" height="100" alt="">
                </a>
                <h1 class="item">E-zdravlje</h1>
            </div>
            <h2 class="item-center" id="imeDoktora">Dobro došli dr. </h2>
            <button class="item" id="odjava">Odjava</button>
        </div>

    </header>
    <hr>
    <main>
        <input type="text" name="oibPacijenta" id="oibPacijenta" placeholder="Unesite oib">
        <input type="button" name="traziPacijenta" id="traziPacijenta" value="Traži">

        <div id="opisPacijenta"></div>


        <div id="dodajGumb"></div>

        <div id="centriranje">
            <div id="tablicaIspisa"></div>
        </div>

        <div id="unosPregleda"></div>
</body>

<hr>
<footer>
<div class="autor">

        <a href="mailto:tkolar@foi.hr">Tomislav Kolar </a>
        <small>&copy; 2021. Tomislav Kolar </small></small>
</div>
</footer>
</html>