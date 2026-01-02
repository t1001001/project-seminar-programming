package hs.aalen.fitness_tracker_backend.users.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/val")
public class UsersController {
    
    @GetMapping
    public String me(Authentication authentication) {
        return authentication.getName();
    }
}
