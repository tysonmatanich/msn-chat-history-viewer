<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:variable name="RootLogonName" select="//Log/@LogonName" />
  <xsl:variable name="RootFrom" select="//Log/@From" />
  <xsl:variable name="RootTo" select="//Log/@To" />

  <xsl:template match="//Log">
    <div class="subject">
      <div>
        <span data-text="To:"></span>
        <strong class="friendly-name"><xsl:value-of select="Message/From/User[@LogonName=$RootLogonName]/@FriendlyName" /></strong>
        <span class="logon-address">
          <span data-text="{$RootLogonName}"></span>
        </span>
      </div>
    </div>
    <div class="history">
      <div class="msn_log" data-to="{$RootTo}" data-from="{$RootFrom}">
        <xsl:apply-templates />
      </div>
    </div>
  </xsl:template>

  <xsl:template match="Message">
    <xsl:variable name="Time">
      <xsl:choose>
        <xsl:when test="contains(@Time, ' ')">
          <xsl:variable name="TimeStart" select="substring-before(@Time, ' ')" />
          <xsl:variable name="TimeEnd" select="substring-after(@Time, ' ')" />
          <xsl:value-of select="concat(substring($TimeStart, 1, string-length($TimeStart) - 3), ' ', $TimeEnd)" />
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="substring(@Time, 1, string-length(@Time) - 3)" />
        </xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    <xsl:variable name="FromLogonName" select="From/User/@LogonName" />
    <xsl:variable name="IsSelf" select="$RootLogonName = $FromLogonName" />
    <div class="msn_message is-self-{$IsSelf}" data-session="{@SessionID}">
      <div class="msn_message_header">
        <div class="msn_user">
          <div class="custom-name is-from-{not($IsSelf) and $FromLogonName != ''} is-to-{$IsSelf}">
            <xsl:choose>
              <xsl:when test="$IsSelf">
                <xsl:value-of select="$RootTo" />
              </xsl:when>
              <xsl:when test="not($IsSelf) and $FromLogonName != ''">
                <xsl:value-of select="$RootFrom" />
              </xsl:when>
              <xsl:otherwise>
                <xsl:value-of select="'missing logon'" />
              </xsl:otherwise>
            </xsl:choose>
          </div>
          <div class="friendly-name">
            <xsl:value-of select="From/User/@FriendlyName" />
          </div>
          <div class="logon-name has-logon-{$FromLogonName != ''}">
            <xsl:choose>
              <xsl:when test="$FromLogonName != ''">
                <xsl:value-of select="$FromLogonName" />
              </xsl:when>
              <xsl:otherwise>
                <xsl:value-of select="'missing logon'" />
              </xsl:otherwise>
            </xsl:choose>
          </div>
        </div>
        <div class="msn_date_time" data-date="{@Date}" data-time="{$Time}">
          <span class="msn_date"><xsl:value-of select="@Date" /></span>
          <span> @ </span>
          <span class="msn_time"><xsl:value-of select="$Time"/></span>
        </div>
      </div>
      <p class="msn_message_text" style="{Text/@Style}"><xsl:value-of select="Text" /></p>
    </div>
  </xsl:template>

  <xsl:template match="Invitation | InvitationResponse">
    <div class="msn_invitation">
      <p class="msn_message_text" style="{Text/@Style}"><xsl:value-of select="Text" /></p>
    </div>
  </xsl:template>

  <xsl:template match="notes">
    <pre class="txt_notes"><xsl:value-of select="." /></pre>
  </xsl:template>

  <xsl:template match="filenotes">
    <div class="file_notes">
      <div><xsl:value-of select="notes" /></div>
      <div><xsl:value-of select="daterange" /></div>
    </div>
  </xsl:template>
</xsl:stylesheet>
