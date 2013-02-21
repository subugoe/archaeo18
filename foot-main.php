<footer class="clearfix">
	<div class="wrap">
		<div>
			<!-- <img src="img/footer-lakon.png" /> -->
		</div>
		<div class="footer-col-bg-gradient clearfix">
			<ul>
				<li><a href="javascript:void(0)" id="linkstart" title="Lorem ipsum dolor sit amet" hreflang="de">Start</a></li>
				<li><a href="javascript:void(0)" id="linkhandschriften" title="Lorem ipsum dolor sit amet" hreflang="de">Handschriften</a></li>
				<li><a href="javascript:void(0)" id="linkindices" title="Lorem ipsum dolor sit amet" hreflang="de">Indices</a></li>
				<li><a href="javascript:void(0)" id="linkedition" title="Lorem ipsum dolor sit amet" hreflang="de">Edition</a></li>
			</ul>
			<ul>
				<li><a href="javascript:void(0)" id="linkimprint" title="Lorem ipsum dolor sit amet" hreflang="de">Impressum</a></li>
				<li><a href="javascript:void(0)" id="linkdatabases" title="Lorem ipsum dolor sit amet" hreflang="de">Datenbanken und Repositorien</a></li>
				<li><a href="javascript:void(0)" id="linkterms" title="Lorem ipsum dolor sit amet" hreflang="de">Nutzungsbedingungen</a></li>
				<li><a href="javascript:void(0)" id="linkhelp" title="Lorem ipsum dolor sit amet" hreflang="de">Hilfe</a></li>
			</ul>
		</div>
		<div class="clearfix">
			<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi commodo, ipsum sed pharetra gravida, orci magna rhoncus neque, id pulvinar odio lorem non turpis.</p>
			<!-- <p><span id="fullscreen" style="cursor: pointer">Enter Fullscreen</span></p> -->
			<!--
			<a href="http://www.sub.uni-goettingen.de" title="Niedersächsische Staats- und Universitätsbibliothek Göttingen" hreflang="de"><img src="./img/logo-sub.png" alt="" /></a>
			<a href="http://www.dfg.de" title="Deutsche Forschungsgemeinschaft" hreflang="de"><img src="./img/logo-dfg.png" alt="" /></a>
			<a href="" hreflang="de"><img src="http://placehold.it/135x50" style="padding: 0 0 0 11px;" alt="" /></a>
			-->
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

<!--
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script>window.jQuery || document.write('<script src="./js/libs/jquery-1.7.2.min.js"><\/script>')</script>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js"></script>
-->
<script>window.jQuery || document.write('<script src="./js/libs/jquery-1.5.1.min.js"><\/script>')</script>

	<script>

		var showDiv = function(div,link){
			$('#start_page').css('display','none');
			$('#edition_page').css('display','none');
			$('#indices_page').css('display','none');
			$('#manuscripts_page').css('display','none');
			$('#help_page').css('display','none');
			$('#terms_page').css('display','none');
			$('#databases_page').css('display','none');
			$('#linkstart').removeClass('selected');
			$('#linkedition').removeClass('selected');
			$('#linkindices').removeClass('selected');
			$('#linkhandschriften').removeClass('selected');
			if( typeof link != 'undefined' ){
				$(link).addClass('selected');
			}
			$(div).css('display','block');
		}

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

		$('#linkstart').click(function(){
			showDiv('#start_page','#linkstart');
			location.hash = "?page=#start_page&link=#linkstart";
		});

		$('#linkedition').click(function(){
			showDiv('#edition_page','#linkedition');
			EditionGui.gridLayout();
			location.hash = "?page=#edition_page&link=#linkedition";
		});

		$('#linkindices').click(function(){
			showDiv('#indices_page','#linkindices');
			Indices.checkDisplay();
			location.hash = "?page=#indices_page&link=#linkindices";
		});

		$('#linkhandschriften').click(function(){
			showDiv('#manuscripts_page','#linkhandschriften');
			location.hash = "?page=#manuscripts_page&link=#linkhandschriften";
		});

		$('#linkhelp').click(function(e){
			showDiv('#help_page','#linkhelp',e);
			location.hash = "?page=#help_page";
		});

		$('#linkterms').click(function(e){
			showDiv('#terms_page','#linkhelp',e);
		});

		$('#linkimprint').click(function(e){
			showDiv('#imprint_page','#linkimprint',e);
		});

		$('#linkdatabases').click(function(e){
			showDiv('#databases_page','#linkdatabases',e);
		});

	</script>


<script src="./js/libs/plugins.js"></script>
<script src="./js/libs/cookie.js"></script>
<script src="./js/libs/fixie.js"></script>
<script src="./js/libs/dataTables.js"></script>
<script src="./js/libs/prefixfree.js"></script>
<script src="./js/script.js"></script>
<!-- end scripts-->

</body>
</html>
