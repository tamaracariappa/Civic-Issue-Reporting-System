package com.civic.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record IssueDetailResponseDto(
        Integer issueId,
        String status,
        String priorityLevel,
        Integer duplicateCount,
        String description,
        String photoUrl,
        LocalDateTime createdAt,
        Integer categoryId,
        Integer reporterUserId,
        Integer parentIssueId,
        BigDecimal latitude,
        BigDecimal longitude,
        List<IssueLogResponseDto> logs
) {
}
