<?xml version="1.0" encoding="UTF-8"?>
    <xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xd="http://www.oxygenxml.com/ns/doc/xsl"
        xmlns:a18="http://sub.uni-goettingen.de/DB/ENT/projects/archaeo18/xslt" xmlns:TEI="http://www.tei-c.org/ns/1.0" exclude-result-prefixes="xs xd" version="2.0">
        
     <xsl:output method="xml" indent="yes" version="1.0"/>
   <xsl:template match="text()"/>  
    
    
    
    <xsl:template match="/response">
        <xsl:for-each-group select="result/doc" group-by="str[@name='document']">
            <xsl:value-of select="str[@name='document']" />
            <xsl:text>    
            </xsl:text>
            <xsl:variable name="sequence" as="element(doc)+" >
                <xsl:perform-sort select="current-group()">
                    <xsl:sort select="str[@name='path']" order="ascending"/>
                    </xsl:perform-sort>
            </xsl:variable>
            <xsl:for-each select="current-group()">
                <xsl:sort select="str[@name='path']" data-type="text" order="ascending" />  
                <xsl:variable name="next" select="position()+1" />      
                <xsl:choose>
                    <xsl:when test="not(contains($sequence[$next]/str[@name='path'], ./str[@name='path']))" >
                      <xsl:apply-templates  select="."/>
                    </xsl:when>
                </xsl:choose>
            </xsl:for-each>  
        </xsl:for-each-group>
    </xsl:template>
        

         <xsl:template match="doc">        
                        <xsl:text>    </xsl:text>
                        <xsl:value-of select="./str[@name='path']"/>
                        <xsl:text>    </xsl:text>
                        <xsl:value-of select="./str[@name='page-nr']"/>
                      <xsl:text>    
                            </xsl:text>                        
             <!-- <xsl:value-of select="./str[@name='content']"/>
                       
                        <xsl:text>    
                       
           </xsl:text>-->
    </xsl:template>
                            






        
    
</xsl:stylesheet>