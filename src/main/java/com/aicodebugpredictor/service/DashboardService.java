package com.aicodebugpredictor.service;
import com.aicodebugpredictor.dto.DashboardStatsResponse;
import com.aicodebugpredictor.dto.RecentAnalysisResponse;
import com.aicodebugpredictor.entity.Analysis;
import com.aicodebugpredictor.entity.User;
import com.aicodebugpredictor.repository.AnalysisRepository;
import com.aicodebugpredictor.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
@Service
public class DashboardService {

    private final AnalysisRepository analysisRepository;

    private final UserRepository userRepository;

    public DashboardService(
            AnalysisRepository analysisRepository,
            UserRepository userRepository
    ) {
        this.analysisRepository =
                analysisRepository;

        this.userRepository =
                userRepository;
    }

    public DashboardStatsResponse getDashboardStats() {

        User user = getCurrentUser();

        List<Analysis> analyses =
                analysisRepository
                        .findByUserOrderByCreatedAtDesc(user);

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

        double averageCodeQuality = 0;

        if (!analyses.isEmpty()) {

            averageRisk =
                    analyses.stream()
                            .mapToInt(
                                    Analysis::getRiskScore
                            )
                            .average()
                            .orElse(0);

            averageCodeQuality =
                    analyses.stream()
                            .mapToInt(
                                    Analysis::getCodeQualityScore
                            )
                            .average()
                            .orElse(0);
        }

        long highRiskAnalyses =
                analyses.stream()
                        .filter(
                                analysis ->
                                        "HIGH".equalsIgnoreCase(
                                                analysis.getOverallRisk()
                                        )
                        )
                        .count();

        long mediumRiskAnalyses =
                analyses.stream()
                        .filter(
                                analysis ->
                                        "MEDIUM".equalsIgnoreCase(
                                                analysis.getOverallRisk()
                                        )
                        )
                        .count();

        long lowRiskAnalyses =
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
                        .map(this::convertToRecentResponse)
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
                highRiskAnalyses
        );

        response.setMediumRiskAnalyses(
                mediumRiskAnalyses
        );

        response.setLowRiskAnalyses(
                lowRiskAnalyses
        );

        response.setRecentAnalyses(
                recentAnalyses
        );

        return response;
    }

    private RecentAnalysisResponse
    convertToRecentResponse(
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
                authentication
                        .getName();

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

