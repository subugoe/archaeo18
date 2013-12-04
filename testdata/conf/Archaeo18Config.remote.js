{
		"hyperlinkWindow":	false,
		"documentEndpoint": 	"/exist/rest/db/archaeo18/queries/listDocs.xquery",
		"textQuery": 		"/exist/rest/db/archaeo18/queries/getText.xq?mode=raw&format=xhtml&doc=DOC_ID&page=0",
		"pageQuery": 		"/exist/rest/db/archaeo18/queries/getText.xq?mode=raw&format=xhtml&doc=DOC_ID&page=PAGE_ID",
		"outlineQuery": 		"content/app/structure/DOC_ID.html",
		"searchQuery": 		"/exist/rest/db/archaeo18/queries/search.xq?query=QUERY_ID&mode=xhtml",
		"facetsQuery": 		"/exist/rest/db/archaeo18/queries/getFacets.xq",
		"metadataQuery": 		"/exist/rest/db/archaeo18/queries/getText.xq?mode=header&format=xhtml&doc=DOC_ID",
		"facetTableQuery":	"/exist/rest/db/archaeo18/queries/experimental/listEntities.xq?facet=FACET_ID&format=xhtml",
		"facetTableQuery":	"./testdata/indices/listEntities.xq?facet=FACET_ID&format=xhtml",
		"tagcloudQuery":		"/exist/rest/db/archaeo18/queries/experimental/listEntities.xq?facet=FACET_ID&format=cloud",
		"mapQuery":		"/exist/rest/db/archaeo18/queries/experimental/listEntities.xq?facet=FACET_ID&format=kml",
		"tagcloudPageQuery":	"/exist/rest/db/archaeo18/queries/getText.xq?doc=DOC_ID&page=PAGE_ID&format=cloud&facet=FACET_ID",
		"kmlQuery": 		"/exist/rest/db/archaeo18/queries/getText.xq?format=kml&doc=DOC_ID&page=PAGE_ID",
		"teiUri": 		"content/app/tei/DOC_ID.xml",
		"metsUri": 		"content/app/mets/DOC_ID.mets.xml"
}
