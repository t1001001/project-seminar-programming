package hs.aalen.fitness_tracker_backend.users;

import hs.aalen.fitness_tracker_backend.users.model.Users;
import hs.aalen.fitness_tracker_backend.users.repository.UsersRepository;
import hs.aalen.fitness_tracker_backend.users.service.UsersService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsersServiceTest {

    @Mock
    private UsersRepository usersRepository;

    @InjectMocks
    private UsersService service;

    private Users testUser;
    private static final String TEST_USERNAME = "testUser";
    private static final String TEST_PASSWORD = "hashedPassword123";

    @BeforeEach
    void setup() {
        testUser = new Users();
        testUser.setId(UUID.randomUUID());
        testUser.setUsername(TEST_USERNAME);
        testUser.setPassword(TEST_PASSWORD);
    }

    @Test
    void shouldLoadUserByUsername() {
        when(usersRepository.findByUsername(TEST_USERNAME)).thenReturn(Optional.of(testUser));

        UserDetails userDetails = service.loadUserByUsername(TEST_USERNAME);

        assertNotNull(userDetails);
        assertEquals(TEST_USERNAME, userDetails.getUsername());
        assertEquals(TEST_PASSWORD, userDetails.getPassword());
        assertTrue(userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("USER")));
        verify(usersRepository).findByUsername(TEST_USERNAME);
    }

    @Test
    void shouldThrowExceptionWhenUserNotFound() {
        String unknownUsername = "unknownUser";
        when(usersRepository.findByUsername(unknownUsername)).thenReturn(Optional.empty());

        UsernameNotFoundException exception = assertThrows(
                UsernameNotFoundException.class,
                () -> service.loadUserByUsername(unknownUsername));

        assertEquals(unknownUsername, exception.getMessage());
        verify(usersRepository).findByUsername(unknownUsername);
    }
}
