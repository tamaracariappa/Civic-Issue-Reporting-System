package com.civic.backend.dto;

import java.time.LocalDateTime;

public record CreateIssueResponseDto(
        Integer docketId,
        String status,
        String assignedRole,
        LocalDateTime deadline
) {
}
