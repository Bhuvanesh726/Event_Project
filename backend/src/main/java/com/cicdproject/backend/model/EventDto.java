package com.cicdproject.backend.model;

import java.time.LocalDateTime;

public class EventDto {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime date;
    private String location;
    private String category;
    private Integer capacity;
    private Double ticketPrice;
    private String status; // <-- 1. ADDED status field

    public EventDto() {
    }

    public EventDto(Event event) {
        this.id = event.getId();
        this.title = event.getTitle();
        this.description = event.getDescription();
        this.date = event.getDate();
        this.location = event.getLocation();
        this.category = event.getCategory();
        this.capacity = event.getCapacity();
        this.ticketPrice = event.getTicketPrice();
        this.status = event.getStatus(); // <-- 2. ADDED status to constructor
    }

    // Getters...
    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public String getLocation() {
        return location;
    }

    public String getCategory() {
        return category;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public Double getTicketPrice() {
        return ticketPrice;
    }

    public String getStatus() {
        return status;
    } // <-- 3. ADDED status getter

    // Setters...
    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public void setTicketPrice(Double ticketPrice) {
        this.ticketPrice = ticketPrice;
    }

    public void setStatus(String status) {
        this.status = status;
    } // <-- 4. ADDED status setter
}