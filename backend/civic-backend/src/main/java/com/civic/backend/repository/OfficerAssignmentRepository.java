package com.civic.backend.repository;

import com.civic.backend.model.OfficerAssignment;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OfficerAssignmentRepository extends JpaRepository<OfficerAssignment, Integer> {

    @Query("""
            select oa
            from OfficerAssignment oa
            where oa.role.roleId = :roleId
              and (oa.ward.wardId = :wardId or oa.ward is null)
              and oa.assignedFrom <= :now
              and (oa.assignedUntil is null or oa.assignedUntil >= :now)
            order by case when oa.ward.wardId = :wardId then 0 else 1 end, oa.assignmentId asc
            """)
    Optional<OfficerAssignment> findActiveByRoleAndWardWithFallback(
            @Param("roleId") Integer roleId,
            @Param("wardId") Integer wardId,
            @Param("now") LocalDateTime now
    );
}
