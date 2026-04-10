package com.civic.backend.service;

import com.civic.backend.model.User;
import com.civic.backend.repository.UserRepository;
import com.civic.backend.security.JwtService;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    public AuthResult authenticateByMobileNumber(String mobileNumber) {
        User user = userRepository.findByMobileNumber(mobileNumber)
                .orElseThrow(() -> new IllegalArgumentException("Invalid mobile number"));

        String token = jwtService.generateToken(user.getUserId(), user.getUserRole(), user.getUserId().toString());
        return new AuthResult(token, user.getUserId(), user.getUserRole());
    }

    public record AuthResult(String token, Integer userId, String userRole) {
    }
}
