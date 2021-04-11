<?php

$method = $_SERVER['REQUEST_METHOD'];

//Script Foreach
$c = true;
if ( $method === 'POST' ) {

	$site = trim($_POST["site"]);
	$email  = trim($_POST["email"]);
	$subject = trim($_POST["subject"]);

	foreach ( $_POST as $key => $value ) {
		if ( $value != "" && $key != "site" && $key != "email" && $key != "subject" ) {
			$message .= "
			" . ( ($c = !$c) ? '<tr>':'<tr>' ) . "
				<td style='padding: 10px; width: auto;'><b>$key:</b></td>
				<td style='padding: 10px;width: 100%;'>$value</td>
			</tr>
			";
		}
	}
} else if ( $method === 'GET' ) {

	$site = trim($_GET["site"]);
	$email  = trim($_GET["email"]);
	$subject = trim($_GET["subject"]);

	foreach ( $_GET as $key => $value ) {
		if ( $value != "" && $key != "site" && $key != "email" && $key != "subject" ) {
			$message .= "
			" . ( ($c = !$c) ? '<tr>':'<tr>' ) . "
				<td style='padding: 10px; width: auto;'><b>$key:</b></td>
				<td style='padding: 10px;width: 100%;'>$value</td>
			</tr>
			";
		}
	}
}

$message = "<table style='width: 50%;'>$message</table>";

function adopt($text) {
	return '=?UTF-8?B?'.Base64_encode($text).'?=';
}

$headers = "MIME-Version: 1.0" . PHP_EOL .
"Content-Type: text/html; charset=utf-8" . PHP_EOL .
'From: '.adopt($site).' <'.$email.'>' . PHP_EOL .
'Reply-To: '.$email.'' . PHP_EOL;

mail($email, adopt($subject), $message, $headers );
