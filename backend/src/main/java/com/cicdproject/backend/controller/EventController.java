package com.cicdproject.backend.controller;

import com.cicdproject.backend.model.*;
import com.cicdproject.backend.repository.AttendeeRepository;
import com.cicdproject.backend.repository.EventRepository;
import com.cicdproject.backend.repository.UserRepository;
import com.cicdproject.backend.service.PdfService; // ADDED
import jakarta.persistence.EntityNotFoundException; // ADDED
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders; // ADDED
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType; // ADDED
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final AttendeeRepository attendeeRepository;
    private final PdfService pdfService; // ADDED: Inject the PDF Service

    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        return userRepository.findByEmail(currentUsername)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    // --- EXISTING METHODS (NO CHANGES) ---
    @GetMapping
    public List<EventDto> getUserEvents() {
        User user = getAuthenticatedUser();
        return eventRepository.findByUserId(user.getId())
                .stream()
                .map(EventDto::new)
                .collect(Collectors.toList());
    }

    @PostMapping
    public Event createEvent(@RequestBody Event event) {
        User user = getAuthenticatedUser();
        event.setUser(user);
        return eventRepository.save(event);
    }

    @GetMapping("/{eventId}/attendees")
    public List<Attendee> getEventAttendees(@PathVariable Long eventId) {
        User user = getAuthenticatedUser();
        return eventRepository.findById(eventId)
                .filter(event -> event.getUser().getId().equals(user.getId()))
                .map(event -> attendeeRepository.findByEventId(event.getId()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Event not found or you do not have permission"));
    }

    @PostMapping("/{eventId}/attendees")
    public AttendeeDto registerAttendee(@PathVariable Long eventId, @RequestBody AttendeeRequestDto attendeeRequest) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found"));

        Attendee newAttendee = new Attendee();
        newAttendee.setName(attendeeRequest.getName());
        newAttendee.setEmail(attendeeRequest.getEmail());
        newAttendee.setTickets(attendeeRequest.getTickets());
        newAttendee.setEvent(event);
        newAttendee.setRegisteredOn(LocalDateTime.now());
        Attendee savedAttendee = attendeeRepository.save(newAttendee);
        return new AttendeeDto(savedAttendee);
    }

    @GetMapping("/all/attendees")
    public List<AttendeeDto> getAllUserAttendees() {
        User user = getAuthenticatedUser();
        return attendeeRepository.findByEvent_User_Id(user.getId())
                .stream()
                .map(AttendeeDto::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<EventDto> getEventById(@PathVariable Long eventId) {
        User user = getAuthenticatedUser();
        return eventRepository.findById(eventId)
                .filter(event -> event.getUser().getId().equals(user.getId()))
                .map(EventDto::new)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{eventId}")
    public ResponseEntity<EventDto> updateEvent(@PathVariable Long eventId, @RequestBody EventDto eventDetails) {
        User user = getAuthenticatedUser();
        return eventRepository.findById(eventId)
                .filter(event -> event.getUser().getId().equals(user.getId()))
                .map(existingEvent -> {
                    existingEvent.setTitle(eventDetails.getTitle());
                    existingEvent.setDescription(eventDetails.getDescription());
                    existingEvent.setDate(eventDetails.getDate());
                    existingEvent.setLocation(eventDetails.getLocation());
                    existingEvent.setCategory(eventDetails.getCategory());
                    existingEvent.setCapacity(eventDetails.getCapacity());
                    existingEvent.setTicketPrice(eventDetails.getTicketPrice());
                    existingEvent.setStatus(eventDetails.getStatus());
                    Event updatedEvent = eventRepository.save(existingEvent);
                    return ResponseEntity.ok(new EventDto(updatedEvent));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long eventId) {
        User user = getAuthenticatedUser();
        return eventRepository.findById(eventId)
                .filter(event -> event.getUser().getId().equals(user.getId()))
                .map(event -> {
                    eventRepository.delete(event);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/attendees/{attendeeId}")
    public ResponseEntity<Void> deleteAttendee(@PathVariable Long attendeeId) {
        User user = getAuthenticatedUser();
        return attendeeRepository.findById(attendeeId)
                .filter(attendee -> attendee.getEvent().getUser().getId().equals(user.getId()))
                .map(attendee -> {
                    attendeeRepository.delete(attendee);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // --- ADDED: NEW PDF DOWNLOAD ENDPOINT ---
    @GetMapping("/{id}/attendees/download")
    public ResponseEntity<byte[]> downloadAttendeesPdf(@PathVariable Long id) {
        // Fetch the event to get its title
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Event not found with id: " + id));

        // Generate the PDF content using the service
        byte[] pdfContents = pdfService.generateAttendeesPdf(id);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);

        // Create a safe filename from the event title
        String filename = event.getTitle().replaceAll("[^a-zA-Z0-9.-]", "_") + ".pdf";

        headers.setContentDispositionFormData(filename, filename);
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

        return new ResponseEntity<>(pdfContents, headers, HttpStatus.OK);
    }
}