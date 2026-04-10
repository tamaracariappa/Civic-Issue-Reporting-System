package com.civic.backend.controller;

import com.civic.backend.dto.CreateIssueRequestDto;
import com.civic.backend.dto.CreateIssueResponseDto;
import com.civic.backend.dto.IssueDetailResponseDto;
import com.civic.backend.dto.IssueLogResponseDto;
import com.civic.backend.dto.PublicIssueResponseDto;
import com.civic.backend.service.IssueService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/issues")
public class IssueController {

    private final IssueService issueService;

    public IssueController(IssueService issueService) {
        this.issueService = issueService;
    }

    @PostMapping
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<CreateIssueResponseDto> createIssue(
            @Valid @RequestBody CreateIssueRequestDto request,
            Authentication authentication
    ) {
        Integer reporterId = Integer.valueOf(authentication.getName());
        IssueService.CreateIssueResult result = issueService.createIssue(
                new IssueService.CreateIssueCommand(
                        request.categoryId(),
                        request.description(),
                        request.photoBase64(),
                        request.latitude(),
                        request.longitude(),
                        null
                ),
                reporterId
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(new CreateIssueResponseDto(
                result.docketId(),
                result.status(),
                result.assignedRole(),
                result.deadline()
        ));
    }

    @GetMapping("/public")
    public ResponseEntity<List<PublicIssueResponseDto>> getPublicIssues() {
        List<PublicIssueResponseDto> response = issueService.getPublicIssues().stream()
                .map(issue -> new PublicIssueResponseDto(
                        issue.issueId(),
                        issue.status(),
                        issue.priorityLevel(),
                        issue.duplicateCount(),
                        issue.createdAt()
                ))
                .toList();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<IssueDetailResponseDto> getIssueDetails(@PathVariable("id") Integer id) {
        IssueService.IssueDetailView issue = issueService.getIssueDetails(id);
        List<IssueLogResponseDto> logs = issue.logs().stream()
                .map(log -> new IssueLogResponseDto(
                        log.logId(),
                        log.timestamp(),
                        log.oldStatus(),
                        log.newStatus(),
                        log.notes(),
                        log.updatedByUserId()
                ))
                .toList();

        return ResponseEntity.ok(new IssueDetailResponseDto(
                issue.issueId(),
                issue.status(),
                issue.priorityLevel(),
                issue.duplicateCount(),
                issue.description(),
                issue.photoUrl(),
                issue.createdAt(),
                issue.categoryId(),
                issue.reporterUserId(),
                issue.parentIssueId(),
                issue.latitude(),
                issue.longitude(),
                logs
        ));
    }
}
