package com.cicdproject.backend.model;

public class AuthResponse {
    private String token;
    private String email;
    private String role;
    private String name; // <-- ADDED

    // Constructor updated to include the name
    public AuthResponse(String token, String email, String role, String name) {
        this.token = token;
        this.email = email;
        this.role = role;
        this.name = name; // <-- ADDED
    }

    public String getToken() {
        return token;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    // Getter for the new name field
    public String getName() { // <-- ADDED
        return name;
    }
}