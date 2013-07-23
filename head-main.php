<?php
$pagename = explode('/', $_SERVER['SCRIPT_FILENAME']);
$pagename = preg_replace('(.php)', '', $pagename[(sizeof($pagename) - 1)]);
$pageClass = 'index';
if (strstr($_SERVER['SCRIPT_FILENAME'], 'edition.php')) $pageClass = 'edition';
?>
<!doctype html>
<!--[if lt IE 7]> <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js lt-ie9" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="header-normal no-js <?php echo($pageClass); ?>" lang="de"> <!--<![endif]-->
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<!-- <base href="http://archaeo18/" /> -->
	<title>ARCHAEO 18</title>
	<link rel="apple-touch-icon" href="./Resources/Public/Images/Apple/apple-touch-icon.png" />
	<link rel="shortcut icon" href="./favicon.ico" />
	<meta name="viewport" content="width=device-width">
	<link href="ropen/Resources/Public/Css/style.css" rel="stylesheet" type="text/css">
	<link rel="stylesheet" href="Resources/Public/Css/style.css">
	<link href='http://fonts.googleapis.com/css?family=Droid+Serif:400,700,400italic,700italic' rel='stylesheet' type='text/css'>
	<link href='http://fonts.googleapis.com/css?family=Droid+Sans:400,700' rel='stylesheet' type='text/css'>
</head>
<body>

<header>
	<nav>
		<ul>
			<li><a href="javascript:void(0)" title="Start" hreflang="de" id="linkstart">Start</a></li>
			<li><a href="javascript:void(0)" title="Edition" hreflang="de" id="linkedition">Edition</a></li>
			<li><a href="javascript:void(0)" title="Indices" hreflang="de" id="linkindices">Indices</a></li>
			<li><a href="javascript:void(0)" title="Handschriften" hreflang="de" id="linkhandschriften">Handschriften</a></li>
		</ul>
	</nav>
	<a href="#" title="Hauptmenue ein- oder ausklappen" hreflang="de" class="header-button icon-wrench">&nbsp;<span class="visuallyhidden">Close Header</span></a>
</header>

<noscript>
	<p>Dieses Angebot setzt aktiviertes JavaScript in Ihrem Browser zwingend voraus.</p>
</noscript>

<div id="wrapper">
