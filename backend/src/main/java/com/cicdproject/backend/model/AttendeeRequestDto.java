package com.cicdproject.backend.model;

public class AttendeeRequestDto {
    private String name;
    private String email;
    private String phone;
    private Integer tickets; // <-- 1. ADDED this field

    // Getters and Setters
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

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    // <-- 2. ADDED getter and setter for tickets -->
    public Integer getTickets() {
        return tickets;
    }

    public void setTickets(Integer tickets) {
        this.tickets = tickets;
    }
}