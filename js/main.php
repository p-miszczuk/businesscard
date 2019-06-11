<?php
	include_once("../phpmailer/phpmailer.php");

    
    if (isset($_POST["email"]) && isset($_POST["title"]) && isset($_POST["message"])) {

    	$name = $_POST['name'];
    	$mail = $_POST["email"];
    	$title = $_POST["title"];
    	$message = $_POST["message"];

    	mails($name,$mail,$title,$message);

    }
    
    
    
?>

