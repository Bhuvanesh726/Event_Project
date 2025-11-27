package com.cicdproject.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime; // ADDED
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users", uniqueConstraints = { @UniqueConstraint(columnNames = { "email" }) })
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    private String password;

    private String role;

    // --- ADDED FIELDS FOR PASSWORD RESET ---
    @Column(name = "reset_otp")
    private String resetOtp;

    @Column(name = "otp_expiry_time")
    private LocalDateTime otpExpiryTime;
    // ------------------------------------

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Event> events = new ArrayList<>();

    // Constructors
    public User() {
    }

    public User(String name, String email, String password, String role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    // Getters & setters...
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public List<Event> getEvents() {
        return events;
    }

    public void setEvents(List<Event> events) {
        this.events = events;
    }

    // Getters and setters for new fields
    public String getResetOtp() {
        return resetOtp;
    }

    public void setResetOtp(String resetOtp) {
        this.resetOtp = resetOtp;
    }

    public LocalDateTime getOtpExpiryTime() {
        return otpExpiryTime;
    }

    public void setOtpExpiryTime(LocalDateTime otpExpiryTime) {
        this.otpExpiryTime = otpExpiryTime;
    }
}