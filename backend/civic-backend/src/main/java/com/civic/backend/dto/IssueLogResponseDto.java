package com.civic.backend.dto;

import java.time.LocalDateTime;

public record IssueLogResponseDto(
        Integer logId,
        LocalDateTime timestamp,
        String oldStatus,
        String newStatus,
        String notes,
        Integer updatedByUserId
) {
}
