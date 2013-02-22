<div class="push"></div>
</div>

<footer class="clearfix">
	<div class="wrap">
		<div>
			<!-- <img src="img/footer-lakon.png" /> -->
		</div>
		<div class="footer-col-bg-gradient clearfix">
			<ul>
				<li><a href="javascript:void(0)" id="linkstart2" title="Startseite" hreflang="de">Start</a></li>
				<li><a href="javascript:void(0)" id="linkhandschriften2" title="Handschriften" hreflang="de">Handschriften</a></li>
				<li><a href="javascript:void(0)" id="linkindices2" title="Indices" hreflang="de">Indices</a></li>
				<li><a href="javascript:void(0)" id="linkedition2" title="Edition" hreflang="de">Edition</a></li>
			</ul>
			<ul>
				<li><a href="javascript:void(0)" id="linkhelp" title="Hilfe" hreflang="de">Hilfe</a></li>
				<li><a href="javascript:void(0)" id="linkterms" title="Editionsrichtlinien" hreflang="de">Editionsrichtlinien</a></li>
				<li><a href="javascript:void(0)" id="linkdatabases" title="Datenbanken und Repositorien" hreflang="de">Datenbanken und Repositorien</a></li>
			</ul>
		</div>
		<div class="clearfix">
			<ul>
				<li><a href="javascript:void(0)" id="linkimprint" title="Impressum" hreflang="de">Impressum</a></li>
				<li><a href="javascript:void(0)" id="linkpeople" title="Projektmitarbeiter" hreflang="de">Projektmitarbeiter</a></li>
				<li><a href="mailto:heynedigital@sub.uni-goettingen.de">Kontakt</a></li>
			</ul>
		</div>
		<div style="display: inline; float: left;">
			<ul class="logos">
				<li><a href="http://dfg.de" target="_blank" title="Deutsche Forschungsgemeinschaft e.V." hreflang="de"><img src="./img/logo/logo_footer_dfg.jpg" alt="" /></a></li>
				<li><a href="http://www.sub.uni-goettingen.de" title="Niedersächsische Staats- und Universitätsbibliothek Göttingen" hreflang="de" target="_blank" style="margin: 0 0 0 -5px;"><img src="./img/logo/logo_footer_sub.jpg" alt="" /></a></li>
				<li><a href="http://www.uni-goettingen.de" title="Georg-August-Universität Göttingen" hreflang="de" target="_blank" style="margin: 0 0 0 -5px;"><img src="./img/logo/logo_footer_uni.jpg" alt="" /></a></li>
			</ul>
		</div>
	</div>
</footer>

<!-- include geotemco -->
<link rel="stylesheet" href="ropen/lib/GeoTemCo/css/geotemco.css" type="text/css" />
<script src="ropen/lib/GeoTemCo/geotemco-min.js"></script>

<!-- include jQuery -->
<link rel="stylesheet" href="ropen/lib/jquery-ui-1.10.0.custom/css/ui-lightness/jquery-ui-1.10.0.custom.css">
<script src="ropen/lib/jQuery/jquery-1.5.1.js"></script>
<script src="ropen/lib/jquery-ui-1.10.0.custom/js/jquery-ui-1.10.0.custom.js"></script>

<!-- include jQuery plugin dynatree -->
<link href="ropen/lib/dynatree/src/skin/ui.dynatree.css" rel="stylesheet" type="text/css">
<script src="ropen/lib/dynatree/src/jquery.dynatree.js" type="text/javascript"></script>

<!-- include jQuery plugin lazyloader -->
<script src="ropen/lib/lazyloader/jquery.lazyloader.js"></script>

<!-- include jQuery plugin Fullscreen -->
<script src="ropen/lib/fullscreen/fullscreen.js"></script>

<!-- include jsonlib plugin -->
<script src="ropen/lib/jsonlib/jsonlib.js"></script>

<!-- include jQCloud plugin -->
<link href="ropen/lib/jqcloud/jqcloud.css" rel="stylesheet" type="text/css">
<script type="text/javascript" src="ropen/lib/jqcloud/jqcloud-1.0.0.js"></script> 

<!-- include archaeo18 GUI -->
<link type="text/css" rel="stylesheet" href="ropen/css/archaeo18.css">
<link type="text/css" rel="stylesheet" href="ropen/css/tei.css">
<script src="ropen/js/Config/EditionProperties.js"></script>
<script src="ropen/js/Config/EditionTooltips.js"></script>
<script src="ropen/js/System/DocumentServerConnection.js"></script>
<script src="ropen/js/System/Util.js"></script>
<script src="ropen/js/System/BrowserDetect.js"></script>
<script src="ropen/js/Processors/TEIProcessor.js"></script>
<script src="ropen/js/Processors/XHTMLProcessor.js"></script>
<script src="ropen/js/Processors/LinkProcessor.js"></script>
<script src="ropen/js/Gui/Pagination.js"></script>
<script src="ropen/js/Gui/FacetSelector.js"></script>
<script src="ropen/js/Document/Document.js"></script>
<script src="ropen/js/Document/Views/Text.js"></script>
<script src="ropen/js/Document/Views/Images.js"></script>
<script src="ropen/js/Document/Views/Pages.js"></script>
<script src="ropen/js/Document/Views/Outline.js"></script>
<script src="ropen/js/Document/Views/TEI.js"></script>
<script src="ropen/js/Document/Views/Thumbnails.js"></script>
<script src="ropen/js/Document/Views/Places.js"></script>
<script src="ropen/js/Document/Views/Tags.js"></script>
<script src="ropen/js/Gui/FrameWindow.js"></script>
<script src="ropen/js/Gui/Folder.js"></script>
<script src="ropen/js/Gui/HyperlinkWindow.js"></script>
<script src="ropen/js/Gui/Browser.js"></script>
<script src="ropen/js/Gui/DocumentDialog.js"></script>
<script src="ropen/js/Gui/OverlayWindow.js"></script>
<script src="ropen/js/Gui/Tooltip.js"></script>
<script src="ropen/js/EditionGui.js"></script>
<script src="js/Indices.js"></script>
<script src="js/Scripts.js"></script>

