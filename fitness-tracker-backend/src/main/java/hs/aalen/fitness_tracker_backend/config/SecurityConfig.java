package hs.aalen.fitness_tracker_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults()) // Enable CORS
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public read access for shared resources (exercises, plans, sessions)
                        .requestMatchers(HttpMethod.GET, "/api/v1/exercises/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/plans/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/sessions/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/exercise-executions/**").permitAll()
                        // Session logs and execution logs require authentication (user isolation)
                        .requestMatchers("/api/v1/session-logs/**").authenticated()
                        .requestMatchers("/api/v1/execution-logs/**").authenticated()
                        // All other requests require authentication
                        .anyRequest().authenticated())
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }
}