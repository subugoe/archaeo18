{
		"hyperlinkWindow":	false,
		"documentEndpoint": 	"content/app/list-docs.xml",
		"textQuery": 		"/exist/rest/db/archaeo18/queries/getText.xq?mode=raw&format=xhtml&doc=DOC_ID&page=0",
		"pageQuery": 		"/exist/rest/db/archaeo18/queries/getText.xq?mode=raw&format=xhtml&doc=DOC_ID&page=PAGE_ID",
		"outlineQuery": 		"content/app/structure/DOC_ID.xml",
		"searchQuery": 		"/exist/rest/db/archaeo18/queries/search.xq?query=QUERY_ID&mode=xhtml",
		"facetsQuery": 		"content/app/facets.xml",
		"metadataQuery": 		"/exist/rest/db/archaeo18/queries/getText.xq?mode=header&format=xhtml&doc=DOC_ID",
		"facetTableQuery":	"content/app/indices/FACET_ID.xhtml",
		"tagcloudQuery":		"./testdata/cloud/listEntities.xq?facet=FACET_ID&format=cloud",
		"mapQuery":		"./testdata/kml/listEntities.xq?facet=FACET_ID&format=kml",
		"tagcloudPageQuery":	"/exist/rest/db/archaeo18/queries/getText.xq?doc=DOC_ID&page=PAGE_ID&format=cloud&facet=FACET_ID",
		"kmlQuery": 		"/exist/rest/db/archaeo18/queries/getText.xq?format=kml&doc=DOC_ID&page=PAGE_ID",
		"teiUri": 		"content/app/tei/DOC_ID.xml",
		"metsUri": 		"content/app/mets/DOC_ID.mets.xml"
}
