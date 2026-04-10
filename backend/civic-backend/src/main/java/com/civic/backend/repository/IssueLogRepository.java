package com.civic.backend.repository;

import com.civic.backend.model.IssueLog;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IssueLogRepository extends JpaRepository<IssueLog, Integer> {

    List<IssueLog> findByIssueIssueIdOrderByTimestampAsc(Integer issueId);
}
