<?php
require_once('config.php');

//var_dump(Config::$users);
//echo("<br /> <br />");
//var_dump(Config::$devices);

function error(){
	$message = func_get_arg(0);
	$errorCode = func_get_arg(1);
	if (!$errorCode) $errorCode = 500;
	throw new Exception($message, $errorCode);
}

function authorize($rawBasicAuth){
	if (substr( $rawBasicAuth, 0, 6 ) !== "Basic ") error("Use Basic Authentification!", 400);
	$encodedBasicAuth = substr( $rawBasicAuth, 6, strlen($rawBasicAuth) );
	$basicAuth = base64_decode($encodedBasicAuth);
	$splittedBasicAuth = explode(":", $basicAuth);
	$user = $splittedBasicAuth[0];
	$password = $splittedBasicAuth[1];
	if (Config::$hashAlgorithm) $password = hash(Config::$hashAlgorithm ,$password); //TODO hash password
	if (Config::$users[$user] !== $password) error("Wrong username or password", 403);
}

function handlePost($header, $body){
	authorize($header["AUTHORIZATION"]);
	$hardwareAddress = Config::$devices[$body->id][hardwareAddress];
	exec("wakeonlan " . $hardwareAddress, $output, $errorCode);
	if ($errorCode == 0) return $output[0];
	else error("could not execute " . "wakeonlan " . $hardwareAddress . "!", 500);
}

function handleGet($body){
	$devices = Config::$devices;
	for ($i=0; $i<count($devices); $i++){
		$devices[$i]["id"] = $i;
	}
	header('Content-Type: application/json');
	return json_encode($devices);
}

function getHttpHeader(){
	$header;
	foreach($_SERVER as $key=>$value) {
		if (substr( $key, 0, 5 ) === "HTTP_")
			$header[substr($key, 5, strlen($key))] = $value;
	}
	return $header;	
}

function handleRequest(){
	try {
		$rawBody = file_get_contents('php://input');
		$header = getHttpHeader();
		$body = json_decode($rawBody);
		switch($_SERVER['REQUEST_METHOD']){
			case "GET":
				echo(handleGet($header, $body));
				break;
			case "POST":
				echo(handlePost($header, $body));
				break;
			default:
				error("Method not allowed!", 405);
				break;
		}
	} catch(Exception $e) {
		echo($e->getMessage());
		http_response_code($e->getCode());
	}
}

handleRequest();
?>
