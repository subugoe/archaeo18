<?php require_once('head-main.php'); ?>

<div id="start_page">
	<div class="content clearfix">
		<div class="wrap">
			<section>
				<h2>Über das Projekt</h2>
				<p class="font-normal">Von 1767 bis 1804 hielt Christian Gottlob Heyne an der Universität Göttingen in fast jedem Sommersemester eine Vorlesung mit dem Titel „Die Archäologie oder die Kenntniß der Kunst und der Kunstwerke des Alterthums“. Sie war die erste speziell der antiken Kunst gewidmete Lehrveranstaltung an einer Universität und fand regen Zuspruch. Mitschriften der Vorlesung zirkulierten in ganz Europa, doch Heyne selbst fand nie Gelegenheit, den von ihm erstmals systematisch aufbereiteten Stoff zu einem Handbuch auszuarbeiten. Umso größere Bedeutung kommt den z. T. sehr umfangreichen Mitschriften zu, von denen bisher 15 Exemplare bekannt geworden sind.</p>
				<p class="font-normal">Auf dieser Webseite werden ## Mitschriften von Heynes Vorlesung in digitalisierter Form zugänglich gemacht, # davon auch in vollständiger Transkription. Hyperlinks in den Transkriptionen führen zu den einschlägigen Normdatenbanken für die im Text erwähnten Personen, Orte und Kunstwerke sowie zu digitalisierten Fassungen der von Heyne zitierten Publikationen und Abbildungen. Ziel dieser Online-Edition ist es, die herausragende Stellung von Heynes Lehrveranstaltung im Gefüge der archäologischen Wissensproduktion des 18. Jahrhunderts sichtbar und für weitere wissenschaftliche Studien zugänglich zu machen.</p>
				<!--
				<h2 class="fixie"></h2>
				<p class="font-normal fixie"></p>
				<p class="font-italic fixie"></p>
				<p class="font-bold fixie"></p>
				-->
			</section>
			<section class="contenttype-start textimg clearfix">
				<h2>Über Christian Gottlob Heyne</h2>
				<div>
					<img class="img" alt="" src="./img/heyne.jpg" class="content-img-style1 fixie" />
				</div>
				<div>
					<p class="font-normal">Christian Gottlob Heyne (1729–1812) war einer der bedeutendsten Gelehrten der Georg-August-Universität im 18. Jahrhundert. 1763 wurde er als Professor der Poesie und Beredsamkeit und Direktor des Philologischen Seminars nach Göttingen berufen. Bald übernahm er auch die Le	itung der Universitätsbibliothek und fungierte als Sekretär der Sozietät (heute Akademie) der Wissenschaften und als Herausgeber der „Göttingischen Anzeigen von gelehrten Sachen“.</p>
					<p class="font-normal">Während seiner fast fünfzigjährigen Wirkungszeit als Hochschullehrer bestimmte er maßgeblich die Geschicke der Göttinger Universität. Durch seine großen Textausgaben zu Homer und Vergil erwarb er sich europaweites Ansehen als Vertreter einer umfassenden Altertumswissenschaft. Sein besonderes Interesse galt der ästhetischen Dimension der antiken Literatur und Kunst. Im Sinne J. J. Winckelmanns sah er im „Studium des schönen Alterthums“ ein Mittel zur Humanisierung der Gesellschaft.</p>
					<!--
					<p class="font-normal fixie"></p>
					<p class="font-italic fixie"></p>
					<p class="font-bold fixie"></p>
					<p class="fixie"></p>
					<p class="fixie"></p>
					<p class="fixie"></p>
					<p class="fixie"></p>
					-->
				</div>
			</section>
		</div>
	</div>
</div>
<div id="edition_page">
	<div id="editionContainer" class="edition" style="position:relative;overflow:hidden;">
	</div>
</div>
<div id="indices_page">
	<div class="content clearfix">
		<div id="indicesSelection" class="wrap">
		</div>
		<div id="sectionContainer" class="wrap">
		</div>
	</div>
</div>
<div id="manuscripts_page">
	<div class="content clearfix">
		<div class="wrap">
			<section id="scriptsSelection">
			</section>
			<section id="scriptContainer" class="handwriting textimg clearfix">
			</section>
		</div>
	</div>
