package com.civic.backend.service;

import com.civic.backend.model.IssueCategory;
import com.civic.backend.model.IssueLog;
import com.civic.backend.model.IssueReport;
import com.civic.backend.model.IssueSla;
import com.civic.backend.model.Location;
import com.civic.backend.model.OfficerAssignment;
import com.civic.backend.model.User;
import com.civic.backend.model.Ward;
import com.civic.backend.repository.IssueCategoryRepository;
import com.civic.backend.repository.IssueLogRepository;
import com.civic.backend.repository.IssueReportRepository;
import com.civic.backend.repository.IssueSlaRepository;
import com.civic.backend.repository.LocationRepository;
import com.civic.backend.repository.UserRepository;
import com.civic.backend.repository.WardRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class IssueService {

    private static final BigDecimal DUPLICATE_LAT_DELTA = new BigDecimal("0.00050000");
    private static final BigDecimal DUPLICATE_LNG_DELTA = new BigDecimal("0.00050000");

    private final RoutingService routingService;
    private final UserRepository userRepository;
    private final WardRepository wardRepository;
    private final IssueCategoryRepository issueCategoryRepository;
    private final LocationRepository locationRepository;
    private final IssueReportRepository issueReportRepository;
    private final IssueSlaRepository issueSlaRepository;
    private final IssueLogRepository issueLogRepository;

    public IssueService(
            RoutingService routingService,
            UserRepository userRepository,
            WardRepository wardRepository,
            IssueCategoryRepository issueCategoryRepository,
            LocationRepository locationRepository,
            IssueReportRepository issueReportRepository,
            IssueSlaRepository issueSlaRepository,
            IssueLogRepository issueLogRepository
    ) {
        this.routingService = routingService;
        this.userRepository = userRepository;
        this.wardRepository = wardRepository;
        this.issueCategoryRepository = issueCategoryRepository;
        this.locationRepository = locationRepository;
        this.issueReportRepository = issueReportRepository;
        this.issueSlaRepository = issueSlaRepository;
        this.issueLogRepository = issueLogRepository;
    }

    @Transactional
    public CreateIssueResult createIssue(CreateIssueCommand command, Integer reporterId) {
        User reporter = userRepository.findById(reporterId)
                .orElseThrow(() -> new IllegalArgumentException("Reporter not found: " + reporterId));
        IssueCategory issueCategory = issueCategoryRepository.findById(command.categoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found: " + command.categoryId()));

        Integer wardId = routingService.mapCoordinatesToWard(command.latitude(), command.longitude());
        Ward ward = wardRepository.findById(wardId)
                .orElseThrow(() -> new IllegalStateException("Ward not found: " + wardId));

        OfficerAssignment defaultAssignment = routingService.getDefaultAssignment(wardId, command.categoryId());

        Location location = new Location();
        location.setLatitude(command.latitude());
        location.setLongitude(command.longitude());
        location.setAddressText(command.addressText());
        location.setWard(ward);
        Location savedLocation = locationRepository.save(location);

        IssueReport matchedMaster = findDuplicateMaster(command.latitude(), command.longitude());

        IssueReport newIssue = new IssueReport();
        newIssue.setReporterUser(reporter);
        newIssue.setCategory(issueCategory);
        newIssue.setDescription(command.description());
        newIssue.setPhotoUrl(command.photoBase64());
        newIssue.setLocation(savedLocation);
        newIssue.setStatus("OPEN");
        newIssue.setPriorityLevel("LOW");
        newIssue.setDuplicateCount(0);
        if (matchedMaster != null) {
            newIssue.setParentIssue(matchedMaster);
        }
        IssueReport savedIssue = issueReportRepository.save(newIssue);

        if (matchedMaster != null) {
            Integer currentCount = matchedMaster.getDuplicateCount() == null ? 0 : matchedMaster.getDuplicateCount();
            int newDuplicateCount = currentCount + 1;
            matchedMaster.setDuplicateCount(newDuplicateCount);
            matchedMaster.setPriorityLevel(mapPriorityFromDuplicateCount(newDuplicateCount));
            issueReportRepository.save(matchedMaster);
        }

        LocalDateTime deadline = LocalDateTime.now().plusHours(issueCategory.getSlaHours());
        IssueSla issueSla = new IssueSla();
        issueSla.setIssue(savedIssue);
        issueSla.setDeadline(deadline);
        issueSla.setBreached(false);
        issueSlaRepository.save(issueSla);

        IssueLog issueLog = new IssueLog();
        issueLog.setIssue(savedIssue);
        issueLog.setUpdatedByUser(reporter);
        issueLog.setOldStatus(null);
        issueLog.setNewStatus("OPEN");
        issueLog.setNotes("Issue created");
        issueLogRepository.save(issueLog);

        return new CreateIssueResult(
                savedIssue.getIssueId(),
                savedIssue.getStatus(),
                defaultAssignment.getRole().getRoleTitle(),
                deadline
        );
    }

    @Transactional
    public void updateIssueStatus(Integer issueId, String newStatus, Integer officerId, String notes) {
        IssueReport issue = issueReportRepository.findById(issueId)
                .orElseThrow(() -> new IllegalArgumentException("Issue not found: " + issueId));
        User officer = userRepository.findById(officerId)
                .orElseThrow(() -> new IllegalArgumentException("Officer not found: " + officerId));

        Integer wardId = issue.getLocation().getWard() == null ? null : issue.getLocation().getWard().getWardId();
        if (wardId == null) {
            throw new IllegalStateException("Issue ward is required for authorization checks");
        }

        Integer roleId = issue.getCategory().getDefaultRole().getRoleId();
        OfficerAssignment activeAssignment = routingService.getDefaultAssignment(wardId, issue.getCategory().getCategoryId());
        if (!activeAssignment.getRole().getRoleId().equals(roleId)
                || !activeAssignment.getOfficer().getUserId().equals(officerId)) {
            throw new IllegalStateException("Officer is not authorized to update this issue");
        }

        String oldStatus = issue.getStatus();
        issue.setStatus(newStatus);
        issueReportRepository.save(issue);

        IssueLog issueLog = new IssueLog();
        issueLog.setIssue(issue);
        issueLog.setUpdatedByUser(officer);
        issueLog.setOldStatus(oldStatus);
        issueLog.setNewStatus(newStatus);
        issueLog.setNotes(notes);
        issueLogRepository.save(issueLog);
    }

    private IssueReport findDuplicateMaster(BigDecimal latitude, BigDecimal longitude) {
        BigDecimal normalizedLat = latitude.setScale(8, RoundingMode.HALF_UP);
        BigDecimal normalizedLng = longitude.setScale(8, RoundingMode.HALF_UP);

        BigDecimal minLat = normalizedLat.subtract(DUPLICATE_LAT_DELTA);
        BigDecimal maxLat = normalizedLat.add(DUPLICATE_LAT_DELTA);
        BigDecimal minLng = normalizedLng.subtract(DUPLICATE_LNG_DELTA);
        BigDecimal maxLng = normalizedLng.add(DUPLICATE_LNG_DELTA);

        List<IssueReport> candidates = issueReportRepository.findMasterIssuesInBoundingBox(minLat, maxLat, minLng, maxLng);
        return candidates.isEmpty() ? null : candidates.get(0);
    }

    private String mapPriorityFromDuplicateCount(int duplicateCount) {
        if (duplicateCount < 3) {
            return "LOW";
        }
        if (duplicateCount <= 5) {
            return "MEDIUM";
        }
        if (duplicateCount <= 10) {
            return "HIGH";
        }
        return "CRITICAL";
    }

    public record CreateIssueCommand(
            Integer categoryId,
            String description,
            String photoBase64,
            BigDecimal latitude,
            BigDecimal longitude,
            String addressText
    ) {
    }

    public record CreateIssueResult(
            Integer docketId,
            String status,
            String assignedRole,
            LocalDateTime deadline
    ) {
    }
}
