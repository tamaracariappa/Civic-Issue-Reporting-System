package com.civic.backend.dto;

import java.time.LocalDateTime;

public record PublicIssueResponseDto(
        Integer issueId,
        String status,
        String priorityLevel,
        Integer duplicateCount,
        LocalDateTime createdAt
) {
}
