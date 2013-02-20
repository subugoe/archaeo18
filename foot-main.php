<footer class="clearfix">
	<div class="wrap">
		<div>
			<!-- <img src="img/footer-lakon.png" /> -->
		</div>
		<div class="footer-col-bg-gradient clearfix">
			<ul>
				<li><a href="#" title="Lorem ipsum dolor sit amet" hreflang="de">Start</a></li>
				<li><a href="#" title="Lorem ipsum dolor sit amet" hreflang="de">Handschriften</a></li>
				<li><a href="#" title="Lorem ipsum dolor sit amet" hreflang="de">Indices</a></li>
				<li><a href="#" title="Lorem ipsum dolor sit amet" hreflang="de">Edition</a></li>
			</ul>
			<ul>
				<li><a href="#" title="Lorem ipsum dolor sit amet" hreflang="de">Impressum</a></li>
				<li><a href="#" title="Lorem ipsum dolor sit amet" hreflang="de">Nutzungsbedingungen</a></li>
				<li><a href="#" id="linkhelp" title="Lorem ipsum dolor sit amet" hreflang="de">Hilfe</a></li>
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
		var showDiv = function(div,link,e){
			if( typeof e != "undefined" ){
				e.preventDefault();
			}
			$('#start_page').css('display','none');
			$('#edition_page').css('display','none');
			$('#indices_page').css('display','none');
			$('#manuscripts_page').css('display','none');
			$('#help_page').css('display','none');
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
		} else {
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

		$('#linkhelp').click(function(e){
			showDiv('#help_page','#linkhelp',e);
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
