package com.civic.backend.dto;

public record AuthLoginResponseDto(
        String token,
        Integer userId,
        String userRole
) {
}
