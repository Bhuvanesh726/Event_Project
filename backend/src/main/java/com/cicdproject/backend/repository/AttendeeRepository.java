package com.cicdproject.backend.repository;

import com.cicdproject.backend.model.Attendee;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AttendeeRepository extends JpaRepository<Attendee, Long> {
    List<Attendee> findByEventId(Long eventId);

    List<Attendee> findByEvent_User_Id(Long userId);
}