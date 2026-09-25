package com.aicodebugpredictor.repository;
import com.aicodebugpredictor.entity.CodeComparison;
import com.aicodebugpredictor.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface CodeComparisonRepository
        extends JpaRepository<CodeComparison, Long> {
    List<CodeComparison> findByUserOrderByCreatedAtDesc(User user);
    Optional<CodeComparison> findByIdAndUser(Long id,User user);
}