package com.silzila.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import org.springframework.util.StringUtils;

import java.io.IOException;
import java.util.Enumeration;

@RequiredArgsConstructor
@Configuration
public class AuthenticationTokenFilter extends OncePerRequestFilter {

  // @Value("${jwtHeader}")
  // private String tokenHeader;

  private final TokenUtils tokenUtils;
  private final UserDetailsService userDetailsService;

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    HttpServletRequest httpRequest = request;
    // String authToken = httpRequest.getHeader(tokenHeader);

    // Enumeration<String> en = request.getHeaderNames();
    // System.out.println("Headers list ============== " + en.toString());
    // while (en.hasMoreElements()) {
    // System.out.println(en.nextElement());
    // }
    String authToken = parseJwt(request);
    String username = this.tokenUtils.getUsernameFromToken(authToken);

    if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
      UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
      if (this.tokenUtils.validateToken(authToken, userDetails)) {
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null,
            userDetails.getAuthorities());
        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(httpRequest));
        SecurityContextHolder.getContext().setAuthentication(authentication);
      }
    }
    // pass requester User ID to request header with variable name 'requesterUserId'
    MutableHttpServletRequest mutableRequest = new MutableHttpServletRequest(request);
    mutableRequest.putHeader("username", username);
    // System.out.println("Header username =========== " +
    // mutableRequest.getHeaders(username));

    // Allow CORS
    HttpServletResponse httpResponse = response;
    // httpResponse.setHeader(username, username);
    httpResponse.setHeader("Access-Control-Allow-Origin", "*");
    httpResponse.setHeader("Access-Control-Max-Age", "3600");
    httpResponse.setHeader("Access-Control-Allow-Headers",
        "Content-Type, Authorization, Content-Length, X-Requested-With");

    filterChain.doFilter(mutableRequest, httpResponse);
  }

  private String parseJwt(HttpServletRequest request) {
    String headerAuth = request.getHeader("Authorization");

    if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
      return headerAuth.substring(7, headerAuth.length());
    }
    return null;
  }

}