<?php
require_once('config.php');

//var_dump(Config::$users);
//echo("<br /> <br />");
//var_dump(Config::$devices);


function handleGet(){
	return Config::$devices;
}

function handleRequest(){
	 switch($_SERVER['REQUEST_METHOD']){
		case "GET":
			echo(json_encode(handleGet()));
			break;
		default:
			http_response_code(405);
			echo("Method not allowed!");
			break;
	 }
	
}

handleRequest();
?>
