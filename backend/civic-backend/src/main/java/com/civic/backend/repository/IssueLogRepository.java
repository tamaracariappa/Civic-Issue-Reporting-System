package com.civic.backend.repository;

import com.civic.backend.model.IssueLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IssueLogRepository extends JpaRepository<IssueLog, Integer> {
}
