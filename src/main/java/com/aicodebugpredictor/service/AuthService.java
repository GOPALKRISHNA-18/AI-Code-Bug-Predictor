package com.aicodebugpredictor.service;
import com.aicodebugpredictor.dto.AuthResponse;
import com.aicodebugpredictor.dto.ForgotPasswordRequest;
import com.aicodebugpredictor.dto.LoginRequest;
import com.aicodebugpredictor.dto.RegisterRequest;
import com.aicodebugpredictor.dto.ResetPasswordRequest;
import com.aicodebugpredictor.entity.User;
import com.aicodebugpredictor.repository.UserRepository;
import com.aicodebugpredictor.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.UUID;
@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    public AuthService(UserRepository userRepository,PasswordEncoder passwordEncoder,JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }
    public AuthResponse register(RegisterRequest request ) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already registered");
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        User savedUser = userRepository.save(user);
        String token = jwtService.generateToken(savedUser.getEmail());
        return new AuthResponse(token,savedUser.getId(),savedUser.getName(),savedUser.getEmail());
    }
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new RuntimeException("Invalid email or password"));
        boolean passwordMatches = passwordEncoder.matches(request.getPassword(),user.getPassword());
        if (!passwordMatches) {
            throw new RuntimeException("Invalid email or password");
        }
        String token =jwtService.generateToken(user.getEmail());
        return new AuthResponse(token,user.getId(),user.getName(),user.getEmail());
    }
    public String forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository .findByEmail( request.getEmail()).orElseThrow(() ->new RuntimeException( "No account found with this email" ));
        String resetToken = UUID.randomUUID().toString();
        user.setResetToken(resetToken);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);
        return resetToken;
    }
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByResetToken(request.getToken()).orElseThrow(() -> new RuntimeException("Invalid or expired reset token"));
        if (user.getResetTokenExpiry()== null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Reset token has expired");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
    }
}

