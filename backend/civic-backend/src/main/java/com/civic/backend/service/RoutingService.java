package com.civic.backend.service;

import com.civic.backend.model.IssueCategory;
import com.civic.backend.model.OfficerAssignment;
import com.civic.backend.model.Ward;
import com.civic.backend.repository.IssueCategoryRepository;
import com.civic.backend.repository.OfficerAssignmentRepository;
import com.civic.backend.repository.WardRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Comparator;
import org.springframework.stereotype.Service;

@Service
public class RoutingService {

    private final WardRepository wardRepository;
    private final IssueCategoryRepository issueCategoryRepository;
    private final OfficerAssignmentRepository officerAssignmentRepository;

    public RoutingService(
            WardRepository wardRepository,
            IssueCategoryRepository issueCategoryRepository,
            OfficerAssignmentRepository officerAssignmentRepository
    ) {
        this.wardRepository = wardRepository;
        this.issueCategoryRepository = issueCategoryRepository;
        this.officerAssignmentRepository = officerAssignmentRepository;
    }

    public Integer mapCoordinatesToWard(BigDecimal latitude, BigDecimal longitude) {
        if (latitude == null || longitude == null) {
            throw new IllegalArgumentException("Latitude and longitude are required");
        }
        return wardRepository.findAll().stream()
                .min(Comparator.comparing(Ward::getWardId))
                .map(Ward::getWardId)
                .orElseThrow(() -> new IllegalStateException("No ward found for routing"));
    }

    public OfficerAssignment getDefaultAssignment(Integer wardId, Integer categoryId) {
        IssueCategory category = issueCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Issue category not found: " + categoryId));
        Integer roleId = category.getDefaultRole().getRoleId();

        return officerAssignmentRepository.findActiveByRoleAndWardWithFallback(
                        roleId,
                        wardId,
                        LocalDateTime.now()
                )
                .orElseThrow(() -> new IllegalStateException("No active officer assignment found for role"));
    }
}