<script>

	var showDiv = function(div,link){
		$('#start_page').css('display','none');
		$('#edition_page').css('display','none');
		$('#indices_page').css('display','none');
		$('#manuscripts_page').css('display','none');
		$('#help_page').css('display','none');
		$('#terms_page').css('display','none');
		$('#databases_page').css('display','none');
		$('#people_page').css('display','none');
		$('#imprint_page').css('display','none');
		$('#linkstart').removeClass('selected');
		$('#linkedition').removeClass('selected');
		$('#linkindices').removeClass('selected');
		$('#linkhandschriften').removeClass('selected');
		if( typeof link != 'undefined' ){
			$(link).addClass('selected');
		}
		$(div).css('display','block');
	}

	var loadPage = function(){
		if( window.location.href.indexOf('?params') != -1 ){
			showDiv('#edition_page','#linkedition');
			EditionGui.gridLayout();
		} else if( window.location.href.indexOf('?page=') != -1 ){
			var data = window.location.href.split('?page=')[1];
			var page = data, link;
			if( data.indexOf('&link=') != -1 ){
				var data2 = data.split('&link=');
				page = data2[0];
				link = data2[1];
			}			
			showDiv(page,link);
		} else {
			showDiv('#start_page','#linkstart');
		}
	}
	loadPage();

	$('#linkstart').click(function(){
		showDiv('#start_page','#linkstart');
		location.hash = "?page=#start_page&link=#linkstart";
		document.title = 'Archaeo 18: Start';
	});

	$('#linkedition').click(function(){
		showDiv('#edition_page','#linkedition');
		EditionGui.gridLayout();
		location.hash = "?page=#edition_page&link=#linkedition";
		document.title = 'Archaeo 18: Edition';
	});

	$('#linkindices').click(function(){
		showDiv('#indices_page','#linkindices');
		Indices.checkDisplay();
		location.hash = "?page=#indices_page&link=#linkindices";
		document.title = 'Archaeo 18: Indices';
	});

	$('#linkhandschriften').click(function(){
		showDiv('#manuscripts_page','#linkhandschriften');
		location.hash = "?page=#manuscripts_page&link=#linkhandschriften";
		document.title = 'Archaeo 18: Handischriften';
	});

	$('#linkstart2').click(function(){
		showDiv('#start_page','#linkstart');
		location.hash = "?page=#start_page&link=#linkstart";
		document.title = 'Archaeo 18: Start';
	});

	$('#linkedition2').click(function(){
		showDiv('#edition_page','#linkedition');
		EditionGui.gridLayout();
		location.hash = "?page=#edition_page&link=#linkedition";
		document.title = 'Archaeo 18: Edition';
	});

	$('#linkindices2').click(function(){
		showDiv('#indices_page','#linkindices');
		Indices.checkDisplay();
		location.hash = "?page=#indices_page&link=#linkindices";
		document.title = 'Archaeo 18: Indices';
	});

	$('#linkhandschriften2').click(function(){
		showDiv('#manuscripts_page','#linkhandschriften');
		location.hash = "?page=#manuscripts_page&link=#linkhandschriften";
		document.title = 'Archaeo 18: Handschriften';
	});

	$('#linkhelp').click(function(){
		showDiv('#help_page','#linkhelp');
		location.hash = "?page=#help_page";
		document.title = 'Archaeo 18: Hilfe';
	});

	$('#linkterms').click(function(){
		showDiv('#terms_page','#linkhelp');
		location.hash = "?page=#terms_page";
		document.title = 'Archaeo 18: Editionsrichtlinien';
	});

	$('#linkimprint').click(function(){
		showDiv('#imprint_page','#linkimprint');
		location.hash = "?page=#imprint_page";
		document.title = 'Archaeo 18: Impressum';
	});

	$('#linkdatabases').click(function(e){
		showDiv('#databases_page','#linkdatabases',e);
		location.hash = "?page=#databases_page";
		document.title = 'Archaeo 18: Datenbanken und Repositorien';
	});

	$('#linkpeople').click(function(e){
		showDiv('#people_page','#linkpeople',e);
		location.hash = "?page=#people_page";
		document.title = 'Archaeo 18: Projekmitarbeiter';
	});

	window.onhashchange = function(){
		if( location.hash.indexOf('?') != -1 ){
			loadPage();
		}
	};

	EditionGui.initialize({
		hyperlinkWindow: false
	});

</script>

<script src="./js/plugins.js"></script>
<script src="./js/script.js"></script>

</body>
</html>
