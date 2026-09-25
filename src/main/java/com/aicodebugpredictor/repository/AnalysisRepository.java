package com.aicodebugpredictor.repository;
import com.aicodebugpredictor.entity.Analysis;
import com.aicodebugpredictor.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface AnalysisRepository
       extends JpaRepository<Analysis, Long> {
   List<Analysis> findByUserOrderByCreatedAtDesc(User user);
    Optional<Analysis> findByIdAndUser(Long id,User user);
}