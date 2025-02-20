package com.silzila.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import org.springframework.util.StringUtils;

import java.io.IOException;

@RequiredArgsConstructor
@Configuration
public class AuthenticationTokenFilter extends OncePerRequestFilter {

  // @Value("${jwtHeader}")
  // private String tokenHeader;
  private final TokenUtils tokenUtils;
  private final UserDetailsService userDetailsService;

@Override
protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
    HttpServletRequest httpRequest = request;
    HttpServletResponse httpResponse = response;
    String requestURI = httpRequest.getRequestURI();

    // Bypass authentication for specific endpoints
    if (requestURI.equals("/")|| requestURI.startsWith("/api/auth/") || requestURI.startsWith("/api/h2-console/") || requestURI.startsWith("/api/h2-ui") 
        || requestURI.startsWith("/api/api-docs/") || requestURI.startsWith("/api/swagger-ui.html") 
        || requestURI.startsWith("/api/swagger-ui/") || requestURI.startsWith("/static/") || requestURI.endsWith(".json") || requestURI.startsWith("/logo") || 
        requestURI.endsWith(".woff2") || requestURI.endsWith(".txt") || requestURI.endsWith(".png") || requestURI.endsWith(".jpg") || requestURI.endsWith(".jpeg") || 
        requestURI.endsWith(".gif") || requestURI.endsWith(".svg") || requestURI.endsWith(".ico") || requestURI.endsWith(".css")|| requestURI.endsWith(".js") ||
        requestURI.endsWith(".map") || requestURI.startsWith("/auth/") || requestURI.startsWith("/h2-console/") || requestURI.startsWith("/h2-ui") ||
        requestURI.startsWith("/api-docs/") || requestURI.startsWith("/swagger-ui.html") || requestURI.startsWith("/swagger-ui/")) {
        filterChain.doFilter(request, response);
        return;
    }

    String authToken = parseJwt(request);

    if (authToken == null) {
        httpResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Missing token");
        return;
    }

        String username = tokenUtils.getUsernameFromToken(authToken);

        if (username == null) {
            httpResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
            return;
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        if (!tokenUtils.validateToken(authToken, userDetails)) {
            httpResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token was expired");
            return;
        }

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(httpRequest));
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // pass requester User ID to request header with variable name 'requesterUserId'
        MutableHttpServletRequest mutableRequest = new MutableHttpServletRequest(request);
        mutableRequest.putHeader("username", username);

        // Allow CORS
        // httpResponse.setHeader(username, username);
        httpResponse.setHeader("Access-Control-Allow-Origin", "*");
        httpResponse.setHeader("Access-Control-Max-Age", "3600");
        httpResponse.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With");

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