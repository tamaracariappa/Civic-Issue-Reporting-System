package com.civic.backend.repository;

import com.civic.backend.model.IssueCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IssueCategoryRepository extends JpaRepository<IssueCategory, Integer> {
}
