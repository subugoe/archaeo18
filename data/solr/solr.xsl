<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xd="http://www.oxygenxml.com/ns/doc/xsl"
    xmlns:a18="http://sub.uni-goettingen.de/DB/ENT/projects/archaeo18/xslt" xmlns:TEI="http://www.tei-c.org/ns/1.0" exclude-result-prefixes="xs xd" version="2.0">
    <xd:doc scope="stylesheet">
        <xd:desc>
            <xd:p><xd:b>Created on:</xd:b> Nov 18, 2013</xd:p>
            <xd:p><xd:b>Author:</xd:b> cmahnke</xd:p>
            <xd:p/>
        </xd:desc>
    </xd:doc>
    <!-- Name of the document -->
    <xsl:param name="document" as="xs:string"/>
    <!-- Guess document name, this uses the document-uri function -->
    <xsl:param name="use-uri" as="xs:boolean" select="true()"></xsl:param>
    <!-- For one document per page set this to 'page' otherwise a solr doc is generated per document structure -->
    <xsl:param name="mode" as="xs:string" select="'structure'"/>
    <!-- This only works for text nodes: cdata-section-elements="field" -->
    <xsl:output method="xml" indent="yes"/>
    <xsl:strip-space elements="TEI:placeName TEI:persName TEI:addName TEI:bibl TEI:note TEI:head"/>
    <xsl:template match="//TEI:body">
        <add>
            <xsl:choose>
                <xsl:when test="$mode = 'page'">
                    <xsl:for-each select="//TEI:pb">
                        <xsl:variable name="pos" select="position()" as="xs:integer"/>
                        <xsl:variable name="page" as="node()*">
                            <xsl:choose>
                                <xsl:when test="position() = 1">
                                    <xsl:copy-of select="a18:chunk(./ancestor::TEI:body/child::*[1], ., //TEI:body)"/>
                                </xsl:when>
                                <xsl:when test="position() = last()">
                                    <xsl:copy-of select="./following::*"/>
                                </xsl:when>
                                <xsl:otherwise>
                                    <xsl:copy-of select="a18:chunk(./preceding::TEI:pb[1], ., //TEI:body)"/>
                                </xsl:otherwise>
                            </xsl:choose>
                        </xsl:variable>
                        <doc>
                            <!-- Metadata -->
                            <xsl:comment>Metadata</xsl:comment>
                            <field name="id">
                                <xsl:value-of select="concat(a18:document-name(.), '-', $pos)"/>
                            </field>
                            <field name="page-nr">
                                <xsl:value-of select="$pos"/>
                            </field>
                            <field name="document">
                                <xsl:value-of select="a18:document-name(.)"/>
                            </field>
                            <!-- TODO: check line breaks -->
                            <!-- Entities -->
                            <xsl:copy-of select="a18:entity-fields($page)"/>
                            <!-- Document structure -->
                            <xsl:copy-of select="a18:structure-fields($page)"/>
                            <!-- Content -->
                            <xsl:comment>Content</xsl:comment>
                            <field name="content">
                                <xsl:text disable-output-escaping="yes">&lt;![CDATA[</xsl:text>
                                <xsl:copy-of select="$page"/>
                                <xsl:text disable-output-escaping="yes">]]&gt;</xsl:text>
                            </field>
                        </doc>
                    </xsl:for-each>
                </xsl:when>
                <!-- Structure mode -->
                <xsl:otherwise>
                    <xsl:for-each select="//TEI:div|TEI:p">
                        <!-- TODO: check if there are page breaks in here an generate a <doc/> for each page -->
                        <doc>
                            <xsl:variable name="id" select="concat(a18:document-name(.), '-', generate-id(.))"/>
                            <!-- Metadata -->
                            <xsl:comment>Metadata</xsl:comment>
                            <field name="id">
                                <xsl:value-of select="$id"/>
                            </field>
                            <field name="page-nr">
                                <xsl:value-of select="a18:get-page-nr(.)"/>
                            </field>
                            <field name="document">
                                <xsl:value-of select="a18:document-name(.)"/>
                            </field>
                            <field name="path">
                                <xsl:value-of select="a18:generate-xpath(., true())"/>
                            </field>
                            <field name="depth">
                                <xsl:value-of select="count(./ancestor::*) + 1"/>
                            </field>

                            <!-- Entities -->
                            <xsl:copy-of select="a18:entity-fields(.)"/>
                            <!-- Structure -->
                            <xsl:copy-of select="a18:structure-fields(.)"/>
                            <!-- Content -->
                            <xsl:comment>Content</xsl:comment>
                            <field name="content">
                                <xsl:text disable-output-escaping="yes">&lt;![CDATA[</xsl:text>
                                <xsl:copy-of select="."/>
                                <xsl:text disable-output-escaping="yes">]]&gt;</xsl:text>
 
                            </field>
                        </doc>
                    </xsl:for-each>
                </xsl:otherwise>
            </xsl:choose>
        </add>
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
                    <xsl:variable name="parent" select="."></xsl:variable>
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
        <xsl:param name="node" as="node()"></xsl:param>
        <xsl:choose>
            <!-- First page -->
            <xsl:when test="not($node/preceding::TEI:pb)">
                <xsl:value-of select="1"></xsl:value-of>
            </xsl:when>
            <!-- No numbers -->
            <xsl:when test="not($node/preceding::TEI:pb[1]/@n)">
                <xsl:value-of select="count($node/preceding::TEI:pb) + 1"></xsl:value-of>
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="$node/preceding::TEI:pb[1]/@n"></xsl:value-of>
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
        <xsl:param name="node" as="node()*"/>
        <xsl:comment>entities</xsl:comment>
        <xsl:for-each select="$node//TEI:placeName">
            <xsl:variable name="content" select="a18:apply-templates-filter(.)"/>
            <xsl:copy-of select="a18:field('place', a18:normalize-space($content))"/>
        </xsl:for-each>
        <xsl:for-each select="$node//TEI:placeName//TEI:addName">
            <field name="place-variant">
                <xsl:apply-templates mode="filter"/>
            </field>
        </xsl:for-each>
        <xsl:for-each select="$node//TEI:persName">
            <xsl:variable name="content" select="a18:apply-templates-filter(.)"/>
            <xsl:copy-of select="a18:field('person', a18:normalize-space($content))"/>
        </xsl:for-each>
        <xsl:for-each select="$node//TEI:persName//TEI:addName">
            <field name="person-variant">
                <xsl:apply-templates mode="filter"/>
            </field>
        </xsl:for-each>
        <xsl:for-each select="$node//TEI:term">
            <xsl:variable name="content" select="a18:apply-templates-filter(.)"/>
            <xsl:copy-of select="a18:field('term', a18:normalize-space($content))"/>
        </xsl:for-each>
        <xsl:for-each select="$node//TEI:bibl">
            <xsl:variable name="content" select="a18:apply-templates-filter(.)"/>
            <xsl:copy-of select="a18:field('bibl', a18:normalize-space($content))"/>
        </xsl:for-each>
        <xsl:for-each select="$node//TEI:date">
            <xsl:variable name="content" select="a18:apply-templates-filter(.)"/>
            <xsl:copy-of select="a18:field('date', a18:normalize-space($content))"/>
        </xsl:for-each>

    </xsl:function>

    <xsl:function name="a18:structure-fields" as="node()*">
        <xsl:param name="node" as="node()*"/>
        <!-- Document structure -->
        <xsl:comment>Document structure</xsl:comment>
        <xsl:for-each select="$node//TEI:head">
            <xsl:variable name="content" select="a18:add-whitespace(a18:apply-templates-filter(.))"/>
            <xsl:copy-of select="a18:field('heading', a18:normalize-space($content))"/>
        </xsl:for-each>
        <xsl:for-each select="$node//TEI:note">
            <xsl:variable name="content" select="a18:add-whitespace(a18:apply-templates-filter(.))"/>
            <xsl:copy-of select="a18:field('note', a18:normalize-space($content))"/>
        </xsl:for-each>
        <xsl:for-each select="$node//TEI:hi">
            <xsl:variable name="content" select="a18:add-whitespace(a18:apply-templates-filter(.))"/>
            <xsl:copy-of select="a18:field('highlighted', a18:normalize-space($content))"/>
        </xsl:for-each>

    </xsl:function>

</xsl:stylesheet>
