package com.civic.backend.repository;

import com.civic.backend.model.IssueReport;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface IssueReportRepository extends JpaRepository<IssueReport, Integer> {

    @Query("""
            select ir
            from IssueReport ir
            join ir.location l
            where ir.parentIssue is null
              and l.latitude between :minLat and :maxLat
              and l.longitude between :minLng and :maxLng
            order by ir.createdAt desc
            """)
    List<IssueReport> findMasterIssuesInBoundingBox(
            @Param("minLat") BigDecimal minLat,
            @Param("maxLat") BigDecimal maxLat,
            @Param("minLng") BigDecimal minLng,
            @Param("maxLng") BigDecimal maxLng
    );

    @Query("""
            select ir
            from IssueReport ir
            where ir.parentIssue is null
            order by case ir.priorityLevel
                when 'CRITICAL' then 1
                when 'HIGH' then 2
                when 'MEDIUM' then 3
                when 'LOW' then 4
                else 5
            end,
            ir.createdAt desc
            """)
    List<IssueReport> findPublicMasterIssuesOrderByPriority();

    @Query("""
            select ir
            from IssueReport ir
            left join fetch ir.location
            left join fetch ir.category
            left join fetch ir.reporterUser
            where ir.issueId = :issueId
            """)
    Optional<IssueReport> findDetailsById(@Param("issueId") Integer issueId);
}
