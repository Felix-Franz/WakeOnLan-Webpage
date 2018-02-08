<?php
require_once('config.php');

//var_dump(Config::$users);
//echo("<br /> <br />");
//var_dump(Config::$devices);


function handlePost($body){
	$hardwareAddress = Config::$devices[$body->id][hardwareAddress];
	exec("wakeonlan " . $hardwareAddress, $output, $errorCode);
	if ($errorCode == 0) return $output[0];
	else {
		http_response_code(500);
		return "could not execute " . "wakeonlan " . $hardwareAddress . "!";
	}
}

function handleGet($body){
	var_dump($body);
	$devices = Config::$devices;
	for ($i=0; $i<count($devices); $i++){
		$devices[$i]["id"] = $i;
	}
	header('Content-Type: application/json');
	return json_encode($devices);
}

function handleRequest(){
	$rawBody = file_get_contents('php://input');
	$body = json_decode($rawBody);
	switch($_SERVER['REQUEST_METHOD']){
		case "GET":
			echo(handleGet($body));
			break;
		case "POST":
			echo(handlePost($body));
			break;
		default:
			http_response_code(405);
			echo("Method not allowed!");
			break;
	 }
	
}

handleRequest();
?>
