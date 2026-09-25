package com.aicodebugpredictor.service;
import com.aicodebugpredictor.dto.CodeComparisonRequest;
import com.aicodebugpredictor.dto.CodeComparisonResponse;
import com.aicodebugpredictor.entity.CodeComparison;
import com.aicodebugpredictor.entity.User;
import com.aicodebugpredictor.repository.CodeComparisonRepository;
import com.aicodebugpredictor.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
@Service
public class CodeComparisonService {
    private final CodeComparisonRepository codeComparisonRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    public CodeComparisonService(
            CodeComparisonRepository codeComparisonRepository,
            UserRepository userRepository,
            ObjectMapper objectMapper
    ) {
        this.codeComparisonRepository =
                codeComparisonRepository;

        this.userRepository =
                userRepository;

        this.objectMapper =
                objectMapper;
    }

       @Transactional
    public CodeComparisonResponse compareCode(
            CodeComparisonRequest request
    ) {

        if (request == null) {
            throw new RuntimeException(
                    "Comparison request cannot be empty."
            );
        }

        if (request.getOldCode() == null ||
                request.getOldCode().trim().isEmpty()) {

            throw new RuntimeException(
                    "Old code is required."
            );
        }

        if (request.getNewCode() == null ||
                request.getNewCode().trim().isEmpty()) {

            throw new RuntimeException(
                    "New code is required."
            );
        }
        User currentUser = getCurrentUser();
        String language =
                normalizeLanguage(
                        request.getLanguage()
                );

        String oldCode =
                request.getOldCode();

        String newCode =
                request.getNewCode();

        String[] oldLines =
                oldCode.split("\\r?\\n", -1);

        String[] newLines =
                newCode.split("\\r?\\n", -1);
        ComparisonCounts counts =
                calculateLineChanges(
                        oldLines,
                        newLines
                );

               List<String> addedCode =
                getAddedCode(
                        oldLines,
                        newLines
                );

        List<String> removedCode =
                getRemovedCode(
                        oldLines,
                        newLines
                );

        List<String> modifiedCode =
                getModifiedCode(
                        oldLines,
                        newLines
                );

        List<CodeComparisonResponse.ComparisonIssue>
                newIssues =
                detectNewIssues(
                        oldCode,
                        newCode,
                        language
                );
        int oldRiskScore =
                calculateRiskScore(
                        oldCode,
                        language
                );

        int newRiskScore =
                calculateRiskScore(
                        newCode,
                        language
                );

        int riskDifference =
                newRiskScore - oldRiskScore;

        String riskChange =
                calculateRiskChange(
                        riskDifference
                );

        CodeComparisonResponse response =
                new CodeComparisonResponse();

        response.setProjectName(
                request.getProjectName()
        );

        response.setLanguage(
                language
        );

        response.setOldFileName(
                request.getOldFileName()
        );

        response.setNewFileName(
                request.getNewFileName()
        );

        response.setAddedLines(
                counts.addedLines
        );

        response.setRemovedLines(
                counts.removedLines
        );

        response.setModifiedLines(
                counts.modifiedLines
        );

        response.setUnchangedLines(
                counts.unchangedLines
        );

        response.setOldTotalLines(
                oldLines.length
        );

        response.setNewTotalLines(
                newLines.length
        );

        response.setNewBugs(
                newIssues.size()
        );

        response.setOldRiskScore(
                oldRiskScore
        );

        response.setNewRiskScore(
                newRiskScore
        );

        response.setRiskDifference(
                riskDifference
        );

        response.setRiskChange(
                riskChange
        );

        response.setAddedCode(
                addedCode
        );

        response.setRemovedCode(
                removedCode
        );

        response.setModifiedCode(
                modifiedCode
        );

        response.setNewIssues(
                newIssues
        );
        CodeComparison comparison =
                new CodeComparison();

        comparison.setProjectName(
                request.getProjectName()
        );

        comparison.setLanguage(
                language
        );

        comparison.setOldFileName(
                request.getOldFileName()
        );

        comparison.setNewFileName(
                request.getNewFileName()
        );

        comparison.setOldCode(
                oldCode
        );

        comparison.setNewCode(
                newCode
        );

        comparison.setAddedLines(
                counts.addedLines
        );

        comparison.setRemovedLines(
                counts.removedLines
        );

        comparison.setModifiedLines(
                counts.modifiedLines
        );

        comparison.setUnchangedLines(
                counts.unchangedLines
        );

        comparison.setOldTotalLines(
                oldLines.length
        );

        comparison.setNewTotalLines(
                newLines.length
        );

        comparison.setNewBugs(
                newIssues.size()
        );

        comparison.setOldRiskScore(
                oldRiskScore
        );

        comparison.setNewRiskScore(
                newRiskScore
        );

        comparison.setRiskDifference(
                riskDifference
        );

        comparison.setRiskChange(
                riskChange
        );
        comparison.setAddedCode(
                convertToJson(addedCode)
        );

        comparison.setRemovedCode(
                convertToJson(removedCode)
        );

        comparison.setModifiedCode(
                convertToJson(modifiedCode)
        );

        comparison.setNewIssues(
                convertToJson(newIssues)
        );
        comparison.setUser(
                currentUser
        );

         CodeComparison savedComparison =
                codeComparisonRepository.save(
                        comparison
                );

        response.setComparisonId(
                savedComparison.getId()
        );

        return response;
    }

