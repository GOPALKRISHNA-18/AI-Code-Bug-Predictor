package com.aicodebugpredictor.service;
import com.aicodebugpredictor.dto.BugAnalyticsResponse;
import com.aicodebugpredictor.dto.BugTypeCountResponse;
import com.aicodebugpredictor.dto.DashboardStatsResponse;
import com.aicodebugpredictor.dto.DashboardTrendResponse;
import com.aicodebugpredictor.dto.RecentAnalysisResponse;
import com.aicodebugpredictor.entity.Analysis;
import com.aicodebugpredictor.entity.BugPrediction;
import com.aicodebugpredictor.entity.User;
import com.aicodebugpredictor.repository.AnalysisRepository;
import com.aicodebugpredictor.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
@Service
public class DashboardStatsService {

   private final AnalysisRepository analysisRepository;

    private final UserRepository userRepository;

    public DashboardStatsService(
            AnalysisRepository analysisRepository,
            UserRepository userRepository
    ) {
        this.analysisRepository =
                analysisRepository;

        this.userRepository =
                userRepository;
    }

    public DashboardStatsResponse getDashboardStats() {

        User currentUser =
                getCurrentUser();

        List<Analysis> analyses =
                analysisRepository
                        .findByUserOrderByCreatedAtDesc(
                                currentUser
                        );

        DashboardStatsResponse response =
                new DashboardStatsResponse();

        long totalAnalyses =
                analyses.size();

        long bugsDetected =
                analyses.stream()
                        .mapToLong(
                                Analysis::getTotalBugs
                        )
                        .sum();
        double averageRisk = 0;

        if (!analyses.isEmpty()) {

            averageRisk =
                    analyses.stream()
                            .mapToInt(
                                    Analysis::getRiskScore
                            )
                            .average()
                            .orElse(0);
        }

        double averageCodeQuality = 0;

        if (!analyses.isEmpty()) {

            averageCodeQuality =
                    analyses.stream()
                            .mapToInt(
                                    Analysis::getCodeQualityScore
                            )
                            .average()
                            .orElse(0);
        }

       
        long highRiskCount =
                analyses.stream()
                        .filter(
                                analysis ->
                                        "HIGH".equalsIgnoreCase(
                                                analysis.getOverallRisk()
                                        )
                        )
                        .count();
        long mediumRiskCount =
                analyses.stream()
                        .filter(
                                analysis ->
                                        "MEDIUM".equalsIgnoreCase(
                                                analysis.getOverallRisk()
                                        )
                        )
                        .count();

               long lowRiskCount =
                analyses.stream()
                        .filter(
                                analysis ->
                                        "LOW".equalsIgnoreCase(
                                                analysis.getOverallRisk()
                                        )
                        )
                        .count();
        List<RecentAnalysisResponse>
                recentAnalyses =
                analyses.stream()
                        .limit(5)
                        .map(
                                this::convertToRecentAnalysis
                        )
                        .collect(
                                Collectors.toList()
                        );

        response.setTotalAnalyses(
                totalAnalyses
        );

        response.setBugsDetected(
                bugsDetected
        );

        response.setAverageRisk(
                Math.round(averageRisk)
        );

        response.setAverageCodeQuality(
                Math.round(averageCodeQuality)
        );

        response.setHighRiskAnalyses(
                highRiskCount
        );

        response.setMediumRiskAnalyses(
                mediumRiskCount
        );

        response.setLowRiskAnalyses(
                lowRiskCount
        );

        response.setRecentAnalyses(
                recentAnalyses
        );

        return response;
    }
    public List<DashboardTrendResponse>
    getDashboardTrend() {

        User currentUser =
                getCurrentUser();

        List<Analysis> analyses =
                analysisRepository
                        .findByUserOrderByCreatedAtDesc(
                                currentUser
                        );

        return analyses.stream()
                .limit(10)
                .map(
                        analysis ->
                                new DashboardTrendResponse(
                                        analysis.getId(),
                                        analysis.getProjectName(),
                                        analysis.getRiskScore(),
                                        analysis.getCodeQualityScore(),
                                        analysis.getTotalBugs(),
                                        analysis.getOverallRisk(),
                                        analysis.getCreatedAt()
                                )
                )
                .collect(
                        Collectors.toList()
                );
    }

       @Transactional(readOnly = true)
    public BugAnalyticsResponse getBugAnalytics() {

        User currentUser =
                getCurrentUser();

        List<Analysis> analyses =
                analysisRepository
                        .findByUserOrderByCreatedAtDesc(
                                currentUser
                        );

        long totalBugs = 0;

        long highSeverityBugs = 0;

        long mediumSeverityBugs = 0;

        long lowSeverityBugs = 0;
        Map<String, Long> bugTypeCounts =
                new HashMap<>();

       
        for (Analysis analysis : analyses) {

            if (analysis.getBugs() == null) {
                continue;
            }

           
            for (
                    BugPrediction bug :
                    analysis.getBugs()
            ) {

               
                totalBugs++;

               
                String severity =
                        bug.getSeverity();

                if (
                        "HIGH".equalsIgnoreCase(
                                severity
                        )
                ) {

                    highSeverityBugs++;

                } else if (
                        "MEDIUM".equalsIgnoreCase(
                                severity
                        )
                ) {

                    mediumSeverityBugs++;

                } else {

                    lowSeverityBugs++;
                }

               
                String bugType =
                        bug.getBugType();

                if (
                        bugType == null
                        || bugType.trim().isEmpty()
                ) {

                    bugType = "Other";
                }

               
                bugTypeCounts.put(
                        bugType,
                        bugTypeCounts.getOrDefault(
                                bugType,
                                0L
                        ) + 1
                );
            }
        }

               List<BugTypeCountResponse>
                bugTypes =
                bugTypeCounts.entrySet()
                        .stream()
                        .sorted(
                                (
                                        first,
                                        second
                                ) ->
                                        Long.compare(
                                                second.getValue(),
                                                first.getValue()
                                        )
                        )
                        .limit(10)
                        .map(
                                entry ->
                                        new BugTypeCountResponse(
                                                entry.getKey(),
                                                entry.getValue()
                                        )
                        )
                        .collect(
                                Collectors.toList()
                        );
        return new BugAnalyticsResponse(
                totalBugs,
                highSeverityBugs,
                mediumSeverityBugs,
                lowSeverityBugs,
                bugTypes
        );
    }

        private RecentAnalysisResponse
    convertToRecentAnalysis(
            Analysis analysis
    ) {

        return new RecentAnalysisResponse(
                analysis.getId(),
                analysis.getProjectName(),
                analysis.getLanguage(),
                analysis.getFileName(),
                analysis.getRiskScore(),
                analysis.getCodeQualityScore(),
                analysis.getTotalBugs(),
                analysis.getOverallRisk(),
                analysis.getCreatedAt()
        );
    }

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (
                authentication == null
                || !authentication.isAuthenticated()
        ) {

            throw new RuntimeException(
                    "User is not authenticated."
            );
        }

        String email =
                authentication.getName();

        return userRepository
                .findByEmail(email)
                .orElseThrow(
                        () ->
                                new RuntimeException(
                                        "Authenticated user was not found."
                                )
                );
    }
}