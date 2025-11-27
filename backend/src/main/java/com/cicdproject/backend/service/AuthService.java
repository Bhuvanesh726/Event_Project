package com.cicdproject.backend.service;

import com.cicdproject.backend.model.AuthResponse;
import com.cicdproject.backend.model.RegisterRequest;
import com.cicdproject.backend.model.User;
import com.cicdproject.backend.model.UserDto;
import com.cicdproject.backend.repository.UserRepository;
import com.cicdproject.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtUtil jwtUtil;
        private final AuthenticationManager authenticationManager;
        private final JavaMailSender mailSender; // ADDED

        public User register(RegisterRequest request) {
                if (userRepository.existsByEmail(request.getEmail())) {
                        throw new RuntimeException("Email already registered");
                }
                User user = new User();
                user.setName(request.getName());
                user.setEmail(request.getEmail());
                user.setRole("ROLE_USER");
                user.setPassword(passwordEncoder.encode(request.getPassword()));
                return userRepository.save(user);
        }

        public AuthResponse login(String email, String password) {
                authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
                String token = jwtUtil.generateToken(user.getEmail());
                return new AuthResponse(token, user.getEmail(), user.getRole(), user.getName());
        }

        // --- ADDED: METHODS FOR PASSWORD RESET ---
        public void requestPasswordReset(String email) {
                Optional<User> userOptional = userRepository.findByEmail(email);
                if (userOptional.isPresent()) {
                        User user = userOptional.get();
                        String otp = String.format("%06d", new Random().nextInt(999999));
                        user.setResetOtp(otp);
                        user.setOtpExpiryTime(LocalDateTime.now().plusMinutes(10));
                        userRepository.save(user);

                        SimpleMailMessage message = new SimpleMailMessage();
                        message.setTo(email);
                        message.setSubject("Your Password Reset OTP");
                        message.setText("Your One-Time Password (OTP) for password reset is: " + otp);
                        mailSender.send(message);
                }
                // Intentionally do nothing if user not found, for security.
        }

        public void resetPassword(String email, String otp, String newPassword) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("Invalid OTP or email."));

                if (user.getResetOtp() == null || !user.getResetOtp().equals(otp)
                                || user.getOtpExpiryTime().isBefore(LocalDateTime.now())) {
                        throw new RuntimeException("Invalid or expired OTP.");
                }

                user.setPassword(passwordEncoder.encode(newPassword));
                user.setResetOtp(null);
                user.setOtpExpiryTime(null);
                userRepository.save(user);
        }

        // --- EXISTING METHODS FOR ADMIN FUNCTIONALITY ---
        public List<UserDto> getAllUsers() {
                return userRepository.findAll().stream()
                                .map(user -> new UserDto(user.getId(), user.getName(), user.getEmail(), user.getRole()))
                                .collect(Collectors.toList());
        }

        public void deleteUser(Long id) {
                User userToDelete = userRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
                if ("ROLE_ADMIN".equals(userToDelete.getRole())) {
                        throw new SecurityException("Admins cannot be deleted.");
                }
                userRepository.delete(userToDelete);
        }

        public boolean isDeletingSelf(String authenticatedUsername, Long idToDelete) {
                User user = userRepository.findById(idToDelete).orElse(null);
                return user != null && user.getEmail().equals(authenticatedUsername);
        }
}