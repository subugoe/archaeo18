<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xd="http://www.oxygenxml.com/ns/doc/xsl"
    xmlns:ropen="http://ropen.sub.uni-goettingen.de/ropen-backend/xslt" xmlns:a18="http://sub.uni-goettingen.de/DB/ENT/projects/archaeo18/xslt" xmlns:TEI="http://www.tei-c.org/ns/1.0"
    exclude-result-prefixes="xs xd" version="2.0">

    <xd:doc scope="stylesheet">
        <xd:desc>
            <xd:p><xd:b>Created on:</xd:b> Nov 18, 2013</xd:p>
            <xd:p><xd:b>Author:</xd:b> cmahnke</xd:p>
            <xd:p/>
        </xd:desc>
    </xd:doc>
    <!-- Name of the document -->
    <xsl:param name="document"/>
    <!-- Guess document name, this uses the document-uri function -->
    <xsl:param name="use-uri" as="xs:boolean" select="true()"/>
    <!-- For one document per page set this to 'page' otherwise a solr doc is generated per document structure, 
        if set to page-and-structure the docs are generated from the structures splitted by pagebreaks. -->
    <xsl:param name="mode" as="xs:string" select="'page'"/>
    <!--  set to 'includetags' to include xml tags to the content field of the index -->
    <xsl:param name="tags" as="xs:string" select="'none'"/>
    <!-- Use this param to handle a whole collection -->
    <xsl:param name="collection" select="''" as="xs:string"/>
    <!-- If a collection is proccesed, where shhould the results go? -->
    <xsl:param name="output" select="''" as="xs:string"/>

    <xsl:output method="xml" indent="yes"/>
    <xsl:strip-space elements="TEI:placeName TEI:persName TEI:addName TEI:bibl TEI:note TEI:head"/>

    <xsl:template match="/">
        <xsl:choose>
            <xsl:when test="not(empty($collection)) and $collection != ''">
                <html xmlns="http://www.w3.org/1999/xhtml">
                    <head>
                        <title>Solr report</title>
                    </head>
                    <body>
                        <table>
                            <thead>
                                <td>Input path</td>
                                <td>Output path</td>
                            </thead>
                            <xsl:for-each select="collection(concat($collection, '/?select=*.xml'))">
                                <xsl:variable name="in-file" select="tokenize(document-uri(.), '/')[last()]" as="xs:string"/>
                                <xsl:variable name="solr-file" select="ropen:concat-path($output, $in-file)" as="xs:anyURI"/>
                                <xsl:message>Generating index file for <xsl:value-of select="$in-file"/> in <xsl:value-of select="$solr-file"/></xsl:message>
                                <xsl:result-document href="{$solr-file}">
                                    <xsl:apply-templates select="document(document-uri(.))//TEI:body"/>
                                </xsl:result-document>
                                <tr>
                                    <td>
                                        <xsl:value-of select="$in-file"/>
                                    </td>
                                    <td>
                                        <xsl:value-of select="$solr-file"/>
                                    </td>
                                </tr>
                            </xsl:for-each>
                        </table>
                    </body>
                </html>
            </xsl:when>
            <xsl:otherwise>
                <xsl:apply-templates/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template match="//TEI:body">
        <add>
            <xsl:choose>
                <xsl:when test="$mode = 'page'">
                    <xsl:comment>page-based document  structure</xsl:comment>
                    <xsl:for-each select="//TEI:pb">
                        <xsl:variable name="pos" select="position()" as="xs:integer"/>
                        <xsl:variable name="page" as="node()*">
                            <xsl:choose>
                                <xsl:when test="position() = 1 ">
                                    <xsl:copy-of select="a18:chunk(./preceding::TEI:milestone[1], ., //TEI:body)"/>   
                                </xsl:when>
                                <xsl:otherwise>
                                    <xsl:copy-of select="a18:chunk(./preceding::TEI:pb[1], ., //TEI:body)"/>   
                                </xsl:otherwise>
                            </xsl:choose>
                        </xsl:variable>
                        
                        <xsl:call-template name="doc">
                            <xsl:with-param name="id"><xsl:value-of select="concat(a18:document-name(.), '-', $pos)" /></xsl:with-param> 
                            <xsl:with-param name="page-nr"><xsl:value-of select="$pos"/></xsl:with-param>
                            <xsl:with-param name="document"><xsl:value-of select="a18:document-name(.)"/></xsl:with-param>
                            <xsl:with-param name="path"><xsl:value-of select="a18:generate-xpath(.., true())"/></xsl:with-param>
                            <xsl:with-param name="depth"><xsl:value-of select="count(../ancestor::*) + 1"/></xsl:with-param>
                            <xsl:with-param name="pageflag">page</xsl:with-param>
                            <xsl:with-param name="node"><xsl:copy-of select="$page"/></xsl:with-param>
                        </xsl:call-template>                      
                    </xsl:for-each>
                   
                   <!-- last page -->
                    <xsl:variable name="pos" as="xs:integer"><xsl:value-of select="count(//TEI:pb)+1" /></xsl:variable> 
                            <xsl:variable name="page" as="node()*">
                                <xsl:copy-of select="a18:chunk((//TEI:pb)[last()], (//TEI:milestone)[last()], //TEI:body)"/>  
                            </xsl:variable>
                            <xsl:call-template name="doc">
                                <xsl:with-param name="id"><xsl:value-of select="concat(a18:document-name((//TEI:pb)[last()]), '-', $pos)" /></xsl:with-param> 
                                <xsl:with-param name="page-nr"><xsl:value-of select="$pos"/></xsl:with-param>
                                <xsl:with-param name="document"><xsl:value-of select="a18:document-name((//TEI:pb)[last()])"/></xsl:with-param>
                                <xsl:with-param name="path"><xsl:value-of select="a18:generate-xpath((//TEI:pb)[last()]/parent::*, true())"/></xsl:with-param> 
                                <xsl:with-param name="depth"><xsl:value-of select="count((//TEI:pb)[last()]/ancestor::*)"/></xsl:with-param>
                                <xsl:with-param name="pageflag">page</xsl:with-param>
                                <xsl:with-param name="node"><xsl:copy-of select="$page"/></xsl:with-param>
                            </xsl:call-template>  
                </xsl:when>
                <xsl:when test="$mode = 'page-and-structure'">
                    <xsl:comment>page- and structure-based document structure</xsl:comment>         
                            <!-- TODO cut div/p at last sub level pb based + div|p ohne children::div|p  mit ./pb-->
                    <xsl:for-each select="//TEI:div|//TEI:p">
                        <xsl:variable name="currentnode" select="."/>
                        <xsl:choose>
                            <xsl:when test="./TEI:pb">
                                <xsl:element name="wrapperel"><xsl:element name="parent" ><xsl:value-of select="$currentnode" />
                                </xsl:element></xsl:element>
                                <xsl:for-each select="./TEI:pb">
                                    <xsl:variable name="pos" select="count(./preceding::TEI:pb) + 1" as="xs:integer"/>
                                    <xsl:variable name="page" as="node()*" select="a18:chunk(wrapperel/parent, ., wrapperel)" />                                 
                                    <xsl:call-template name="doc">
                                        <xsl:with-param name="id"><xsl:value-of select="concat(a18:document-name(.), '-', $pos)" /></xsl:with-param> 
                                        <xsl:with-param name="page-nr"><xsl:value-of select="$pos"/></xsl:with-param>
                                        <xsl:with-param name="document"><xsl:value-of select="a18:document-name(.)"/></xsl:with-param>
                                        <xsl:with-param name="path"><xsl:value-of select="a18:generate-xpath(.., true())"/></xsl:with-param>
                                        <xsl:with-param name="depth"><xsl:value-of select="count(../ancestor::*) + 1"/></xsl:with-param>
                                        <xsl:with-param name="pageflag">page</xsl:with-param>
                                        <xsl:with-param name="node"><xsl:copy-of select="$page"/></xsl:with-param>
                                    </xsl:call-template>                      
                                </xsl:for-each>
                            </xsl:when>
                            <xsl:otherwise>
                                <!-- no page breaks in here -->
                                <xsl:call-template name="doc">
                                    <xsl:with-param name="id"><xsl:value-of select="concat(a18:document-name(.), '-', generate-id(.))" /></xsl:with-param> 
                                    <xsl:with-param name="page-nr"><xsl:value-of select="a18:get-page-nr(.)"/></xsl:with-param>
                                    <xsl:with-param name="document"><xsl:value-of select="a18:document-name(.)"/></xsl:with-param>
                                    <xsl:with-param name="path"><xsl:value-of select="a18:generate-xpath(., true())"/></xsl:with-param>
                                    <xsl:with-param name="depth"><xsl:value-of select="count(./ancestor::*) + 1"/></xsl:with-param>
                                    <xsl:with-param name="node"><xsl:copy-of select="."/></xsl:with-param>
                                </xsl:call-template>
                            </xsl:otherwise>
                        </xsl:choose>
                        
                        <!-- last page in the selected structure -->
                        <xsl:variable name="pos" as="xs:integer"><xsl:value-of select="count((//TEI:pb)[last()]/preceding::TEI:pb) + 1" /></xsl:variable> 
                        <xsl:variable name="page" as="node()*">
                            <xsl:copy-of select="(//TEI:pb)[last()]/following::*"/>
                        </xsl:variable>
                        <xsl:call-template name="doc">
                            <xsl:with-param name="id"><xsl:value-of select="concat(a18:document-name((//TEI:pb)[last()]), '-', $pos)" /></xsl:with-param> 
                            <xsl:with-param name="page-nr"><xsl:value-of select="$pos"/></xsl:with-param>
                            <xsl:with-param name="document"><xsl:value-of select="a18:document-name((//TEI:pb)[last()])"/></xsl:with-param>
                            <xsl:with-param name="path"><xsl:value-of select="a18:generate-xpath((//TEI:pb)[last()]/parent::*, true())"/></xsl:with-param> 
                            <xsl:with-param name="depth"><xsl:value-of select="count((//TEI:pb)[last()]/ancestor::*)"/></xsl:with-param>
                            <xsl:with-param name="node"><xsl:copy-of select="$page"/></xsl:with-param>
                        </xsl:call-template>
                    </xsl:for-each>  <!-- End foreach div/p -->            
                </xsl:when>
                <!-- Structure only mode -->
                <xsl:otherwise>
                <xsl:comment>structure-based document structure</xsl:comment>
                    <xsl:for-each select="//TEI:body//TEI:div|//TEI:body//TEI:p">
                        <xsl:call-template name="doc">
                            <xsl:with-param name="id"><xsl:value-of select="concat(a18:document-name(.), '-', generate-id(.))" /></xsl:with-param> 
                            <xsl:with-param name="page-nr"><xsl:value-of select="a18:get-page-nr(.)"/></xsl:with-param>
                            <xsl:with-param name="document"><xsl:value-of select="a18:document-name(.)"/></xsl:with-param>
                            <xsl:with-param name="path"><xsl:value-of select="a18:generate-xpath(., true())"/></xsl:with-param>
                            <xsl:with-param name="depth"><xsl:value-of select="count(./ancestor::*) + 1"/></xsl:with-param>
                            <xsl:with-param name="pageflag">structure</xsl:with-param>
                            <xsl:with-param name="node"><xsl:copy-of select="."/></xsl:with-param>
                        </xsl:call-template>
                    </xsl:for-each>
                </xsl:otherwise>
            </xsl:choose>
        </add>
    </xsl:template>

    <xsl:template name="doc">
    <xsl:param name="id" />
    <xsl:param name="page-nr" />
    <xsl:param name="document" />
    <xsl:param name="path" />
    <xsl:param name="depth" />
        <xsl:param name="pageflag" />
    <xsl:param name="node" as="node()"/>
    
    <doc>
        <xsl:variable name="id" select="concat(a18:document-name(.), '-', generate-id(.))"/>
        <!-- Metadata -->
        <xsl:comment>Metadata</xsl:comment>
        <field name="id">
            <xsl:value-of select="$id"/>
        </field>
        <field name="page-nr">
            <xsl:value-of select="$page-nr"/>
        </field>
        <field name="document">
            <xsl:value-of select="$document"/>
        </field>
        <field name="path">
            <xsl:value-of select="$path"/>
        </field>
        <field name="depth">
            <xsl:value-of select="$depth"/>
        </field>
        <field name="pageflag">
            <xsl:value-of select="$pageflag"/>
        </field>
        <field name="mode">
            <xsl:value-of select="$mode"/>
        </field>
        
        
        <!-- Entities -->
        <xsl:copy-of select="a18:entity-fields($node)"/>
        <!-- Structure -->
        <xsl:copy-of select="a18:structure-fields($node)"/>
        <!-- Content -->
        <xsl:comment>Content</xsl:comment>
        <field name="content">
            <xsl:choose>
                <xsl:when test="$tags = 'includetags'">
                    <xsl:text disable-output-escaping="yes">&lt;![CDATA[</xsl:text>
                    <xsl:copy-of select="$node"/>
                    <xsl:text disable-output-escaping="yes">]]&gt;</xsl:text>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:variable name="content">
                        <xsl:apply-templates select="$node" mode="filter"/>
                    </xsl:variable>
                    <xsl:value-of select="$content//text()"/>
                </xsl:otherwise>
            </xsl:choose>
        </field>
    </doc>
    
