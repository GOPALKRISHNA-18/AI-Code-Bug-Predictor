package com.aicodebugpredictor.repository;
import com.aicodebugpredictor.entity.BugPrediction;
import org.springframework.data.jpa.repository.JpaRepository;
public interface BugPredictionRepository
extends JpaRepository<BugPrediction, Long> {
}
