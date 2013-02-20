<?php
$pagename = explode('/', $_SERVER['SCRIPT_FILENAME']);
#$pagename = $pagename[(sizeof($pagename) - 1)];
#$pagename = preg_replace('(.php)', '', $pagename);
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
	<title>ARCHAEO 18 - <?php echo strtoupper($pagename)?></title>
	<link rel="apple-touch-icon" href="./apple-touch-icon.png" />
	<link rel="shortcut icon" href="./favicon.ico" />
	<meta name="viewport" content="width=device-width">
	
	<link rel="stylesheet" href="css/style.css">
	<link href='http://fonts.googleapis.com/css?family=Droid+Serif:400,700,400italic,700italic' rel='stylesheet' type='text/css'>
	<link href='http://fonts.googleapis.com/css?family=Droid+Sans:400,700' rel='stylesheet' type='text/css'>
	<script src="./js/libs/modernizr-2.5.3.min.js"></script>

</head>
<body>

<header>
	<nav>
		<ul>
			<li><a href="#" title="Start" hreflang="de" id="linkstart">Start</a></li>
			<li><a href="#" title="Edition" hreflang="de" id="linkedition">Edition</a></li>
			<li><a href="#" title="Indices" hreflang="de" id="linkindices">Indices</a></li>
			<li><a href="#" title="Handschriften" hreflang="de" id="linkhandschriften">Handschriften</a></li>
		</ul>
	</nav>
	<a href="#" title="Lorem ipsum dolor sit amet" hreflang="de" class="header-button header-button-close">&nbsp;<span class="visuallyhidden">Close Header</span></a>
</header>

<noscript>
	<p>Dieses Angebot setzt aktiviertes JavaScript in Ihrem Browser zwingend voraus.</p>
</noscript>