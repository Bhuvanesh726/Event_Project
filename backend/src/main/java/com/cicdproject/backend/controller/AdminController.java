package com.cicdproject.backend.controller;

import com.cicdproject.backend.model.UserDto;
import com.cicdproject.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/admin") // All endpoints here will start with /api/admin
@RequiredArgsConstructor
public class AdminController {

    private final AuthService authService;

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')") // Only admins can access this
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = authService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')") // Only admins can access this
    public ResponseEntity<Void> deleteUser(@PathVariable Long id, Principal principal) {
        // Prevent an admin from deleting their own account
        if (authService.isDeletingSelf(principal.getName(), id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        authService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}