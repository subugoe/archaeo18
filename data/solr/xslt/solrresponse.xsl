<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xd="http://www.oxygenxml.com/ns/doc/xsl"
    xmlns:a18="http://sub.uni-goettingen.de/DB/ENT/projects/archaeo18/xslt"
    xmlns:TEI="http://www.tei-c.org/ns/1.0" exclude-result-prefixes="xs xd" version="2.0">

    <xsl:output method="xml" indent="yes" version="1.0"/>
    <xsl:template match="text()"/>

    <!-- only for structure based information -->
    <xsl:variable name="resultarray" select="//result/doc"/>
    <xsl:variable name="hlarray" select="//lst[@name='highlighting']/lst"/>

    <xsl:template match="/response">
        <html xmlns:gn="http://www.geonames.org/ontology#" xmlns:TEI="http://www.tei-c.org/ns/1.0"
            xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:xs="http://www.w3.org/2001/XMLSchema"
            xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:foaf="http://xmlns.com/foaf/0.1/"
            xmlns:bibo="http://purl.org/ontology/bibo/1.3/" xmlns="http://www.w3.org/1999/xhtml"
            xmlns:exist="http://exist.sourceforge.net/NS/exist"
            xmlns:html="http://www.w3.org/1999/xhtml" version="XHTML+RDFa 1.0"
            type="bibo:Manuscript">
            <meta http-equiv="content-type" content="text/html; charset=UTF-8"/>
            <meta charset="UTF-8"/>
            <body>

                <results>
                    <xsl:for-each-group select="result/doc" group-by="str[@name='document']">
                        <!-- <xsl:value-of select="str[@name='document']"/>
            <xsl:text>    
            </xsl:text> -->
                        <xsl:variable name="sequence" as="element(doc)+">
                            <xsl:perform-sort select="current-group()">
                                <xsl:sort select="str[@name='path']" order="ascending"/>
                            </xsl:perform-sort>
                        </xsl:variable>

                        <xsl:for-each select="current-group()">
                            <!--                 <xsl:sort select="str[@name='path']" data-type="text" order="ascending" />  -->
                            <xsl:variable name="next" select="position()+1"/>
                            <xsl:choose>
                                <xsl:when
                                    test="not(contains($sequence[$next]/str[@name='path'], ./str[@name='path']))">
                                    <result>
                                        <!-- <xsl:apply-templates  select="."/> -->
                                        <xsl:call-template name="doc">
                                            <xsl:with-param name="pos">
                                                <xsl:value-of select="index-of($resultarray,.)"/>
                                            </xsl:with-param>
                                        </xsl:call-template>
                                    </result>
                                </xsl:when>
                            </xsl:choose>
                        </xsl:for-each>
                    </xsl:for-each-group>
                </results>
            </body>
        </html>
    </xsl:template>


    <!-- <xsl:template match="doc" >       -->
    <xsl:template name="doc">
        <xsl:param name="pos"/>
        <xsl:text>   </xsl:text>
        <doc>
            <xsl:value-of select="./str[@name='document']"/>
        </doc>
        <xsl:text>    
                            </xsl:text>

        <!-- debug -->
        <!-- <xsl:text>    </xsl:text>
        <xsl:value-of select="./str[@name='path']"/>
        <xsl:text>   </xsl:text> -->
        <page>
            <xsl:value-of select="./str[@name='page-nr']"/>
        </page>
        <xsl:text>    
                            </xsl:text>
        <!-- <xsl:value-of select="./str[@name='content']"/> -->
        <!-- content of the highlight vector  eq result/str[@name=content] if hl.fragsize=0 -->
        <fragment>
            <body xmlns="http://www.w3.org/1999/xhtml">
                <p>
                    <xsl:value-of select="$hlarray[number($pos)]/*"/>
                </p>
            </body>
        </fragment>
        <xsl:text>              
 
           </xsl:text>

    </xsl:template>

</xsl:stylesheet>