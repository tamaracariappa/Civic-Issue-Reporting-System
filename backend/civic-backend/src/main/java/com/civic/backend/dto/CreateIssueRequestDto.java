package com.civic.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record CreateIssueRequestDto(
        @NotNull Integer categoryId,
        @NotBlank String description,
        @NotBlank String photoBase64,
        @NotNull BigDecimal latitude,
        @NotNull BigDecimal longitude
) {
}
