<?php 
    require './connection.php';
    $connection = OpenCon();

    if(isset(($_POST['vrijemeod']), ($_POST['vrijemedo']), $_POST['termin'])){
        $vrijemeod = $_POST['vrijemeod'];
        $vrijemedo = $_POST['vrijemedo'];
        $termin = $_POST['termin'];
        //echo json_encode("UPDATE termin set vrijemod = '{$vrijemeod}',vrijemedo = '{$vrijemedo}' where idtermin='{$termin}'");

        $result = pg_query($connection, "UPDATE termin set vrijemod = '{$vrijemeod}',vrijemedo = '{$vrijemedo}' where idtermin='{$termin}'");
        $updatePacijenta = pg_query($connection, "UPDATE narucivanje SET promijena = 1 WHERE idtermin = '{$termin}'");
        $provjera = pg_query($connection, "SELECT * FROM narucivanje WHERE idtermin ='{$termin}'");
        if(pg_num_rows($provjera)>0){
            
        }
        $polje = null;
        if($result){
            $polje["postoji"]="1";
        }
        else {
            $polje["postoji"]="0";
        }
            echo json_encode($polje);
        
    exit();
    }

 if(isset(($_POST['email']), ($_POST['pass']), $_POST['selection'])){
        $email = $_POST['email'];
        $pass = $_POST['pass'];
        $selection = $_POST['selection'];
        if($selection == 'submitDoc'){
            $result = pg_query($connection, "SELECT idlijecnik FROM lijecnik WHERE email='{$email}' and lozinka='{$pass}'");
        }
        else if($selection == 'submitStore'){
            $result = pg_query($connection, "SELECT idljekarna FROM ljekarna WHERE email='{$email}' and lozinka='{$pass}'");
        }
        else{
            $result = pg_query($connection, "SELECT idpacijent FROM pacijent WHERE email='{$email}' and lozinka='{$pass}'");
        }
        $polje = array();
        if(pg_num_rows($result)>0){
          $polje=pg_fetch_result($result, 0, 0);
        }
        else {
            $polje["postoji"]="0";
        }
            echo json_encode($polje);
        
    exit();
    }
    if(isset($_POST['email'])){
        $mail = $_POST['email'];
        $result = pg_query($connection, "SELECT * FROM pacijent WHERE email='${mail}'");
        $polje=null;
        if(pg_num_rows($result)>0){
            $polje["postoji"]="1";
        }
        else {
            $polje["postoji"]="0";
        }
            echo json_encode($polje);

    exit();
    }

    if(isset(($_POST['termin']),$_POST['datumTermina'])){
        $dok = $_POST['termin'];
        $datum =  $_POST['datumTermina'];
        $resultView =pg_query($connection, "CREATE OR REPLACE VIEW terminiPogled  AS
        SELECT t.idtermin, t.iddan, t.vrijemod, t.vrijemedo, t.idlijecnik, d.naziv, p.idnarucivanje,p.datum,p.idpacijent,p.promijena from termin t RIGHT JOIN dan d ON t.iddan=d.iddan LEFT JOIN narucivanje p ON p.idtermin=t.idtermin where  t.idtermin != (SELECT idtermin FROM narucivanje WHERE datum = '{$datum}') and p.datum != '{$datum}' or p.datum is null;");
        $result =pg_query($connection, "select * from terminiPogled where idlijecnik = {$dok}");

        $polje = array();
        if(pg_num_rows($result)>0){
            while ($row = pg_fetch_assoc($result)) {
                $polje[] = $row;
              }
        }else {
            echo json_encode("No data");
            }
        echo json_encode($polje);

    exit();
    }
    if(isset($_POST['termin2'])){
        $dok = $_POST['termin2'];
        $result =pg_query($connection, "SELECT * from termin t JOIN dan d ON t.iddan=d.iddan where t.idlijecnik={$dok};");
        $polje = array();
        if(pg_num_rows($result)>0){
            while ($row = pg_fetch_assoc($result)) {
                $polje[] = $row;
              }
        }else {
            $polje[] = "Radi";
            }
        echo json_encode($polje);

    exit();
    }
    
    if(isset(($_POST['dan']),($_POST['od']),($_POST['do']),$_POST['dok'])){

        $dan = $_POST['dan'];
        $od = $_POST['od'];
        $do = $_POST['do'];
        $dok = $_POST['dok'];
       
       
        $result = pg_query($connection, "INSERT INTO termin VALUES (default,{$dan},'{$od}','{$do}',{$dok})");
        if(!$result){
            echo json_encode("Nije vratilo");
        }else{
            echo json_encode("Vratilo");
        }
   
    exit();
    }
    if(isset($_POST['prijenos'])){

        $polje = $_POST['prijenos'];
       // echo json_encode("DELETE FROM termin WHERE iddan={$polje[0]} and vrijemod='{$polje[1]}' and vrijemedo='{$polje[2]}' and idlijecnik={$polje[3]}");
        $result = pg_query($connection, "DELETE FROM termin WHERE iddan={$polje[0]} and vrijemod='{$polje[1]}' and vrijemedo='{$polje[2]}' and idlijecnik={$polje[3]}");
        if(!$result){
            echo json_encode("Nije vratilo");
        }else{
            echo json_encode("Vratilo");
        }
   
    exit();
    }

    if(isset($_POST['nadiPacijenta'])){
        
        $oib = $_POST['nadiPacijenta'];
         $result = pg_query($connection, "SELECT idpregled,dijagnoza,datumpregleda,recept, p.idpacijent, izdan, p.putanja, pa.ime,pa.prezime,pa.god_rodenja FROM
         pregled p JOIN pacijent pa ON p.idpacijent=pa.idpacijent WHERE pa.oib='{$oib}'");
       $polje = array();
        if(pg_num_rows($result)>0){
            while ($row = pg_fetch_assoc($result)) {
                $polje[] = $row;
              }
        }else {
            $polje["postoji"]="Ne";
            }
        echo json_encode($polje);

    exit();
    }

    if(isset($_POST['prikazSlike'])){
        $idSlike = $_POST['prikazSlike'];
         $result = pg_query($connection, "SELECT putanja FROM slikepregleda WHERE idslikapregleda='{$idSlike}'");
        $polje = array();
        if(pg_num_rows($result)>0){
            while ($row = pg_fetch_assoc($result)) {
                $polje[] = $row;
              }
        }else {
            $polje["postoji"]="Ne";
            }
        echo json_encode($polje);

    exit();
    }
    if(isset($_POST['lijek'])){
        
         $result = pg_query($connection, "SELECT * FROM lijek");
        $polje = array();
        if(pg_num_rows($result)>0){
            while ($row = pg_fetch_assoc($result)) {
                $polje[] = $row;
              }
        }else {
            $polje["postoji"]="Ne";
            }
        echo json_encode($polje);

    exit();
    }


    if(isset(($_POST['dok']),($_POST['pacijent']),($_POST['lijekoviUnos']),($_POST['nazivSlike']),($_POST['tekst']))){
        
        $dok = $_POST['dok'];
        $pacijent = $_POST['pacijent'];
        $lijekoviUnos = $_POST['lijekoviUnos'];
        $nazivSlike = $_POST['nazivSlike'];
        $tekstDijagnoze = $_POST['tekst'];
      

        if($nazivSlike != "prazno"){
            $resultRecept = pg_query($connection, "INSERT INTO pregled (idlijecnik,idpacijent,dijagnoza,datumpregleda,recept,slika,putanja) VALUES ({$dok},(SELECT idpacijent FROM pacijent WHERE oib = '{$pacijent}'),'{$tekstDijagnoze}','now()','{$lijekoviUnos}',(lo_import('/xampp/apache/{$nazivSlike}')),'{$nazivSlike}')");
        }else{
            $resultRecept = pg_query($connection, "INSERT INTO pregled (idlijecnik,idpacijent,dijagnoza,datumpregleda,recept) VALUES ({$dok},(SELECT idpacijent FROM pacijent WHERE oib = '{$pacijent}'),'{$tekstDijagnoze}','now()','{$lijekoviUnos}')"); 
        }
        if(!$resultRecept){
            echo json_encode("Nije vratilo");
        }else{
            echo json_encode("Vratilo");
        }
   
    exit();
    }

    if(isset($_POST['povijestBolesti'])){

        $pacijent = $_POST['povijestBolesti'];
       $result = pg_query($connection, "SELECT l.ime,l.prezime,p.dijagnoza,p.datumpregleda,s.naziv as spec, b.naziv, p.putanja,p.recept FROM pregled p LEFT JOIN lijecnik l ON p.idlijecnik=l.idlijecnik  
       JOIN bolnica b ON b.idbolnica=l.idbolnica JOIN specijalizacija s ON 
       s.idspecijalizacija=l.idspecijalizacija where p.idpacijent={$pacijent}");
        if(pg_num_rows($result)>0){
            while ($row = pg_fetch_assoc($result)) {
                $polje[] = $row;
              }
        }else {
            $polje["postoji"]="Ne";
            }
        echo json_encode($polje);
   
    exit();
    }
    if(isset($_POST['receptiPacijent'])){

        $pacijent = $_POST['receptiPacijent'];
       $result = pg_query($connection, "SELECT * FROM pregled WHERE izdan IS NULL and idpacijent={$pacijent}");
        if(pg_num_rows($result)>0){
            while ($row = pg_fetch_assoc($result)) {
                $polje[] = $row;
              }
        }else {
            $polje["postoji"]="Ne";
            }
        echo json_encode($polje);
   
    exit();
    }

    if(isset($_POST['grad'])){

       $result = pg_query($connection, "SELECT * FROM grad ORDER BY 2;");
        if(pg_num_rows($result)>0){
            while ($row = pg_fetch_assoc($result)) {
                $polje[] = $row;
              }
        }else {
            $polje["postoji"]="Ne";
            }
        echo json_encode($polje);
   
    exit();
    }

    if(isset($_POST['doktor'])){

        $grad = $_POST['doktor'];
        $result = pg_query($connection, "SELECT l.idlijecnik, l.ime,l.prezime,s.naziv FROM lijecnik l JOIN specijalizacija s ON s.idspecijalizacija = l.idspecijalizacija WHERE l.idbolnica={$grad}");
         if(pg_num_rows($result)>0){
             while ($row = pg_fetch_assoc($result)) {
                 $polje[] = $row;
               }
         }else {
             $polje["postoji"]="Ne";
             }
         echo json_encode($polje);
    
     exit();
    }

    if(isset($_POST['podaci'])){
        $podaci = $_POST['podaci'];
      /* echo json_encode("INSERT INTO narucivanje (idtermin,datum,idpacijent) VALUES 
       ((SELECT idtermin FROM termin WHERE iddan={$podaci[0]} AND vrijemod='{$podaci[1]}' AND vrijemedo='{$podaci[2]}' AND idlijecnik={$podaci[4]}),'{$podaci[5]}',{$podaci[3]});");
        */$result = pg_query($connection, "INSERT INTO narucivanje (idtermin,datum,idpacijent) VALUES 
        ((SELECT idtermin FROM termin WHERE iddan={$podaci[0]} AND vrijemod='{$podaci[1]}' AND vrijemedo='{$podaci[2]}' AND idlijecnik={$podaci[4]}),'{$podaci[5]}',{$podaci[3]});");
         if(pg_num_rows($result)>0){
             while ($row = pg_fetch_assoc($result)) {
                 $polje[] = $row;
               }
         }else {
             $polje["postoji"]="Ne";
             }
         echo json_encode($polje);

     exit();
    }
    if(isset($_POST['selectTermini'])){
        $pacijent = $_POST['selectTermini'];
     
        $result = pg_query($connection, "SELECT p.idnarucivanje,p.datum,t.vrijemod,t.vrijemedo,l.ime,l.prezime, b.naziv as bolnica, s.naziv as specijalizacija, p.promijena FROM narucivanje p JOIN termin t ON p.idtermin = t.idtermin JOIN lijecnik l ON l.idlijecnik=t.idlijecnik JOIN
        bolnica b on b.idbolnica= l.idbolnica JOIN specijalizacija s ON s.idspecijalizacija = l.idspecijalizacija WHERE p.idpacijent={$pacijent}");
         if(pg_num_rows($result)>0){
             while ($row = pg_fetch_assoc($result)) {
                 $polje[] = $row;
               }
         }else {
             $polje["postoji"]="Ne";
             }
         echo json_encode($polje);

     exit();
    }



    if(isset($_POST['otkazivanje'])){
        $otkazivanje = $_POST['otkazivanje'];
     
        $result = pg_query($connection, "DELETE FROM narucivanje where idnarucivanje={$otkazivanje}");
         if(pg_num_rows($result)>0){
             while ($row = pg_fetch_assoc($result)) {
                 $polje[] = $row;
               }
         }else {
             $polje["postoji"]="Ne";
             }
         echo json_encode($polje);

     exit();
    }

    if(isset($_POST['prihvacanje'])){
        $prihvacanje = $_POST['prihvacanje'];
     
        $result = pg_query($connection, "UPDATE narucivanje SET promijena = null WHERE idnarucivanje ={$prihvacanje}");
         if(pg_num_rows($result)>0){
            $polje["postoji"]="Ok";
         }else {
             $polje["postoji"]="Ne";
             }
         echo json_encode($polje);

     exit();
    }

    if(isset($_POST['imeDoktora'])){
        $imeDoktora = $_POST['imeDoktora'];
     
        $result = pg_query($connection, "SELECT ime,prezime FROM lijecnik where idlijecnik={$imeDoktora}");
         if(pg_num_rows($result)>0){
             while ($row = pg_fetch_assoc($result)) {
                 $polje[] = $row;
               }
         }else {
             $polje["postoji"]="Ne";
             }
         echo json_encode($polje);

     exit();
    }

    if(isset($_POST['imeLjekarne'])){
        $imeLjekarne = $_POST['imeLjekarne'];
     
        $result = pg_query($connection, "SELECT naziv FROM ljekarna where idljekarna={$imeLjekarne}");
         if(pg_num_rows($result)>0){
             while ($row = pg_fetch_assoc($result)) {
                 $polje[] = $row;
               }
         }else {
             $polje["postoji"]="Ne";
             }
         echo json_encode($polje);

     exit();
    }

    if(isset($_POST['imePacijenta'])){
        $imePacijenta = $_POST['imePacijenta'];
     
        $result = pg_query($connection, "SELECT ime,prezime FROM pacijent where idpacijent={$imePacijenta}");
         if(pg_num_rows($result)>0){
             while ($row = pg_fetch_assoc($result)) {
                 $polje[] = $row;
               }
         }else {
             $polje["postoji"]="Ne";
             }
         echo json_encode($polje);

     exit();
    }

    if(isset(($_POST['idRecept']),($_POST['nazivLjekova']),($_POST['kolicinaLjekova']),$_POST['cookie'])){
       
        $idRecept = $_POST['idRecept'];
        $nazivLjekova = $_POST['nazivLjekova'];
        $kolcinaLjekova = $_POST['kolicinaLjekova'];
        $cookie = $_POST['cookie'];
      
        $result = pg_query($connection, "UPDATE pregled SET izdan=now() WHERE idpregled={$idRecept} ");
        for ($i=0; $i < count($nazivLjekova); $i++) { 
            $resultUpdate = pg_query($connection, "UPDATE skladiste SET kolicina=kolicina-{$kolcinaLjekova[$i]} WHERE idlijek=(SELECT idlijek FROM lijek WHERE naziv='{$nazivLjekova[$i]}') AND idljekarna={$cookie}");
        }
         if(pg_num_rows($result)>0){
             while ($row = pg_fetch_assoc($result)) {
                 $polje[] = $row;
               }
         }else {
             $polje["postoji"]="Ne";
             }
         echo json_encode("Trebalo bi vratit");

     exit();
    }

    if(isset($_POST['skladiste'])){
        $skladiste = $_POST['skladiste'];
     
        $result = pg_query($connection, "SELECT s.idljekarna, l.naziv, s.kolicina FROM skladiste s JOIN lijek l ON s.idlijek=l.idlijek where s.idljekarna={$skladiste} ORDER BY 2");
         if(pg_num_rows($result)>0){
             while ($row = pg_fetch_assoc($result)) {
                 $polje[] = $row;
               }
         }else {
             $polje["postoji"]="Ne";
             }
         echo json_encode($polje);

     exit();
    }
    if(isset($_POST['updateSkladiste'])){
        $updateSkladiste = $_POST['updateSkladiste'];
      //echo json_encode("UPDATE skladiste set kolicina=kolicina+{$updateSkladiste[2]} where idljekarna={$updateSkladiste[0]} and idlijek=(SELECT idlijek FROM lijek WHERE naziv='{$updateSkladiste[1]}')");
    $result = pg_query($connection, "UPDATE skladiste set kolicina=kolicina+{$updateSkladiste[2]} where idljekarna={$updateSkladiste[0]} and idlijek=(SELECT idlijek FROM lijek WHERE naziv='{$updateSkladiste[1]}')");
         if(pg_num_rows($result)>0){
             while ($row = pg_fetch_assoc($result)) {
                 $polje[] = $row;
               }
         }else {
             $polje["postoji"]="Ne";
             }
         echo json_encode($polje);

     exit();
    }
    if(isset($_POST['ulogaKorisnika'])){

        $uloga = $_POST['ulogaKorisnika'];
        $result = pg_query($connection, "SELECT * FROM narucivanje WHERE idpacijent= $uloga");
        if(pg_num_rows($result)>0){
            while ($row = pg_fetch_assoc($result)) {
                $polje[] = $row;
              }
        }else {
            $polje["postoji"]="Ne";
            }
        echo json_encode($polje);

    exit();
   }
   if(isset($_POST['promijenaTermina'])){

    $uloga = $_POST['promijenaTermina'];
    $result = pg_query($connection, "SELECT * FROM narucivanje WHERE idpacijent= $uloga and promijena is not null");
    if(pg_num_rows($result)>0){
        $polje["postoji"]="Da";
    }else {
        $polje["postoji"]="Ne";
        }
    echo json_encode($polje);

exit();
}
   

   
    
?>



