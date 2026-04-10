package com.civic.backend.repository;

import com.civic.backend.model.IssueReport;
import java.math.BigDecimal;
import java.util.List;
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
}
