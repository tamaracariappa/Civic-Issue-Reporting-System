package com.civic.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record AuthLoginRequestDto(
        @NotBlank String mobileNumber
) {
}
