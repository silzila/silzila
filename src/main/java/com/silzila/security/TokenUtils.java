package com.silzila.security;

import com.silzila.model.security.SecurityUser;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.SecretKey;

@Component
public class TokenUtils {

  private final String AUDIENCE_UNKNOWN = "unknown";
  private final String AUDIENCE_WEB = "web";
  private final String AUDIENCE_MOBILE = "mobile";
  private final String AUDIENCE_TABLET = "tablet";

  @Value("${jwtSecret}")
  private String secret;

  @Value("${jwtExpirationMs}")
  private Long expirationTimeAccess;

  public String getUsernameFromToken(String token) {
    String username;
    try {
      final Claims claims = this.getClaimsFromToken(token);
      username = claims.getSubject();
    } catch (Exception e) {
      username = null;
    }
    return username;
  }

  public Date getCreatedDateFromToken(String token) {
    Date createdDate;
    try {
        final Claims claims = getClaimsFromToken(token);
        Long iat = claims.get("iat", Long.class);
        if (iat != null) {
            createdDate = new Date(iat * 1000);
        } else {
            createdDate = null;
        }
    } catch (Exception e) {
        createdDate = null;
    }
    return createdDate;
  }

  public Date getExpirationDateFromToken(String token) {
    Date expiration;
    try {
      final Claims claims = this.getClaimsFromToken(token);
      expiration = claims.getExpiration();
    } catch (Exception e) {
      expiration = null;
    }
    return expiration;
  }

  public String getAudienceFromToken(String token) {
    String audience;
    try {
      final Claims claims = this.getClaimsFromToken(token);
      audience = (String) claims.get("audience");
    } catch (Exception e) {
      audience = null;
    }
    return audience;
  }

  private SecretKey getSecKey() {
    // byte[] keybytes = secret.getBytes();
    byte[] keybytes = Decoders.BASE64.decode(secret);
    return Keys.hmacShaKeyFor(keybytes);
  }

  private Claims getClaimsFromToken(String token) {
    Claims claims;
    try {
      claims = Jwts.parser()
          .verifyWith(getSecKey())
          .build()
          .parseSignedClaims(token)
          .getPayload();

    } catch (Exception e) {
      claims = null;
    }
    return claims;
  }


  private Date generateCurrentDate() {
    return new Date(System.currentTimeMillis());
  }

  // expiration time - 15 mins
  private Date generateAccessTokenExpirationDate() {
    return new Date(System.currentTimeMillis() + (expirationTimeAccess));
  }

  // expiration time - 8 hrs
  private Date generateRefreshTokenExpirationDate() {
    return new Date(System.currentTimeMillis() + (8 * 60 * 60 * 1000)); 
  }

  private Boolean isTokenExpired(String token) {
    final Date expiration = this.getExpirationDateFromToken(token);
    return expiration.before(this.generateCurrentDate());
  }

  private Boolean isCreatedBeforeLastPasswordReset(Date created, Date lastPasswordReset) {
    return (lastPasswordReset != null && created.before(lastPasswordReset));
  }

  // default audience = WEB
  private String generateAudience(String device) {
    String audience = this.AUDIENCE_UNKNOWN;
    if (device.equalsIgnoreCase(this.AUDIENCE_WEB)) {
      audience = this.AUDIENCE_WEB;
    } else if (device.equalsIgnoreCase(this.AUDIENCE_TABLET)) {
      audience = AUDIENCE_TABLET;
    } else if (device.equalsIgnoreCase(this.AUDIENCE_MOBILE)) {
      audience = AUDIENCE_MOBILE;
    }
    return audience;
  }

  private Boolean ignoreTokenExpiration(String token) {
    String audience = this.getAudienceFromToken(token);
    return (this.AUDIENCE_TABLET.equals(audience) || this.AUDIENCE_MOBILE.equals(audience));
  }

  //claims
  public Map<String, Object> claims(String emailId, String device){
    Map<String, Object> claims = new HashMap<String, Object>();
    claims.put("sub", emailId);
    claims.put("audience", this.generateAudience(device));
    claims.put("iat", this.generateCurrentDate());
    return claims;
  }

  // to get a refresh token with 8 hrs validity
  public String generateRefreshToken(String emailId, String device) {
    Map<String, Object> claims = claims(emailId,device);
    return this.buildToken(claims,this.generateRefreshTokenExpirationDate());
  }

  // to get a access token with 15 mins validity
  public String generateAccessToken(String emailId, String device) {
    Map<String, Object> claims = claims(emailId,device);
    return this.buildToken(claims,this.generateAccessTokenExpirationDate());
  }


  private String buildToken(Map<String, Object> claims,Date expirationTime) {
    return Jwts.builder()
        .claims(claims)
        .expiration(expirationTime)
        .signWith(getSecKey())
        .compact();
  }

  public Boolean canTokenBeRefreshed(String token, Date lastPasswordReset) {
    final Date iat = this.getCreatedDateFromToken(token);
    return (!(this.isCreatedBeforeLastPasswordReset(iat, lastPasswordReset))
        && (!(this.isTokenExpired(token)) || this.ignoreTokenExpiration(token)));
  }

  // not yet tested and used in application
  public String refreshToken(String token) {
    String refreshedToken;
    try {
      final Claims claims = this.getClaimsFromToken(token);
      claims.put("iat", this.generateCurrentDate());
      refreshedToken = this.buildToken(claims,this.generateAccessTokenExpirationDate());
    } catch (Exception e) {
      refreshedToken = null;
    }
    return refreshedToken;
  }

  public Boolean validateToken(String token, UserDetails userDetails) {
    SecurityUser user = (SecurityUser) userDetails;
    final String username = this.getUsernameFromToken(token);
    final Date iat = this.getCreatedDateFromToken(token);
    // final Date expiration = this.getExpirationDateFromToken(token);
    return (username.equals(user.getUsername()) && !(this.isTokenExpired(token))
        && !(this.isCreatedBeforeLastPasswordReset(iat, user.getLastPasswordReset())));
  }

}
