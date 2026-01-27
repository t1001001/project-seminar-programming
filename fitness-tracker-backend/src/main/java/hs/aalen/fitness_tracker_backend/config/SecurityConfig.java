package hs.aalen.fitness_tracker_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                    // Catalog data is public read-only, mutation requires auth
                    .requestMatchers(HttpMethod.GET, "/api/v1/exercises/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/v1/plans/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/v1/sessions/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/v1/exercise-executions/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/v1/session-logs/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/v1/execution-logs/**").permitAll()
                    // User-owned logs require auth to enforce isolation
                    .requestMatchers("/api/v1/session-logs/**").authenticated()
                    .requestMatchers("/api/v1/execution-logs/**").authenticated()
                    .anyRequest().authenticated()
            )
            .httpBasic(Customizer.withDefaults());

        return http.build();
    }
}
