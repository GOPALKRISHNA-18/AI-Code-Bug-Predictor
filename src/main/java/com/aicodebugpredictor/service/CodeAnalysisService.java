package com.aicodebugpredictor.service;
import com.aicodebugpredictor.dto.AnalysisResponse;
import com.aicodebugpredictor.dto.CodeAnalysisRequest;
import com.aicodebugpredictor.entity.Analysis;
import com.aicodebugpredictor.entity.BugPrediction;
import com.aicodebugpredictor.entity.User;
import com.aicodebugpredictor.repository.AnalysisRepository;
import com.aicodebugpredictor.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;
@Service
public class CodeAnalysisService {
    private final AnalysisRepository analysisRepository;
    private final UserRepository userRepository;
    public CodeAnalysisService(AnalysisRepository analysisRepository,UserRepository userRepository) {
        this.analysisRepository = analysisRepository;
        this.userRepository = userRepository;
    }
    public AnalysisResponse analyzeCode(CodeAnalysisRequest request) {
        String language = request.getLanguage() == null ? "" : request.getLanguage().toLowerCase();
        String code = request.getCode();
        if (code == null) {
            code = "";
        }
        List<AnalysisResponse.BugPrediction> bugs =  new ArrayList<>();
        String[] lines = code.split("\\r?\\n", -1);
        int totalLines = lines.length;
        int blankLines = countBlankLines(lines);
        int commentLines = countCommentLines(language,lines);
        int codeLines = totalLines - blankLines - commentLines;
        if (codeLines < 0) {
            codeLines = 0;
        }
        int functionCount = countFunctions(language,code);
        int classCount = countClasses(language,code);
        int decisionPoints = countDecisionPoints(language,code);
        int cyclomaticComplexity = 1 + decisionPoints;
        String complexityLevel = calculateComplexityLevel(cyclomaticComplexity);
        for (int i = 0; i < lines.length; i++) {
            String line = lines[i];
            String trimmedLine = line.trim();
            if (trimmedLine.isEmpty()) {
                continue;
            }
            detectCommonIssues(language,trimmedLine,i + 1,bugs);
        }
        int totalBugs = bugs.size();
           int riskScore = calculateRiskScore(totalBugs,totalLines,cyclomaticComplexity);
             int qualityScore = calculateQualityScore(totalBugs,totalLines,codeLines,commentLines,functionCount,classCount,cyclomaticComplexity);
        String overallRisk = calculateRiskLevel(riskScore);
                User user =  getCurrentUser();
        Analysis analysis =  new Analysis();
        analysis.setProjectName(request.getProjectName());
        analysis.setLanguage(request.getLanguage());
        analysis.setFileName(request.getFileName());
       analysis.setSourceCode(code);
        analysis.setRiskScore(riskScore);
        analysis.setCodeQualityScore(qualityScore);
        analysis.setTotalBugs(totalBugs);
        analysis.setOverallRisk(overallRisk);
        analysis.setTotalLines(totalLines);
        analysis.setCodeLines(codeLines);
        analysis.setCommentLines(commentLines);
        analysis.setBlankLines(blankLines);
        analysis.setFunctionCount(functionCount);
        analysis.setClassCount(classCount);
        analysis.setDecisionPoints(decisionPoints);
        analysis.setCyclomaticComplexity(cyclomaticComplexity);
        analysis.setComplexityLevel(complexityLevel);
        analysis.setUser(user);
         for ( AnalysisResponse.BugPrediction bug : bugs) {
            BugPrediction bugEntity =  new BugPrediction();
            bugEntity.setLineNumber(bug.getLineNumber());
            bugEntity.setBugType(bug.getBugType());
            bugEntity.setSeverity(bug.getSeverity());
            bugEntity.setTitle(bug.getTitle());
            bugEntity.setDescription(bug.getDescription());
            bugEntity.setSuggestion(bug.getSuggestion());
            bugEntity.setConfidence(bug.getConfidence());
            analysis.addBug(bugEntity);
        }
          Analysis savedAnalysis =  analysisRepository.save(analysis);
          return convertToResponse(savedAnalysis);
    }
      private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User is not authenticated.");
        }
        String email = authentication.getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Authenticated user not found."));
    }
      private AnalysisResponse convertToResponse(Analysis analysis) {
        List<AnalysisResponse.BugPrediction> bugs =  new ArrayList<>();
        for (BugPrediction bug : analysis.getBugs()) {
            bugs.add(new AnalysisResponse.BugPrediction(
                            bug.getLineNumber(),
                            bug.getBugType(),
                            bug.getSeverity(),
                            bug.getTitle(),
                            bug.getDescription(),
                            bug.getSuggestion(),
                            bug.getConfidence()
                    )
            );
        }

        return new AnalysisResponse(
                analysis.getId(),
                analysis.getProjectName(),
                analysis.getLanguage(),
                analysis.getFileName(),
                analysis.getSourceCode(),
                analysis.getRiskScore(),
                analysis.getCodeQualityScore(),
                analysis.getTotalBugs(),
                analysis.getOverallRisk(),
                bugs,
                analysis.getTotalLines(),
                analysis.getCodeLines(),
                analysis.getCommentLines(),
                analysis.getBlankLines(),
                analysis.getFunctionCount(),
                analysis.getClassCount(),
                analysis.getDecisionPoints(),
                analysis.getCyclomaticComplexity(),
                analysis.getComplexityLevel()
        );
    }

      private void detectCommonIssues(String language,String line,int lineNumber,
            List<AnalysisResponse.BugPrediction> bugs
    ) {
        String lowerLine = line.toLowerCase();
            if (lowerLine.contains("todo") || lowerLine.contains("fixme")) {
            bugs.add(
                    new AnalysisResponse.BugPrediction(
                            lineNumber,
                            "Code Smell",
                            "LOW",
                            "Pending code task detected",
                            "This line contains a TODO or FIXME marker. It may indicate incomplete implementation.",
                            "Review the pending task and complete or remove the TODO/FIXME comment.",
                            91
                    )
            );
        }
            if (language.equals("javascript") || language.equals("typescript")) {
            if (lowerLine.contains("console.log")) {
                bugs.add(
                        new AnalysisResponse.BugPrediction(
                                lineNumber,
                                "Code Quality",
                                "LOW",
                                "Console statement detected",
                                "A console statement is present in the source code.",
                                "Remove unnecessary console statements before production deployment.",
                                88
                        )
                );
            }

            if (lowerLine.contains("==") && !lowerLine.contains("===") && !lowerLine.contains("!=")) {
                bugs.add(
                        new AnalysisResponse.BugPrediction(
                                lineNumber,
                                "Logic Risk",
                                "MEDIUM",
                                "Loose equality detected",
                                "Loose equality can perform implicit type conversion.",
                                "Consider using strict equality (===) where appropriate.",
                                86
                        )
                );
            }
            if (lowerLine.contains("var ")) {
                bugs.add(
                        new AnalysisResponse.BugPrediction(
                                lineNumber,
                                "Code Quality",
                                "LOW",
                                "var declaration detected",
                                "The var keyword has function scope and can lead to unexpected behavior.",
                                "Prefer let or const where appropriate.",
                                84
                        )
                );
            }
            if (lowerLine.contains("eval(")) {
                bugs.add(
                        new AnalysisResponse.BugPrediction(
                                lineNumber,
                                "Security",
                                "HIGH",
                                "Dangerous eval usage detected",
                                "The eval function can execute dynamically constructed code and may introduce security vulnerabilities.",
                                "Avoid eval and use safer alternatives.",
                                95
                        )
                );
            }

            if (lowerLine.contains("innerhtml")) {
                bugs.add(
                        new AnalysisResponse.BugPrediction(
                                lineNumber,
                                "Security",
                                "MEDIUM",
                                "Potential unsafe HTML injection",
                                "Directly assigning HTML can introduce cross-site scripting risks when the content is not trusted.",
                                "Prefer textContent or sanitize untrusted HTML before rendering.",
                                87
                        )
                );
            }
        }

         if (language.equals("java")) {
            if (lowerLine.contains("system.out.println")) {
                bugs.add(
                        new AnalysisResponse.BugPrediction(
                                lineNumber,
                                "Code Quality",
                                "LOW",
                                "System.out.println detected",
                                "Direct console output is often unsuitable for production applications.",
                                "Use a logging framework such as SLF4J.",
                                87
                        )
                );
            }
            if (lowerLine.contains("catch (exception")) {
                bugs.add(
                        new AnalysisResponse.BugPrediction(
                                lineNumber,
                                "Exception Handling",
                                "MEDIUM",
                                "Broad exception handling detected",
                                "Catching a broad Exception can hide the actual cause of an error.",
                                "Catch the specific exception types that the operation can actually produce.",
                                89
                        )
                );
            }
        }
               if (language.equals("python")) {
            if (lowerLine.startsWith("print(")) {
                bugs.add(
                        new AnalysisResponse.BugPrediction(
                                lineNumber,
                                "Code Quality",
                                "LOW",
                                "Print statement detected",
                                "Direct print statements may be inappropriate for production applications.",
                                "Consider using the Python logging module.",
                                82
                        )
                );
            }

            if (lowerLine.contains("except:")) {
                bugs.add(
                        new AnalysisResponse.BugPrediction(
                                lineNumber,
                                "Exception Handling",
                                "MEDIUM",
                                "Bare except detected",
                                "A bare except catches almost every exception and can hide programming errors.",
                                "Catch specific exception types instead.",
                                94
                        )
                );
            }

            if (lowerLine.contains("eval(")) {
                bugs.add(
                        new AnalysisResponse.BugPrediction(
                                lineNumber,
                                "Security",
                                "HIGH",
                                "Dangerous eval usage detected",
                                "The eval function can execute dynamically constructed Python code.",
                                "Avoid eval and use safer parsing or validation techniques.",
                                94
                        )
                );
            }
        }
       if (language.equals("c") || language.equals("c++") || language.equals("cpp")) {
            if (lowerLine.contains("gets(")) {
                bugs.add(
                        new AnalysisResponse.BugPrediction(
                                lineNumber,
                                "Security",
                                "HIGH",
                                "Unsafe gets() function detected",
                                "gets() can cause buffer overflow because it does not limit input size.",
                                "Use fgets() with an appropriate buffer size.",
                                97
                        )
                );
            }
            if (lowerLine.contains("strcpy(")) {
                bugs.add(
                        new AnalysisResponse.BugPrediction(
                                lineNumber,
                                "Security",
                                "MEDIUM",
                                "Potential unsafe string copy",
                                "strcpy does not perform automatic destination buffer size checking.",
                                "Use a bounded alternative and validate buffer sizes.",
                                88
                        )
                );
            }
        }
                if (language.equals("c#") || language.equals("csharp")) {
            if (lowerLine.contains("console.writeline")) {
                bugs.add(
                        new AnalysisResponse.BugPrediction(
                                lineNumber,
                                "Code Quality",
                                "LOW",
                                "Console output detected",
                                "Direct console output may not be suitable for production applications.",
                                "Use a structured logging framework.",
                                85
                        )
                );
            }
        }
        if (language.equals("php")) {
            if (lowerLine.contains("mysql_query(")) {
                bugs.add(
                        new AnalysisResponse.BugPrediction(
                                lineNumber,
                                "Security",
                                "HIGH",
                                "Legacy database API detected",
                                "The mysql_query API is obsolete and can expose applications to unsafe database practices.",
                                "Use PDO or MySQLi with prepared statements.",
                                95
                        )
                );
            }
            if (lowerLine.contains("eval(")) {
                bugs.add(
                        new AnalysisResponse.BugPrediction(
                                lineNumber,
                                "Security",
                                "HIGH",
                                "Dangerous eval usage detected",
                                "eval can execute dynamically constructed PHP code.",
                                "Avoid eval and use safer application logic.",
                                95
                        )
                );
            }
        }
          if (language.equals("go")) {
            if (lowerLine.contains("fmt.println")) {
                bugs.add(
                        new AnalysisResponse.BugPrediction(
                                lineNumber,
                                "Code Quality",
                                "LOW",
                                "Direct console output detected",
                                "Direct console output may not be appropriate for production services.",
                                "Consider using a structured logging package.",
                                82
                        )
                );
            }
        }

          if (lowerLine.contains("password") && lowerLine.contains("=") && (lowerLine.contains("\"") || lowerLine.contains("'"))) {
            bugs.add(
                    new AnalysisResponse.BugPrediction(
                            lineNumber,
                            "Security",
                            "HIGH",
                            "Possible hard-coded credential",
                            "A password-like value appears to be assigned directly in the source code.",
                            "Use environment variables or a secure secret management solution.",
                            93
                    )
            );
        }
        if ((lowerLine.contains("apikey") || lowerLine.contains("api_key") || lowerLine.contains("secretkey") || lowerLine.contains("secret_key"))
                        && lowerLine.contains("=") && (lowerLine.contains("\"") || lowerLine.contains("'"))) {
            bugs.add(new AnalysisResponse.BugPrediction(
                            lineNumber,
                            "Security",
                            "HIGH",
                            "Possible hard-coded secret",
                            "A possible API key or secret value appears to be stored directly in the source code.",
                            "Move secrets to environment variables or a secure secret-management system.",
                            92
                    )
            );
        }
    }
        private int countBlankLines(String[] lines) {
        int count = 0;
        for (String line : lines ) {
            if (line.trim().isEmpty()) {
                count++;
            }
        }
        return count;
    }
        private int countCommentLines(String language, String[] lines) {
        int count = 0;
        boolean insideBlockComment =  false;
        for (String line : lines) {
            String trimmed = line.trim();
            if (trimmed.isEmpty()) {
                continue;
            }
            if (insideBlockComment) {
                count++;
                if (trimmed.contains("*/")) {
                    insideBlockComment = false;
                }
                continue;
            }
            if (trimmed.startsWith("/*") || trimmed.startsWith("/**")) {
                count++;
                if (
                        !trimmed.contains("*/")) {
                    insideBlockComment = true;
                }
                continue;
            }
            if (trimmed.startsWith("//") || trimmed.startsWith("*") ) {
                count++;
                continue;
            }
            if (language.equals("python") && trimmed.startsWith("#")) {
                count++;
            }
        }
        return count;
    }
        private int countFunctions(String language,String code) {
        if (code == null || code.isEmpty()) {
            return 0;
        }

        int count = 0;
        String lowerCode =  code.toLowerCase();
        if (language.equals("javascript") || language.equals("typescript")) {
            count += countOccurrences(lowerCode,"function ");
            count += countOccurrences(lowerCode, "=>");
        }

        else if (
                language.equals("python")
        ) {

            count = countOccurrences(lowerCode,"def " );
        }
        else if (
                language.equals("java")
        ) {

            count =  countJavaLikeMethods(code);
        }

        else {
            count = countGenericFunctions(code);
        }
        return count;
    }
    private int countClasses(String language,String code) {
        if (code == null || code.isEmpty()) {
            return 0;
        }
        String lowerCode = code.toLowerCase();
        int count = 0;
        if (language.equals("java")|| language.equals("c#") || language.equals("csharp")|| language.equals("c++")|| language.equals("cpp") || language.equals("python")|| language.equals("php")) {
            count = countOccurrences(lowerCode, "class ");
        }
        return count;
    }
        private int countDecisionPoints(String language,String code) {
        if (code == null || code.isEmpty()) {
            return 0;
        }
        String lowerCode = code.toLowerCase();
        int count = 0;
        count += countWordOccurrences(lowerCode, "if");
         count +=countOccurrences(lowerCode,"else if");
        count += countWordOccurrences(lowerCode,"for");
        count += countWordOccurrences(lowerCode,"while");
        count += countWordOccurrences(lowerCode,"case");
        count += countOccurrences(lowerCode,"&&");
        count += countOccurrences(lowerCode,"||");
        count += countOccurrences(lowerCode, "?");
        return count;
    }
    private int countGenericFunctions( String code) {
        String[] lines =  code.split("\\r?\\n");
        int count = 0;
        for ( String line : lines) {
            String trimmed = line.trim();
            if (trimmed.isEmpty()) {
                continue;
            }
            if (trimmed.contains("(") && trimmed.contains(")")) {
                String lower = trimmed.toLowerCase();
                if (
                        lower.startsWith("if ")
                                || lower.startsWith("if(")
                                || lower.startsWith("for ")
                                || lower.startsWith("for(")
                                || lower.startsWith("while ")
                                || lower.startsWith("while(")
                                || lower.startsWith("switch ")
                                || lower.startsWith("switch(")
                                || lower.startsWith("catch ")
                                || lower.startsWith("catch(")
                ) {

                    continue;
                }

                count++;
            }
        }

        return count;
    }

       private int countJavaLikeMethods( String code ) {
        String[] lines =  code.split("\\r?\\n");
        int count = 0;
        for (String line : lines) {
            String trimmed = line.trim();
            if ( trimmed.isEmpty()) {
                continue;
            }
            if (
                    trimmed.contains("(")
                            && trimmed.contains(")")
                            && (
                                trimmed.contains("public ")
                                        || trimmed.contains("private ")
                                        || trimmed.contains("protected ")
                                        || trimmed.contains("static ")
                            )
            ) {

                String lower = trimmed.toLowerCase();
                if (
                        lower.startsWith("if ")
                                || lower.startsWith("for ")
                                || lower.startsWith("while ")
                                || lower.startsWith("switch ")
                                || lower.startsWith("catch ")
                ) {

                    continue;
                }

                count++;
            }
        }

        return count;
    }

       private int countOccurrences( String text,String target) {
        if (
                text == null
                        || target == null
                        || target.isEmpty()
        ) {
            return 0;
        }

        int count = 0;
        int index = 0;
        while (
                (index =
                        text.indexOf(
                                target,
                                index
                        )) != -1
        ) {

            count++;
            index += target.length();
        }
        return count;
    }
        private int countWordOccurrences( String text,String word) {
        if (
                text == null
                        || word == null
                        || word.isEmpty()
        ) {
            return 0;
        }
        int count = 0;
        String[] tokens = text.split("[^a-zA-Z0-9_]+");
        for (
                String token
                : tokens
        ) {

            if (
                    token.equals(word)
            ) {

                count++;
            }
        }

        return count;
    }
       private String calculateComplexityLevel(
            int cyclomaticComplexity
    ) {

        if (
                cyclomaticComplexity <= 5
        ) {

            return "LOW";
        }

        if (
                cyclomaticComplexity <= 10
        ) {

            return "MODERATE";
        }

        if (
                cyclomaticComplexity <= 20
        ) {

            return "HIGH";
        }

        return "VERY HIGH";
    }

        private int calculateRiskScore(
            int totalBugs,
            int totalLines,
            int cyclomaticComplexity
    ) {

        if (
                totalLines <= 0
        ) {

            return 0;
        }

        int score = totalBugs * 12;
        double bugDensity = (double) totalBugs/ totalLines;
        if (
                bugDensity > 0.20
        ) {

            score += 25;

        } else if (
                bugDensity > 0.10
        ) {

            score += 15;

        } else if (
                bugDensity > 0.05
        ) {

            score += 8;
        }
        if (
                cyclomaticComplexity > 20
        ) {

            score += 25;

        } else if (
                cyclomaticComplexity > 10
        ) {

            score += 15;

        } else if (
                cyclomaticComplexity > 5
        ) {

            score += 8;
        }

        return Math.min(
                score,
                100
        );
    }

        private int calculateQualityScore(
            int totalBugs,
            int totalLines,
            int codeLines,
            int commentLines,
            int functionCount,
            int classCount,
            int cyclomaticComplexity
    ) {

        int score = 100;
        score -=
                Math.min(
                        totalBugs * 8,
                        40
                );
        if (
                cyclomaticComplexity > 20
        ) {

            score -= 25;

        } else if (
                cyclomaticComplexity > 10
        ) {

            score -= 15;

        } else if (
                cyclomaticComplexity > 5
        ) {

            score -= 8;
        }

        
        if (
                codeLines > 500
        ) {

            score -= 10;

        } else if (
                codeLines > 300
        ) {

            score -= 5;
        }

          if (
                codeLines > 50
                        && commentLines == 0
        ) {

            score -= 5;
        }
        if (
                functionCount > 30
        ) {

            score -= 8;

        } else if (
                functionCount > 15
        ) {

            score -= 4;
        }

            if (
                classCount > 10
        ) {

            score -= 5;
        }

        return Math.max(
                0,
                Math.min(
                        score,
                        100
                )
        );
    }

       private String calculateRiskLevel(
            int riskScore
    ) {

        if (
                riskScore >= 70
        ) {

            return "HIGH";
        }

        if (
                riskScore >= 40
        ) {

            return "MEDIUM";
        }

        return "LOW";
    }
    public List<AnalysisResponse> getAnalysisHistory() {

        User user =
                getCurrentUser();

        List<Analysis> analyses =
                analysisRepository
                        .findByUserOrderByCreatedAtDesc(
                                user
                        );

        List<AnalysisResponse> responses =
                new ArrayList<>();

        for (
                Analysis analysis
                : analyses
        ) {

            responses.add(
                    convertToResponse(
                            analysis
                    )
            );
        }

        return responses;
    }
    public AnalysisResponse getAnalysisById(
            Long analysisId
    ) {

        User user =
                getCurrentUser();

        Analysis analysis =
                analysisRepository
                        .findByIdAndUser(
                                analysisId,
                                user
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Analysis not found."
                                )
                        );

        return convertToResponse(
                analysis
        );
    }
    @Transactional
    public void deleteAnalysis(
            Long analysisId
    ) {

        User user =  getCurrentUser();
        Analysis analysis = analysisRepository.findByIdAndUser(analysisId, user).orElseThrow(() -> new RuntimeException("Analysis not found or you are not authorized to delete it."));
        analysisRepository.delete(analysis);
    }
    @Transactional
    public void deleteAllAnalysesForCurrentUser() {
        User user = getCurrentUser();
        List<Analysis> analyses = analysisRepository.findByUserOrderByCreatedAtDesc(user);
        if (
                analyses.isEmpty()
        ) {
            return;
        }

        analysisRepository.deleteAll(
                analyses
        );
    }
}