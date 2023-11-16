package com.silzila.configuration;

import com.silzila.security.AuthenticationTokenFilter;
import com.silzila.security.EntryPointUnauthorizedHandler;
import com.silzila.security.TokenUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import static jakarta.servlet.DispatcherType.ERROR;
import static jakarta.servlet.DispatcherType.FORWARD;
import static org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfiguration {

    private final EntryPointUnauthorizedHandler unauthorizedHandler;
    private final UserDetailsService userDetailsService;
    private final TokenUtils tokenUtils;
    private final AuthenticationConfiguration authConfig;
    private final AuthenticationTokenFilter authenticationTokenFilter;

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager() throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(this.userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    // @Bean
    // public AuthenticationTokenFilter authenticationTokenFilterBean() throws
    // Exception {
    // AuthenticationTokenFilter authenticationTokenFilter = new
    // AuthenticationTokenFilter(tokenUtils,
    // userDetailsService);
    // authenticationTokenFilter.setAuthenticationManager(authenticationManager());
    // return authenticationTokenFilter;
    // }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(
                        httpSecuritySessionManagementConfigurer -> httpSecuritySessionManagementConfigurer
                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(
                        authorizationManagerRequestMatcherRegistry -> authorizationManagerRequestMatcherRegistry
                                // .requestMatchers(HttpMethod.OPTIONS,
                                // "/**").permitAll()
                                .dispatcherTypeMatchers(FORWARD, ERROR).permitAll()
                                // .requestMatchers(HttpMethod.OPTIONS,
                                // "/**").permitAll()
                                .requestMatchers(
                                        antMatcher("**/h2-console/**"),
                                        antMatcher("**/h2-ui**"),
                                        antMatcher("/**/api-docs/**"),
                                        antMatcher("/swagger-ui.html"),
                                        antMatcher("/swagger-ui/**"),
                                        antMatcher("/auth/**"))
                                .permitAll() // https://marco.dev/spring-boot-h2-error
                                .anyRequest().authenticated())
                .exceptionHandling(
                        httpSecurityExceptionHandlingConfigurer -> httpSecurityExceptionHandlingConfigurer
                                .authenticationEntryPoint(this.unauthorizedHandler));

        // To fix h2-console -
        // https://stackoverflow.com/questions/53395200/h2-console-is-not-showing-in-browser
        http.headers(httpSecurityHeadersConfigurer -> httpSecurityHeadersConfigurer
                .frameOptions(HeadersConfigurer.FrameOptionsConfig::disable));

        // Custom JWT based authentication
        http
                .addFilterBefore(authenticationTokenFilter,
                        UsernamePasswordAuthenticationFilter.class);
        return http.build();

    }
}
