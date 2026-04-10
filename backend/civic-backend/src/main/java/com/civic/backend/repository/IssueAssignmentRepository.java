package com.civic.backend.repository;

import com.civic.backend.model.IssueAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IssueAssignmentRepository extends JpaRepository<IssueAssignment, Integer> {
}