</div>

	<!-- include geotemco -->
	<link rel="stylesheet" href="edition/lib/GeoTemCo/css/geotemco.css" type="text/css" />
	<script src="edition/lib/GeoTemCo/geotemco-min.js"></script>

	<!-- include jQuery -->
	<link rel="stylesheet" href="edition/lib/jquery-ui-1.10.0.custom/css/ui-lightness/jquery-ui-1.10.0.custom.css">
 	<script src="edition/lib/jQuery/jquery-1.5.1.js"></script>
	<script src="edition/lib/jquery-ui-1.10.0.custom/js/jquery-ui-1.10.0.custom.js"></script>

	<!-- include jQuery plugin Fullscreen -->
	<script src="js/libs/fullscreen.js"></script>

	<!-- include jQuery plugin dynatree -->
  	<link href="edition/lib/dynatree/src/skin/ui.dynatree.css" rel="stylesheet" type="text/css">
  	<script src="edition/lib/dynatree/src/jquery.dynatree.js" type="text/javascript"></script>
  
	<!-- include jQuery plugin lazyloader -->
  	<script src="edition/lib/lazyloader/jquery.lazyloader.js"></script>

	<!-- include jsonlib plugin -->
  	<script src="edition/lib/jsonlib/jsonlib.js"></script>

	<!-- include jQCloud plugin -->
  	<link href="edition/lib/jqcloud/jqcloud.css" rel="stylesheet" type="text/css">
	<script type="text/javascript" src="edition/lib/jqcloud/jqcloud-1.0.0.js"></script> 

	<!-- include archaeo18 GUI -->
   	<link type="text/css" rel="stylesheet" href="edition/css/archaeo18.css">
   	<link type="text/css" rel="stylesheet" href="edition/css/tei.css">
	<script src="edition/js/Config/EditionProperties.js"></script>
	<script src="edition/js/Config/EditionTooltips.js"></script>
	<script src="edition/js/System/DocumentServerConnection.js"></script>
	<script src="edition/js/System/Util.js"></script>
	<script src="edition/js/System/BrowserDetect.js"></script>
	<script src="edition/js/Processors/TEIProcessor.js"></script>
	<script src="edition/js/Processors/XHTMLProcessor.js"></script>
	<script src="edition/js/Processors/LinkProcessor.js"></script>
	<script src="edition/js/Gui/Pagination.js"></script>
	<script src="edition/js/Gui/FacetSelector.js"></script>
	<script src="edition/js/Document/Document.js"></script>
	<script src="edition/js/Document/Views/Text.js"></script>
	<script src="edition/js/Document/Views/Images.js"></script>
	<script src="edition/js/Document/Views/Pages.js"></script>
	<script src="edition/js/Document/Views/Outline.js"></script>
	<script src="edition/js/Document/Views/TEI.js"></script>
	<script src="edition/js/Document/Views/Thumbnails.js"></script>
	<script src="edition/js/Document/Views/Places.js"></script>
	<script src="edition/js/Document/Views/Tags.js"></script>
	<script src="edition/js/Gui/FrameWindow.js"></script>
	<script src="edition/js/Gui/Folder.js"></script>
	<script src="edition/js/Gui/HyperlinkWindow.js"></script>
	<script src="edition/js/Gui/Browser.js"></script>
	<script src="edition/js/Gui/DocumentDialog.js"></script>
	<script src="edition/js/Gui/OverlayWindow.js"></script>
	<script src="edition/js/Gui/Tooltip.js"></script>
	<script src="edition/js/EditionGui.js"></script>
	<script src="js/Indices.js"></script>
	<script src="js/Scripts.js"></script>

	<script>
		var showDiv = function(div,link,e){
			if( typeof e != "undefined" ){
				e.preventDefault();
			}
			$('#start_page').css('display','none');
			$('#edition_page').css('display','none');
			$('#indices_page').css('display','none');
			$('#manuscripts_page').css('display','none');
			$('#linkstart').removeClass('selected');
			$('#linkedition').removeClass('selected');
			$('#linkindices').removeClass('selected');
			$('#linkhandschriften').removeClass('selected');
			$(div).css('display','block');
			$(link).addClass('selected');
		}

		if( window.location.href.indexOf('?params') != -1 ){
			showDiv('#edition_page','#linkedition');
			EditionGui.gridLayout();
		}
		else {
			showDiv('#start_page','#linkstart');
		}

		$('#linkstart').click(function(e){
			showDiv('#start_page','#linkstart',e);
		});

		$('#linkedition').click(function(e){
			showDiv('#edition_page','#linkedition',e);
			EditionGui.gridLayout();
		});

		$('#linkindices').click(function(e){
			showDiv('#indices_page','#linkindices',e);
			Indices.checkDisplay();
		});

		$('#linkhandschriften').click(function(e){
			showDiv('#manuscripts_page','#linkhandschriften',e);
		});
	</script>

<?php require_once('foot-main.php'); ?>