</xsl:template>

    <xsl:template name="doc_strbased">
        <xsl:param name="id"/>
        <xsl:param name="page-nr"/>
        <xsl:param name="document"/>
        <xsl:param name="path"/>
        <xsl:param name="depth"/>
        <xsl:param name="pageflag" />
        <xsl:param name="content" as="xs:string"/>       
        <doc>
            <xsl:variable name="id" select="concat(a18:document-name(.), '-', generate-id(.))"/>
            <!-- Metadata -->
            <xsl:comment>Metadata</xsl:comment>
            <field name="id">
                <xsl:value-of select="$id"/>
            </field>
            <field name="page-nr">
                <xsl:value-of select="$page-nr"/>
            </field>
            <field name="document">
                <xsl:value-of select="$document"/>
            </field>
            <field name="path">
                <xsl:value-of select="$path"/>
            </field>
            <field name="depth">
                <xsl:value-of select="$depth"/>
            </field>
            <field name="mode">
                <xsl:value-of select="$mode"/>
            </field>
            <field name="pageflag">
                <xsl:value-of select="$pageflag"/>
            </field>
            <!-- Entitie Fields -->
            <xsl:copy-of
                select="a18:extract_fieldval($content, '&lt;/?(TEI:)?persName(\s+[a-zA-Z#&quot;:0-9]+)*&gt;', 'persName')"/>
            <xsl:copy-of
                select="a18:extract_fieldval($content, '&lt;/?(TEI:)?placeName(\s+[a-zA-Z#&quot;:0-9]+)*&gt;', 'placeName')"/>
            <xsl:copy-of
                select="a18:extract_fieldval($content, '&lt;/?(TEI:)?term(\s+[a-zA-Z#&quot;:0-9]+)*&gt;', 'term')"/>
            <xsl:copy-of
                select="a18:extract_fieldval($content, '&lt;/?(TEI:)?bibl(\s+[a-zA-Z#&quot;:0-9]+)*&gt;', 'bibl')"/>
            <xsl:copy-of
                select="a18:extract_fieldval($content, '&lt;/?(TEI:)?date(\s+[a-zA-Z#&quot;:0-9]+)*&gt;', 'date')"/>
            
            <!-- Structure Fields hi note head-->
            <xsl:copy-of
                select="a18:extract_fieldval($content, '&lt;/?(TEI:)?head(\s+[a-zA-Z#&quot;:0-9]+)*&gt;', 'head')"/>       
            <xsl:copy-of
                select="a18:extract_fieldval($content, '&lt;/?(TEI:)?note(\s+[a-zA-Z#&quot;:0-9]+)*&gt;', 'note')"/>
            <xsl:copy-of
                select="a18:extract_fieldval($content, '&lt;/?(TEI:)?hi(\s+[a-zA-Z#&quot;:0-9]+)*&gt;', 'hi')"/>
            
            <!-- <xsl:value-of select="tokenize($str_all, '&lt;*pb')[1]" />-->
            <field name="content">
                <xsl:choose>
                    <xsl:when test="$tags = 'includetags'">
                        <xsl:text disable-output-escaping="yes">&lt;![CDATA[</xsl:text>
                        <xsl:value-of select="$content"/>
                        <xsl:text disable-output-escaping="yes">]]&gt;</xsl:text>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:value-of select="replace($content, '(&lt;(/?)\w+(:?)\w+(/?)&gt;)', '')"
                        />
                    </xsl:otherwise>
                </xsl:choose>
            </field>
        </doc>      
    </xsl:template>
    
    <xsl:template match="TEI:addName" mode="filter" priority="1"/>
    <xsl:template match="TEI:*" mode="filter">
        <xsl:apply-templates mode="filter"/>
    </xsl:template>

    <xsl:template match="text()" mode="filter">
        <xsl:value-of select="."/>
    </xsl:template>
    <xsl:template match="text()"/>

    <xsl:template match="comment()" mode="filter"/>
    <!-- Functions -->
    <xsl:function name="a18:normalize-space" as="xs:string">
        <xsl:param name="text" as="text()*"/>
        <xsl:choose>
            <xsl:when test="count($text) &gt; 1">
                <xsl:value-of select="replace(replace(string-join($text, ''), '-\s*\n\s*', ''), '\s+', ' ')"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:variable name="tokens" select="tokenize($text, '-\s*\n')"/>
                <xsl:value-of select="replace(string-join($tokens, ' '), '\s+', ' ')"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:function>

    <!-- Get file name of a node -->
    <xsl:function name="a18:document-name" as="xs:string">
        <xsl:param name="node" as="node()"/>
        <xsl:choose>
            <xsl:when test="document-uri(root($node)) != ''">
                <xsl:variable name="input-file-name" select="replace(document-uri(root($node)), '^.*/(.*)$', '$1')" as="xs:string"/>
                <xsl:value-of select="replace($input-file-name, '^(.*?)\.[^.]*$', '$1')"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="''"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:function>

    <!--    <xsl:function name="a18:document-name">
        <xsl:param name="node" as="node()"></xsl:param>
        <xsl:choose>
            <xsl:when test="$use-uri">
                <xsl:value-of select="document-uri($node)"></xsl:value-of>
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="$document"></xsl:value-of>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:function>i -->
    <xsl:function name="a18:add-whitespace" as="text()*">
        <xsl:param name="text" as="text()*"/>
        <xsl:for-each select="$text">
            <xsl:choose>
                <xsl:when test="not(matches(., '\s'))">
                    <xsl:value-of select="concat(' ', ., ' ')"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="."/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:for-each>

    </xsl:function>
    <xsl:function name="a18:field" as="element(field)">
        <xsl:param name="name" as="xs:string"/>
        <xsl:param name="text" as="xs:string"/>
        <xsl:if test="matches($text, '\w-\n\s*\w')">
            <xsl:variable name="text-without-hyphen" select="replace($text, '(.*?\w*)-\n\s*(\w*.*)', '$1$2')"/>
            <field name="{$name}">
                <xsl:value-of select="$text-without-hyphen"/>
            </field>
        </xsl:if>
        <field name="{$name}">
            <xsl:value-of select="normalize-space($text)"/>
        </field>
    </xsl:function>
    <xsl:function name="a18:apply-templates-filter">
        <xsl:param name="seq"/>
        <xsl:apply-templates mode="filter" select="$seq"/>
    </xsl:function>
    <xsl:function name="a18:generate-xpath">
        <xsl:param name="node" as="node()"/>
        <xsl:param name="numbers" as="xs:boolean"/>
        <xsl:choose>
            <xsl:when test="$numbers">
                <xsl:for-each select="$node/ancestor::*">
                    <xsl:value-of select="name()"/>
                    <xsl:variable name="parent" select="."/>
                    <xsl:variable name="siblings" select="count(preceding-sibling::*[name()=name($parent)])"/>
                    <xsl:if test="$siblings">
                        <xsl:value-of select="concat('[', $siblings + 1, ']')"/>
                    </xsl:if>
                    <xsl:value-of select="'/'"/>
                </xsl:for-each>
                <xsl:value-of select="name($node)"/>
                <xsl:variable name="siblings" select="count($node/preceding-sibling::*[name()=name($node)])"/>
                <xsl:if test="$siblings">
                    <xsl:value-of select="concat('[', $siblings + 1, ']')"/>
                </xsl:if>
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="$node/ancestor::*/name()" separator="/"/>
                <xsl:value-of select="concat('/', name($node))"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:function>

    <xsl:function name="a18:get-page-nr" as="xs:string">
        <xsl:param name="node" as="node()"/>
        <xsl:choose>
            <!-- First page -->
            <xsl:when test="not($node/preceding::TEI:pb)">
                <xsl:value-of select="1"/>
            </xsl:when>
            <!-- No numbers -->
            <xsl:otherwise>
                <!--             <xsl:when test="not($node/preceding::TEI:pb[1]/@n)"> -->
                <!-- not +1 because of the pb0-Element -->
                <xsl:value-of select="count($node/preceding::TEI:pb)+1"/>
                <!-- </xsl:when> -->
                <!-- <xsl:otherwise>     stimmt nicht immer mit der sum preceding::TEI:pb ueberein
                <xsl:value-of select="$node/preceding::TEI:pb[1]/@n"></xsl:value-of> -->
            </xsl:otherwise>
        </xsl:choose>
    </xsl:function>

    <xsl:function name="a18:chunk">
        <xsl:param name="ms1" as="element()"/>
        <xsl:param name="ms2" as="element()"/>
        <xsl:param name="node" as="node()"/>
        <xsl:choose>
            <xsl:when test="$node instance of element()">
                <xsl:choose>
                    <xsl:when test="$node is $ms1">
                        <xsl:copy-of select="$node"/>
                    </xsl:when>
                    <xsl:when test="some $n in $node/descendant::* satisfies ($n is $ms1 or $n is $ms2)">
                        <xsl:element name="{local-name($node)}" namespace="{namespace-uri($node)}">
                            <xsl:for-each select="$node/node() | $node/@*">
                                <xsl:copy-of select="a18:chunk($ms1, $ms2, .)"/>
                            </xsl:for-each>
                        </xsl:element>
                    </xsl:when>
                    <xsl:when test="$node &gt;&gt; $ms1 and $node &lt;&lt; $ms2">
                        <xsl:copy-of select="$node"/>
                    </xsl:when>
                </xsl:choose>
            </xsl:when>
            <xsl:when test="$node instance of attribute()">
                <xsl:copy-of select="$node"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:if test="$node &gt;&gt; $ms1 and $node &lt;&lt; $ms2">
                    <xsl:copy-of select="$node"/>
                </xsl:if>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:function>

    <xsl:function name="a18:entity-fields" as="node()*">
        <xsl:param name="entnode"/>
        <xsl:comment>entities</xsl:comment>
        <xsl:for-each select="$entnode//TEI:placeName">
            <xsl:variable name="content" select="a18:apply-templates-filter(.)"/>
            <xsl:copy-of select="a18:field('placeName', a18:normalize-space($content))"/>
        </xsl:for-each>
        <!-- <xsl:for-each select="$node//TEI:placeName//TEI:addName">
            <field name="place-variant">
                <xsl:apply-templates mode="filter"/>
            </field>
        </xsl:for-each>-->
        <xsl:for-each select="$entnode//TEI:persName">
            <xsl:variable name="content" select="a18:apply-templates-filter(.)"/>
            <xsl:copy-of select="a18:field('persName', a18:normalize-space($content))"/>
        </xsl:for-each>
        <!-- <xsl:for-each select="$node//TEI:persName//TEI:addName">
            <field name="person-variant">
                <xsl:apply-templates mode="filter"/>
            </field> 
        </xsl:for-each> -->
        <xsl:for-each select="$entnode//TEI:term">
            <xsl:variable name="content" select="a18:apply-templates-filter(.)"/>
            <xsl:copy-of select="a18:field('term', a18:normalize-space($content))"/>
        </xsl:for-each>
        <xsl:for-each select="$entnode//TEI:bibl">
            <xsl:variable name="content" select="a18:apply-templates-filter(.)"/>
            <xsl:copy-of select="a18:field('bibl', a18:normalize-space($content))"/>
        </xsl:for-each>
        <xsl:for-each select="$entnode//TEI:date">
            <xsl:variable name="content" select="a18:apply-templates-filter(.)"/>
            <xsl:copy-of select="a18:field('date', a18:normalize-space($content))"/>
        </xsl:for-each>

    </xsl:function>

    <!-- recursivively extracts all values of $pattern from str -->
    <xsl:function name="a18:extract_fieldval">
        <xsl:param name="str"/>
        <xsl:param name="pattern"/>
        <xsl:param name="fieldname"/>
        <xsl:choose>
            <xsl:when test="count(tokenize($str, $pattern))>1">
                <xsl:element name="field">
                    <xsl:attribute name="name">
                        <xsl:value-of select="$fieldname"/>
                    </xsl:attribute>
                    <xsl:value-of select="replace(tokenize($str, $pattern)[2], '(&lt;(/?)\w+(:?)\w+(\s+[a-zA-Z#&quot;:0-9]+)*(/?)&gt;)', '')"/>
                </xsl:element>
            </xsl:when>
        </xsl:choose>
        <xsl:choose>
            <xsl:when test="count(tokenize($str, $pattern))>2">
                <xsl:copy-of
                    select="a18:extract_fieldval(string-join(tokenize($str, $pattern)[position()>2], '=='), '==', $fieldname)"
                />
            </xsl:when>
        </xsl:choose>
    </xsl:function>
    <xsl:function name="a18:structure-fields" as="node()*">
        <xsl:param name="node" as="node()*"/>
        <!-- Document structure -->
        <xsl:comment>Document structure</xsl:comment>
        <xsl:for-each select="$node//TEI:head">
            <xsl:variable name="content" select="a18:add-whitespace(a18:apply-templates-filter(.))"/>
            <xsl:copy-of select="a18:field('head', a18:normalize-space($content))"/>
        </xsl:for-each>
        <xsl:for-each select="$node//TEI:note">
            <xsl:variable name="content" select="a18:add-whitespace(a18:apply-templates-filter(.))"/>
            <xsl:copy-of select="a18:field('note', a18:normalize-space($content))"/>
        </xsl:for-each>
        <xsl:for-each select="$node//TEI:hi">
            <xsl:variable name="content" select="a18:add-whitespace(a18:apply-templates-filter(.))"/>
            <xsl:copy-of select="a18:field('hi', a18:normalize-space($content))"/>
        </xsl:for-each>
    </xsl:function>

    <!-- 
        TODO: Move some functions to a library
    -->

    <xsl:function name="ropen:concat-path" as="xs:anyURI">
        <xsl:param name="path" as="xs:string"/>
        <xsl:param name="filename" as="xs:string"/>
        <xsl:choose>
            <xsl:when test="ends-with($path, '/') or starts-with($filename, '/')">
                <xsl:value-of select="concat($path, $filename)"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="concat($path, '/', $filename)"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:function>

</xsl:stylesheet>
