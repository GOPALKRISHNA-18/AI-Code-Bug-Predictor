package com.aicodebugpredictor.config;
import com.aicodebugpredictor.security.JwtAuthenticationFilter;
import com.aicodebugpredictor.security.OAuth2AuthenticationSuccessHandler;
import com.aicodebugpredictor.service.CustomOAuth2UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;
@Configuration
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2AuthenticationSuccessHandler
            oAuth2AuthenticationSuccessHandler;
    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter, CustomOAuth2UserService customOAuth2UserService, OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler
    ) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.customOAuth2UserService = customOAuth2UserService;
        this.oAuth2AuthenticationSuccessHandler = oAuth2AuthenticationSuccessHandler;
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
   }
    @Bean
    public SecurityFilterChain securityFilterChain( HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session ->session.sessionCreationPolicy( SessionCreationPolicy.IF_REQUIRED))
            .authorizeHttpRequests(auth -> auth
                                    .requestMatchers( "/api/auth/**" )
                                    .permitAll()
                                    .requestMatchers( "/oauth2/**")
                                    .permitAll()
                                    .requestMatchers("/login/**")
                                    .permitAll()
                                    .requestMatchers(HttpMethod.OPTIONS,"/**")
                                    .permitAll()
                                    .anyRequest()
                                    .authenticated()
            )
            .oauth2Login(oauth -> oauth
                                    .userInfoEndpoint(userInfo -> userInfo
                                                            .userService(customOAuth2UserService )
                                    )
                                    .successHandler(oAuth2AuthenticationSuccessHandler)
            )
            .addFilterBefore(jwtAuthenticationFilter,UsernamePasswordAuthenticationFilter.class );
        return http.build();
    }
    @Bean
    public CorsConfigurationSource
    corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        configuration.setAllowedMethods( Arrays.asList(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "PATCH",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                Arrays.asList(
                        "Authorization",
                        "Content-Type",
                        "Accept"
                )
        );
        configuration.setExposedHeaders(
                Arrays.asList(
                        "Authorization"
                )
        );
        configuration.setAllowCredentials(
                true
        );
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration( "/**", configuration);
        return source;
    }
}
