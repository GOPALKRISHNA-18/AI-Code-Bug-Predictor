package com.aicodebugpredictor.controller;
import com.aicodebugpredictor.dto.BugAnalyticsResponse;
import com.aicodebugpredictor.dto.DashboardStatsResponse;
import com.aicodebugpredictor.dto.DashboardTrendResponse;
import com.aicodebugpredictor.service.DashboardStatsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {
    private final DashboardStatsService dashboardStatsService;
    public DashboardController(DashboardStatsService dashboardStatsService) {
        this.dashboardStatsService = dashboardStatsService;
    }
    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
        try {
            DashboardStatsResponse response = dashboardStatsService.getDashboardStats();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/trend")
    public ResponseEntity<?> getDashboardTrend() {
        try {
            List<DashboardTrendResponse> response = dashboardStatsService.getDashboardTrend();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/bug-analytics")
    public ResponseEntity<?> getBugAnalytics() {
        try {
            BugAnalyticsResponse response = dashboardStatsService.getBugAnalytics();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}