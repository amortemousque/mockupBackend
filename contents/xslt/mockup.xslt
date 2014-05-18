<?xml version="1.0"?>

<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">
  <html>
    <head>
        <style>
          ul {
            position: absolute;
            width: 100%;
            list-style: none;
            margin:0px;
            padding: 0px;
          }
          ul li {
            list-style: none;
            margin:0px;
            padding: 0px;
          }

          .canvas.canvas-main {
              width:100%;
              height:600px;
          }

          .layer {
              position: absolute;
              display:block;
              width:100%;
              height:600px;
          }

          .elem {
            color: #fff;
            position: absolute;
            z-index: 10;
            cursor: pointer;
          }
        </style>
    </head>
    <body>
      <div class="canvas canvas-main">
        <ul>
          <xsl:for-each select="mockup/layers">
            <li class="layer">
              <xsl:choose>
                <xsl:when test="type='text'">
                  <p class="elem">
                    <xsl:attribute name="style">
                      <xsl:value-of select="style"/>
                    </xsl:attribute>
                    <xsl:value-of select="content"/>
                  </p>
                </xsl:when>
                <xsl:when test="type='image'">
                  <img class="elem">
                    <xsl:attribute name="src">
                      <xsl:value-of select="content"/>
                    </xsl:attribute>
                    <xsl:attribute name="style">
                      <xsl:value-of select="style"/>
                    </xsl:attribute>
                  </img>
                </xsl:when>
                <xsl:otherwise>
                  <div class="elem">
                    <xsl:attribute name="style">
                      <xsl:value-of select="style"/>
                    </xsl:attribute>
                  </div>
                </xsl:otherwise>
              </xsl:choose>
            </li>
          </xsl:for-each>
        </ul>
      </div>
    </body>
  </html>
</xsl:template>

</xsl:stylesheet>