package hs.aalen.fitness_tracker_backend.sessions;

import hs.aalen.fitness_tracker_backend.sessions.dto.SessionsCreateDto;
import hs.aalen.fitness_tracker_backend.sessions.model.Sessions;
import hs.aalen.fitness_tracker_backend.sessions.model.Sessions.SessionStatus;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class SessionStatusTest {

    @Test
    void testDefaultStatusIsPlanned() {
        Sessions session = new Sessions();
        assertEquals(SessionStatus.PLANNED, session.getStatus(), "Default status should be PLANNED");
    }

    @Test
    void testSetStatusToCompleted() {
        Sessions session = new Sessions();
        session.setStatus(SessionStatus.COMPLETED);
        assertEquals(SessionStatus.COMPLETED, session.getStatus(), "Status should be updated to COMPLETED");
    }

    @Test
    void testDtoStatusMapping() {
        SessionsCreateDto dto = new SessionsCreateDto();
        dto.setStatus(SessionStatus.COMPLETED);
        assertEquals(SessionStatus.COMPLETED, dto.getStatus(), "DTO status should be set correctly");
    }
}
