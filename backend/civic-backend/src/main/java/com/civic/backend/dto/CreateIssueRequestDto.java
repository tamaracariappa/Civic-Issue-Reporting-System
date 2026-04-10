package com.civic.backend.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record CreateIssueRequestDto(
        @NotNull
        @JsonProperty("category_id")
        @JsonAlias({"categoryId"})
        Integer categoryId,
        @NotBlank String description,
        @NotBlank
        @JsonProperty("photo_base64")
        @JsonAlias({"photoBase64"})
        String photoBase64,
        @NotNull
        @JsonProperty("latitude")
        @JsonAlias({"lat"})
        BigDecimal latitude,
        @NotNull
        @JsonProperty("longitude")
        @JsonAlias({"lng"})
        BigDecimal longitude
) {
}