     @Transactional(readOnly = true)
    public CodeComparisonResponse getComparisonById(
            Long comparisonId
    ) {

        User currentUser =
                getCurrentUser();

        CodeComparison comparison =
                codeComparisonRepository
                        .findByIdAndUser(
                                comparisonId,
                                currentUser
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Comparison not found."
                                )
                        );

        return convertEntityToResponse(
                comparison
        );
    }

   
    @Transactional(readOnly = true)
    public List<CodeComparisonResponse>
    getComparisonHistory() {

        User currentUser =
                getCurrentUser();

        List<CodeComparison> comparisons =
                codeComparisonRepository
                        .findByUserOrderByCreatedAtDesc(
                                currentUser
                        );

        List<CodeComparisonResponse> responses =
                new ArrayList<>();

        for (CodeComparison comparison :
                comparisons) {

            responses.add(
                    convertEntityToResponse(
                            comparison
                    )
            );
        }

        return responses;
    }
    @Transactional
    public void deleteComparison(
            Long comparisonId
    ) {

        User currentUser =
                getCurrentUser();

        CodeComparison comparison =
                codeComparisonRepository
                        .findByIdAndUser(
                                comparisonId,
                                currentUser
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Comparison not found."
                                )
                        );

        codeComparisonRepository.delete(
                comparison
        );
    }
    @Transactional
    public void deleteAllComparisons() {

        User currentUser =
                getCurrentUser();

        List<CodeComparison> comparisons =
                codeComparisonRepository
                        .findByUserOrderByCreatedAtDesc(
                                currentUser
                        );

        if (!comparisons.isEmpty()) {

            codeComparisonRepository.deleteAll(
                    comparisons
            );
        }
    }

        private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated() ||
                authentication.getName() == null) {

            throw new RuntimeException(
                    "Authenticated user not found."
            );
        }

        return userRepository
                .findByEmail(
                        authentication.getName()
                )
                .orElseThrow(
                        () -> new RuntimeException(
                                "User not found."
                        )
                );
    }
    private CodeComparisonResponse
    convertEntityToResponse(
            CodeComparison comparison
    ) {

        CodeComparisonResponse response =
                new CodeComparisonResponse();

        response.setComparisonId(
                comparison.getId()
        );

        response.setProjectName(
                comparison.getProjectName()
        );

        response.setLanguage(
                comparison.getLanguage()
        );

        response.setOldFileName(
                comparison.getOldFileName()
        );

        response.setNewFileName(
                comparison.getNewFileName()
        );

        response.setAddedLines(
                comparison.getAddedLines()
        );

        response.setRemovedLines(
                comparison.getRemovedLines()
        );

        response.setModifiedLines(
                comparison.getModifiedLines()
        );

        response.setUnchangedLines(
                comparison.getUnchangedLines()
        );

        response.setOldTotalLines(
                comparison.getOldTotalLines()
        );

        response.setNewTotalLines(
                comparison.getNewTotalLines()
        );

        response.setNewBugs(
                comparison.getNewBugs()
        );

        response.setOldRiskScore(
                comparison.getOldRiskScore()
        );

        response.setNewRiskScore(
                comparison.getNewRiskScore()
        );

        response.setRiskDifference(
                comparison.getRiskDifference()
        );

        response.setRiskChange(
                comparison.getRiskChange()
        );

        response.setAddedCode(
                convertJsonToList(
                        comparison.getAddedCode()
                )
        );

        response.setRemovedCode(
                convertJsonToList(
                        comparison.getRemovedCode()
                )
        );

        response.setModifiedCode(
                convertJsonToList(
                        comparison.getModifiedCode()
                )
        );

        response.setNewIssues(
                convertJsonToIssues(
                        comparison.getNewIssues()
                )
        );

        return response;
    }

     private ComparisonCounts calculateLineChanges(
            String[] oldLines,
            String[] newLines
    ) {

        int oldLength =
                oldLines.length;

        int newLength =
                newLines.length;

        int commonLength =
                Math.min(
                        oldLength,
                        newLength
                );

        int modifiedLines = 0;
        int unchangedLines = 0;

        for (int i = 0; i < commonLength; i++) {

            if (oldLines[i].equals(
                    newLines[i]
            )) {

                unchangedLines++;

            } else {

                modifiedLines++;
            }
        }

        int addedLines =
                Math.max(
                        0,
                        newLength - oldLength
                );

        int removedLines =
                Math.max(
                        0,
                        oldLength - newLength
                );

        ComparisonCounts counts =
                new ComparisonCounts();

        counts.addedLines =
                addedLines;

        counts.removedLines =
                removedLines;

        counts.modifiedLines =
                modifiedLines;

        counts.unchangedLines =
                unchangedLines;

        return counts;
    }
  
    private List<String> getAddedCode(
            String[] oldLines,
            String[] newLines
    ) {

        List<String> result =
                new ArrayList<>();

        Set<String> oldSet =
                new HashSet<>(
                        Arrays.asList(oldLines)
                );

        for (String line : newLines) {

            if (!oldSet.contains(line)) {

                result.add(line);
            }
        }

        return result;
    }

       private List<String> getRemovedCode(
            String[] oldLines,
            String[] newLines
    ) {

        List<String> result =
                new ArrayList<>();

        Set<String> newSet =
                new HashSet<>(
                        Arrays.asList(newLines)
                );

        for (String line : oldLines) {

            if (!newSet.contains(line)) {

                result.add(line);
            }
        }

        return result;
    }

      private List<String> getModifiedCode(
            String[] oldLines,
            String[] newLines
    ) {

        List<String> result =
                new ArrayList<>();

        int commonLength =
                Math.min(
                        oldLines.length,
                        newLines.length
                );

        for (int i = 0; i < commonLength; i++) {

            if (!oldLines[i].equals(
                    newLines[i]
            )) {

                result.add(
                        "OLD: " + oldLines[i]
                );

                result.add(
                        "NEW: " + newLines[i]
                );
            }
        }

        return result;
    }

       private List<CodeComparisonResponse.ComparisonIssue>
    detectNewIssues(
            String oldCode,
            String newCode,
            String language
    ) {

        List<CodeComparisonResponse.ComparisonIssue>
                issues =
                new ArrayList<>();

        String[] oldLines =
                oldCode.split(
                        "\\r?\\n",
                        -1
                );

        String[] newLines =
                newCode.split(
                        "\\r?\\n",
                        -1
                );

        Set<String> oldPatterns =
                detectPatterns(
                        oldLines,
                        language
                );

        for (int i = 0;
             i < newLines.length;
             i++) {

            String line =
                    newLines[i];

            String pattern =
                    findPattern(
                            line,
                            language
                    );

            if (pattern == null) {
                continue;
            }

            String patternKey =
                    pattern + ":" + line.trim();

            if (oldPatterns.contains(
                    patternKey
            )) {
                continue;
            }

            CodeComparisonResponse.ComparisonIssue issue =
                    createIssue(
                            i + 1,
                            pattern,
                            line
                    );

            if (issue != null) {
                issues.add(issue);
            }
        }

        return issues;
    }
    private Set<String> detectPatterns(
            String[] lines,
            String language
    ) {

        Set<String> patterns =
                new HashSet<>();

        for (String line : lines) {

            String pattern =
                    findPattern(
                            line,
                            language
                    );

            if (pattern != null) {

                patterns.add(
                        pattern + ":" + line.trim()
                );
            }
        }

        return patterns;
    }
   
    private String findPattern(
            String line,
            String language
    ) {

        if (line == null) {
            return null;
        }

        String value =
                line.trim();

        if (value.isEmpty()) {
            return null;
        }

        String lower =
                value.toLowerCase();

        if (lower.contains("todo") ||
                lower.contains("fixme")) {

            return "TODO";
        }

        if (containsPasswordPattern(value)) {

            return "HARDCODED_PASSWORD";
        }

        if (containsSecretPattern(value)) {

            return "HARDCODED_SECRET";
        }

          if (language.equals("java")) {

            if (value.contains(
                    "System.out.println"
            )) {

                return "SYSTEM_OUT";
            }

            if (lower.contains(
                    "catch (exception"
            )) {

                return "GENERIC_CATCH";
            }

            if (value.matches(
                    ".*\\b\\w+\\s*==\\s*\".*\".*"
            )) {

                return "STRING_COMPARISON";
            }
        }
      

        if (language.equals("javascript") ||
                language.equals("typescript")) {

            if (lower.contains(
                    "console.log"
            )) {

                return "CONSOLE_LOG";
            }

            if (lower.contains(
                    "eval("
            )) {

                return "EVAL";
            }

            if (lower.contains(
                    "innerhtml"
            )) {

                return "INNER_HTML";
            }

            if (lower.matches(
                    ".*\\bvar\\b.*"
            )) {

                return "VAR_USAGE";
            }

            if (value.contains("==") &&
                    !value.contains("===")) {

                return "LOOSE_EQUALITY";
            }
        }
        if (language.equals("python")) {

            if (lower.startsWith(
                    "print("
            )) {

                return "PRINT_STATEMENT";
            }

            if (lower.equals("except:") ||
                    lower.startsWith(
                            "except:"
                    )) {

                return "BARE_EXCEPT";
            }

            if (lower.contains(
                    "eval("
            )) {

                return "EVAL";
            }
        }
       
        if (language.equals("c") ||
                language.equals("cpp")) {

            if (lower.contains(
                    "gets("
            )) {

                return "UNSAFE_GETS";
            }

            if (lower.contains(
                    "strcpy("
            )) {

                return "UNSAFE_STRCPY";
            }
        }

          if (language.equals("csharp")) {

            if (value.contains(
                    "Console.WriteLine"
            )) {

                return "CONSOLE_WRITE";
            }
        }

        

        if (language.equals("php")) {

            if (lower.contains(
                    "mysql_query("
            )) {

                return "MYSQL_QUERY";
            }

            if (lower.contains(
                    "eval("
            )) {

                return "EVAL";
            }
        }

        
        if (language.equals("go")) {

            if (value.contains(
                    "fmt.Println"
            )) {

                return "FMT_PRINTLN";
            }
        }

        return null;
    }

    
    private CodeComparisonResponse.ComparisonIssue
    createIssue(
            int lineNumber,
            String pattern,
            String line
    ) {

        CodeComparisonResponse.ComparisonIssue issue =
                new CodeComparisonResponse.ComparisonIssue();

        issue.setLineNumber(
                lineNumber
        );

        issue.setType(
                getIssueType(pattern)
        );

        issue.setSeverity(
                getIssueSeverity(pattern)
        );

        issue.setMessage(
                getIssueMessage(pattern)
        );

        issue.setSuggestion(
                getIssueSuggestion(pattern)
        );

        return issue;
    }

   
    private String getIssueType(
            String pattern
    ) {

        switch (pattern) {

            case "HARDCODED_PASSWORD":
                return "Hard-coded Password";

            case "HARDCODED_SECRET":
                return "Hard-coded Secret";

            case "SYSTEM_OUT":
                return "Debug Output";

            case "GENERIC_CATCH":
                return "Generic Exception Handling";

            case "STRING_COMPARISON":
                return "String Comparison";

            case "CONSOLE_LOG":
                return "Debug Console Statement";

            case "EVAL":
                return "Dynamic Code Execution";

            case "INNER_HTML":
                return "Unsafe HTML Manipulation";

            case "VAR_USAGE":
                return "Variable Declaration";

            case "LOOSE_EQUALITY":
                return "Loose Equality";

            case "BARE_EXCEPT":
                return "Bare Exception Handling";

            case "UNSAFE_GETS":
                return "Unsafe Input Function";

            case "UNSAFE_STRCPY":
                return "Unsafe String Copy";

            case "CONSOLE_WRITE":
                return "Debug Output";

            case "MYSQL_QUERY":
                return "Legacy Database Query";

            case "FMT_PRINTLN":
                return "Debug Output";

            case "PRINT_STATEMENT":
                return "Print Statement";

            case "TODO":
                return "Incomplete Code";

            default:
                return "Code Issue";
        }
    }
   
    private String getIssueSeverity(
            String pattern
    ) {

        switch (pattern) {

            case "HARDCODED_PASSWORD":
            case "HARDCODED_SECRET":
            case "EVAL":
            case "UNSAFE_GETS":
                return "High";

            case "INNER_HTML":
            case "UNSAFE_STRCPY":
            case "GENERIC_CATCH":
            case "STRING_COMPARISON":
            case "LOOSE_EQUALITY":
            case "BARE_EXCEPT":
                return "Medium";

            default:
                return "Low";
        }
    }
   

    private String getIssueMessage(
            String pattern
    ) {

        switch (pattern) {

            case "HARDCODED_PASSWORD":
                return "A password appears to be directly stored in the source code.";

            case "HARDCODED_SECRET":
                return "A possible API key, secret, token, or access key appears to be hard-coded.";

            case "SYSTEM_OUT":
                return "System.out.println may be leftover debugging output.";

            case "GENERIC_CATCH":
                return "A generic Exception catch block may hide specific application errors.";

            case "STRING_COMPARISON":
                return "The code appears to compare strings using ==.";

            case "CONSOLE_LOG":
                return "console.log may be leftover debugging output.";

            case "EVAL":
                return "eval() executes dynamically supplied code and can introduce security risks.";

            case "INNER_HTML":
                return "innerHTML can introduce unsafe HTML or script content when handling untrusted input.";

            case "VAR_USAGE":
                return "var has function scope and may make variable behavior harder to control.";

            case "LOOSE_EQUALITY":
                return "Loose equality can perform implicit type conversion.";

            case "BARE_EXCEPT":
                return "A bare except block catches every exception without identifying the expected error.";

            case "UNSAFE_GETS":
                return "gets() does not safely limit input size and can cause buffer overflow.";

            case "UNSAFE_STRCPY":
                return "strcpy() does not automatically check the destination buffer size.";

            case "CONSOLE_WRITE":
                return "Console.WriteLine may be leftover debugging output.";

            case "MYSQL_QUERY":
                return "mysql_query is a legacy database API and should not be used in modern PHP applications.";

            case "FMT_PRINTLN":
                return "fmt.Println may be leftover debugging output.";

            case "PRINT_STATEMENT":
                return "A print statement may be leftover debugging output.";

            case "TODO":
                return "The code contains a TODO or FIXME marker that may indicate incomplete work.";

            default:
                return "A potential code quality issue was detected.";
        }
    }

    
    private String getIssueSuggestion(
            String pattern
    ) {

        switch (pattern) {

            case "HARDCODED_PASSWORD":
                return "Use environment variables or a secure secrets manager.";

            case "HARDCODED_SECRET":
                return "Move secrets and API credentials outside the source code.";

            case "SYSTEM_OUT":
                return "Use a proper logging framework or remove unnecessary debug output.";

            case "GENERIC_CATCH":
                return "Catch specific exception types and handle them appropriately.";

            case "STRING_COMPARISON":
                return "Use .equals() for Java String value comparison.";

            case "CONSOLE_LOG":
                return "Remove debug logging or use an appropriate logging solution.";

            case "EVAL":
                return "Avoid eval() and use safer alternatives.";

            case "INNER_HTML":
                return "Prefer safe DOM APIs or sanitize untrusted HTML before rendering.";

            case "VAR_USAGE":
                return "Prefer let or const where appropriate.";

            case "LOOSE_EQUALITY":
                return "Prefer strict equality (===) when appropriate.";

            case "BARE_EXCEPT":
                return "Catch the specific exceptions your code expects.";

            case "UNSAFE_GETS":
                return "Use a bounded input function such as fgets().";

            case "UNSAFE_STRCPY":
                return "Use a safer alternative with explicit buffer-size handling.";

            case "CONSOLE_WRITE":
                return "Remove debug output or use a structured logging solution.";

            case "MYSQL_QUERY":
                return "Use PDO or MySQLi with prepared statements.";

            case "FMT_PRINTLN":
                return "Remove unnecessary debug output or use structured logging.";

            case "PRINT_STATEMENT":
                return "Remove unnecessary print statements or use appropriate logging.";

            case "TODO":
                return "Complete the pending task or remove the marker.";

            default:
                return "Review the code and apply an appropriate safer implementation.";
        }
    }

     private int calculateRiskScore(
            String code,
            String language
    ) {

        if (code == null ||
                code.trim().isEmpty()) {

            return 0;
        }

        String[] lines =
                code.split(
                        "\\r?\\n",
                        -1
                );

        int score = 0;

        for (String line : lines) {

            String pattern =
                    findPattern(
                            line,
                            language
                    );

            if (pattern == null) {
                continue;
            }

            switch (pattern) {

                case "HARDCODED_PASSWORD":
                case "HARDCODED_SECRET":
                case "EVAL":
                case "UNSAFE_GETS":
                    score += 20;
                    break;

                case "INNER_HTML":
                case "UNSAFE_STRCPY":
                case "GENERIC_CATCH":
                case "STRING_COMPARISON":
                case "LOOSE_EQUALITY":
                case "BARE_EXCEPT":
                    score += 10;
                    break;

                default:
                    score += 5;
                    break;
            }
        }

        return Math.min(
                score,
                100
        );
    }

   
    private String calculateRiskChange(
            int riskDifference
    ) {

        if (riskDifference > 0) {

            return "Risk increased by "
                    + riskDifference
                    + " points.";

        }

        if (riskDifference < 0) {

            return "Risk decreased by "
                    + Math.abs(
                            riskDifference
                    )
                    + " points.";
        }

        return "No significant change.";
    }

  
    private boolean containsPasswordPattern(
            String line
    ) {

        return line.matches(
                ".*\\b(password|passwd|pwd)\\s*=\\s*[\"'].*[\"'].*"
        );
    }

   
    private boolean containsSecretPattern(
            String line
    ) {

        return line.matches(
                ".*\\b(api[_-]?key|secret[_-]?key|access[_-]?key|token)\\s*=\\s*[\"'].*[\"'].*"
        );
    }

        private String normalizeLanguage(
            String language
    ) {

        if (language == null) {
            return "unknown";
        }

        String value =
                language
                        .trim()
                        .toLowerCase();

        switch (value) {

            case "js":
                return "javascript";

            case "ts":
                return "typescript";

            case "c++":
                return "cpp";

            case "c#":
                return "csharp";

            case "py":
                return "python";

            default:
                return value;
        }
    }

       private String convertToJson(
            Object value
    ) {

        try {

            return objectMapper.writeValueAsString(
                    value
            );

        } catch (JsonProcessingException e) {

            return "[]";
        }
    }

       private List<String> convertJsonToList(
            String json
    ) {

        if (json == null ||
                json.trim().isEmpty()) {

            return new ArrayList<>();
        }

        try {

            return objectMapper.readValue(
                    json,
                    objectMapper
                            .getTypeFactory()
                            .constructCollectionType(
                                    List.class,
                                    String.class
                            )
            );

        } catch (Exception e) {

            return new ArrayList<>();
        }
    }

     private List<CodeComparisonResponse.ComparisonIssue>
    convertJsonToIssues(
            String json
    ) {

        if (json == null ||
                json.trim().isEmpty()) {

            return new ArrayList<>();
        }

        try {

            return objectMapper.readValue(
                    json,
                    objectMapper
                            .getTypeFactory()
                            .constructCollectionType(
                                    List.class,
                                    CodeComparisonResponse
                                            .ComparisonIssue.class
                            )
            );

        } catch (Exception e) {

            return new ArrayList<>();
        }
    }

        private static class ComparisonCounts {

        private int addedLines;

        private int removedLines;

        private int modifiedLines;

        private int unchangedLines;
    }
}