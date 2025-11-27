package com.cicdproject.backend.model;

import java.time.LocalDateTime;

// This is a DTO to shape the data for the frontend
public class AttendeeDto {
    private Long id;
    private String name;
    private String email;
    private LocalDateTime registeredOn;
    private Long eventId;
    private String eventTitle;
    private Integer tickets; // <-- 1. ADD the tickets field

    public AttendeeDto(Attendee attendee) {
        this.id = attendee.getId();
        this.name = attendee.getName();
        this.email = attendee.getEmail();
        this.registeredOn = attendee.getRegisteredOn();
        this.tickets = attendee.getTickets(); // <-- 2. ADD this line to the constructor
        if (attendee.getEvent() != null) {
            this.eventId = attendee.getEvent().getId();
            this.eventTitle = attendee.getEvent().getTitle();
        }
    }

    // Getters for all fields
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public LocalDateTime getRegisteredOn() {
        return registeredOn;
    }

    public Long getEventId() {
        return eventId;
    }

    public String getEventTitle() {
        return eventTitle;
    }

    // <-- 3. ADD a getter for tickets -->
    public Integer getTickets() {
        return tickets;
    }
}