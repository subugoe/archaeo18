#I Build SolR Index
apply solr.xsl to the documents
solr.xsl  *.xml 
> bash ./post.sh *.html 

#II Synonyme

* apply synonymelist.xsl to enriched TEIs
* postprocessing<br />
remove <?xml... 

> sort -bidu *.html > index_synonymes.txt

* move index_synonyms.txt to conf/
* configure conf/schema.xml

`<filter class="solr.SynonymFilterFactory" synonyms="index_synonyms.txt" ignoreCase="true" expand="true"/>`



#III Postprocessing of SolR responses
* add to config/solrconfig.xml

`<queryResponseWriter name="xslt" class="org.apache.solr.response.XSLTResponseWriter">
  <int name="xsltCacheLifetimeSeconds">5</int>
</queryResponseWriter>`

Transformation script should be located in conf/xslt/

add to query
wt=xslt&tr=solrresponse.xsl
Example: 
http://192.168.33.18:8080/archaeo18/select?q=person:victoria&wt=xslt&indent=true&tr=solrresponse.xsl

Example search:
http://192.168.33.18:8080/solr/archaeo18/select?q=persName%3Aheyne&wt=xml&indent=true&hl=true&hl.fl=content&hl.simple.pre=%3Cem%3E&hl.simple.post=%3C%2Fem%3E&hl.fragsize=0

XSLT search:
http://192.168.33.18:8080/solr/archaeo18/select?q=persName%3Aheyne&wt=xslt&indent=true&hl=true&hl.fl=content&hl.simple.pre=%3Cem%3E&hl.simple.post=%3C%2Fem%3E&hl.fragsize=0&tr=solrresponse.xsl

If you start Solr by running 'ant jetty.start', the port will be 8080 instead of 8983.

#IV Ant
* Start Solr using Ant (will be running unless a key is paressed)

> ant solr.run

* Create index Documents using Ant 

> ant solr.docs

##Ant TODO
* Generate synonyms
