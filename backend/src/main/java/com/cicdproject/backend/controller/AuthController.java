package com.cicdproject.backend.controller;

import com.cicdproject.backend.model.*;
import com.cicdproject.backend.service.AuthService;
import lombok.Data; // Make sure this is imported if you created the DTOs
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public UserResponse register(@RequestBody RegisterRequest request) {
        User registeredUser = authService.register(request);
        return new UserResponse(
                registeredUser.getId(),
                registeredUser.getName(),
                registeredUser.getEmail(),
                registeredUser.getRole());
    }

    // This is a simple DTO class for login requests
    // Ensure it has both getters and setters
    public static class LoginRequest {
        private String email;
        private String password;

        // Getters and Setters
        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() { // This method was likely missing
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest req) {
        // This line will now work correctly
        return authService.login(req.getEmail(), req.getPassword());
    }

    // --- ENDPOINTS FOR PASSWORD RESET ---
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody EmailRequest emailRequest) {
        authService.requestPasswordReset(emailRequest.getEmail());
        return ResponseEntity.ok("If an account with that email exists, a reset OTP has been sent.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            authService.resetPassword(request.getEmail(), request.getOtp(), request.getNewPassword());
            return ResponseEntity.ok("Password has been reset successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}