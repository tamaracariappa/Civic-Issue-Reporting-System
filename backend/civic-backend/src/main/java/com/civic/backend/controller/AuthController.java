package com.civic.backend.controller;

import com.civic.backend.dto.AuthLoginRequestDto;
import com.civic.backend.dto.AuthLoginResponseDto;
import com.civic.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthLoginResponseDto> login(@Valid @RequestBody AuthLoginRequestDto request) {
        AuthService.AuthResult authResult = authService.authenticateByMobileNumber(request.mobileNumber());
        return ResponseEntity.ok(new AuthLoginResponseDto(
                authResult.token(),
                authResult.userId(),
                authResult.userRole()
        ));
    }
}
