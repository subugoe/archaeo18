<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xd="http://www.oxygenxml.com/ns/doc/xsl"
    xmlns:a18="http://sub.uni-goettingen.de/DB/ENT/projects/archaeo18/xslt" xmlns:TEI="http://www.tei-c.org/ns/1.0" exclude-result-prefixes="xs xd" version="2.0">
    
  <xsl:output method="xml" indent="yes" version="1.0"/>
   <xsl:template match="text()"/>    
 
<!-- <xsl:key name="neref" match="TEI:*[@ref]" use="a18:normalize-space(a18:filter-addName(.))"/>-->
  <!--   <xsl:template match="//TEI:*[@ref]">
<xsl:apply-templates select=".[generate-id()=generate-id(key('neref', a18:normalize-space(a18:filter-addName(.)))[1])]"/> 
  <xsl:apply-templates select="." />
</xsl:template> -->
  
<xsl:template match='//TEI:persName[@ref] | //TEI:placeName[@ref]' >
     <xsl:variable name="content" select="a18:apply-templates-filter(a18:filter-addName(self::node()))"/>
     <xsl:value-of select="a18:normalize-space($content)" />
     <xsl:for-each select="distinct-values(./TEI:addName)">
       <xsl:text>, </xsl:text>
       <xsl:value-of select="replace(., ',', '')"/>
     </xsl:for-each>
     <xsl:text>
     </xsl:text>  
   </xsl:template>
  
   
  <xsl:function name="a18:filter-addName" as="node()*">
      <xsl:param name="nodes" as="node()*"/>
      <xsl:for-each select="$nodes/node()">
         <xsl:choose>
            <xsl:when test=". instance of element(TEI:addName)"/>
             <xsl:otherwise>
               <!--<xsl:copy-of select="." /> -->
              <xsl:copy>
                  <xsl:for-each select="@*">
                   <xsl:copy/>
                  </xsl:for-each>
                 <xsl:copy-of select="a18:filter-addName(.)"/>
              </xsl:copy>
            </xsl:otherwise>
          </xsl:choose>
      </xsl:for-each>
   </xsl:function>
  
  <xsl:function name="a18:apply-templates-filter">
    <xsl:param name="seq"/>
    <xsl:apply-templates mode="filter" select="$seq"/>
  </xsl:function>
  
  <xsl:function name="a18:normalize-space" as="xs:string">
    <xsl:param name="text" as="text()*"/>
    <xsl:choose>
      <xsl:when test="count($text) &gt; 1">
        <xsl:value-of select="replace(replace(string-join($text, ''),
          ',-\s*\n\s*', ''), '\s+', ' ')"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:variable name="tokens" select="tokenize($text, '-\s*\n')"/>
        <xsl:value-of select="replace(string-join($tokens, ' '), '\s+', ' ')"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:function> 
    
</xsl:stylesheet>