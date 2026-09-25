package com.aicodebugpredictor.service;
import com.aicodebugpredictor.dto.CompareCodeRequest;
import com.aicodebugpredictor.dto.CompareCodeResponse;
import com.aicodebugpredictor.dto.CompareCodeResponse.ChangedLine;
import com.aicodebugpredictor.dto.CompareCodeResponse.PotentialIssue;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
@Service
public class CompareCodeService {
    public CompareCodeResponse compareCode(
            CompareCodeRequest request
    ) {

        String oldCode =
                request.getOldCode();

        String newCode =
                request.getNewCode();

        String language =
                request.getLanguage();

        String[] oldLines =
                oldCode.split("\\r?\\n");

        String[] newLines =
                newCode.split("\\r?\\n");


        CompareCodeResponse response =
                new CompareCodeResponse();

        response.setLanguage(language);


        int commonLines =
                Math.min(
                        oldLines.length,
                        newLines.length
                );

        int unchangedLines = 0;

        List<ChangedLine> changedLines =
                new ArrayList<>();

        List<Integer> newLineNumbers =
                new ArrayList<>();


        for (int i = 0; i < commonLines; i++) {

            String oldLine =
                    oldLines[i].trim();

            String newLine =
                    newLines[i].trim();


            if (oldLine.equals(newLine)) {

                unchangedLines++;

            } else {

                changedLines.add(
                        new ChangedLine(
                                i + 1,
                                "changed",
                                newLines[i]
                        )
                );
            }
        }


        int addedLines =
                Math.max(
                        0,
                        newLines.length -
                        oldLines.length
                );


        int removedLines =
                Math.max(
                        0,
                        oldLines.length -
                        newLines.length
                );


        if (newLines.length > oldLines.length) {

            for (
                    int i = oldLines.length;
                    i < newLines.length;
                    i++
            ) {

                int lineNumber =
                        i + 1;

                newLineNumbers.add(
                        lineNumber
                );

                changedLines.add(
                        new ChangedLine(
                                lineNumber,
                                "added",
                                newLines[i]
                        )
                );
            }
        }


        if (oldLines.length > newLines.length) {

            for (
                    int i = newLines.length;
                    i < oldLines.length;
                    i++
            ) {

                changedLines.add(
                        new ChangedLine(
                                i + 1,
                                "removed",
                                oldLines[i]
                        )
                );
            }
        }



        List<PotentialIssue> oldIssues =
                detectIssues(
                        oldLines,
                        language
                );


        List<PotentialIssue> newIssues =
                detectIssues(
                        newLines,
                        language
                );

        List<PotentialIssue> newPotentialIssues =
                findNewIssues(
                        oldIssues,
                        newIssues
                );

        int oldRiskScore =
                calculateRiskScore(
                        oldIssues
                );

        int newRiskScore =
                calculateRiskScore(
                        newIssues
                );


        int riskDifference =
                newRiskScore -
                oldRiskScore;


        String riskChange =
                calculateRiskChange(
                        riskDifference
                );

        int oldQualityScore =
                calculateQualityScore(
                        oldCode,
                        oldIssues
                );

        int newQualityScore =
                calculateQualityScore(
                        newCode,
                        newIssues
                );


        int qualityDifference =
                newQualityScore -
                oldQualityScore;


        String qualityChange =
                calculateQualityChange(
                        qualityDifference
                );

        response.setAddedLines(
                addedLines
        );

        response.setRemovedLines(
                removedLines
        );

        response.setUnchangedLines(
                unchangedLines
        );

        response.setNewLines(
                newLineNumbers
        );

        response.setChangedLines(
                changedLines
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

        response.setOldCodeQualityScore(
                oldQualityScore
        );

        response.setNewCodeQualityScore(
                newQualityScore
        );

        response.setQualityDifference(
                qualityDifference
        );

        response.setQualityChange(
                qualityChange
        );

        response.setNewPotentialIssues(
                newPotentialIssues
        );


        return response;
    }


    
    private List<PotentialIssue> detectIssues(
            String[] lines,
            String language
    ) {

        List<PotentialIssue> issues =
                new ArrayList<>();


        for (int i = 0; i < lines.length; i++) {

            String line =
                    lines[i];

            String lowerLine =
                    line.toLowerCase();

            if (
                    lowerLine.contains("todo") ||
                    lowerLine.contains("fixme")
            ) {

                issues.add(
                        new PotentialIssue(
                                i + 1,
                                "Unresolved TODO/FIXME",
                                "Medium",
                                "Code Quality",
                                "The code contains a TODO or FIXME marker that may indicate unfinished work.",
                                "Complete the pending task or remove the TODO/FIXME marker."
                        )
                );
            }

            if (
                    (
                            language.equalsIgnoreCase(
                                    "javascript"
                            )
                            ||
                            language.equalsIgnoreCase(
                                    "typescript"
                            )
                    )
                    &&
                    lowerLine.contains(
                            "console.log"
                    )
            ) {

                issues.add(
                        new PotentialIssue(
                                i + 1,
                                "Console logging detected",
                                "Low",
                                "Code Quality",
                                "Console logging is present in the code.",
                                "Remove debugging logs or replace them with a proper logging mechanism before production."
                        )
                );
            }


            if (
                    language.equalsIgnoreCase(
                            "java"
                    )
                    &&
                    line.contains(
                            "System.out.println"
                    )
            ) {

                issues.add(
                        new PotentialIssue(
                                i + 1,
                                "System output detected",
                                "Low",
                                "Code Quality",
                                "Direct console output is being used.",
                                "Consider using a structured logging framework."
                        )
                );
            }


            if (
                    (
                            language.equalsIgnoreCase(
                                    "javascript"
                            )
                            ||
                            language.equalsIgnoreCase(
                                    "typescript"
                            )
                    )
                    &&
                    lowerLine.matches(
                            ".*\\bvar\\b.*"
                    )
            ) {

                issues.add(
                        new PotentialIssue(
                                i + 1,
                                "Legacy var declaration",
                                "Medium",
                                "Maintainability",
                                "The code uses var, which has function scope and can increase accidental variable-related bugs.",
                                "Prefer let or const depending on whether reassignment is required."
                        )
                );
            }

            if (
                    (
                            lowerLine.contains("==")
                            &&
                            !lowerLine.contains("===")
                    )
                    &&
                    (
                            language.equalsIgnoreCase(
                                    "javascript"
                            )
                            ||
                            language.equalsIgnoreCase(
                                    "typescript"
                            )
                    )
            ) {

                issues.add(
                        new PotentialIssue(
                                i + 1,
                                "Loose equality comparison",
                                "Medium",
                                "Logic Error",
                                "The code appears to use loose equality, which can perform implicit type conversion.",
                                "Use strict equality (===) when appropriate."
                        )
                );
            }

            if (
                    language.equalsIgnoreCase(
                            "java"
                    )
                    &&
                    lowerLine.contains(
                            "catch (exception"
                    )
            ) {

                issues.add(
                        new PotentialIssue(
                                i + 1,
                                "Broad exception handling",
                                "Medium",
                                "Exception Handling",
                                "A broad Exception type is being caught.",
                                "Catch the specific exceptions that the operation can actually produce."
                        )
                );
            }

            if (
                    language.equalsIgnoreCase(
                            "python"
                    )
                    &&
                    lowerLine.trim().startsWith(
                            "print("
                    )
            ) {

                issues.add(
                        new PotentialIssue(
                                i + 1,
                                "Print statement detected",
                                "Low",
                                "Code Quality",
                                "A print statement is present in the code.",
                                "Use a proper logging mechanism where appropriate."
                        )
                );
            }

            if (
                    language.equalsIgnoreCase(
                            "python"
                    )
                    &&
                    lowerLine.trim().equals(
                            "except:"
                    )
            ) {

                issues.add(
                        new PotentialIssue(
                                i + 1,
                                "Bare exception handler",
                                "High",
                                "Exception Handling",
                                "A bare except block catches almost every exception.",
                                "Catch specific exception types instead."
                        )
                );
            }

            if (
                    lowerLine.contains(
                            "password"
                    )
                    &&
                    (
                            lowerLine.contains("=")
                            ||
                            lowerLine.contains(":")
                    )
            ) {

                issues.add(
                        new PotentialIssue(
                                i + 1,
                                "Possible hard-coded password",
                                "High",
                                "Security",
                                "The line may contain a password or credential directly in source code.",
                                "Store credentials securely using environment variables or a secrets manager."
                        )
                );
            }
        }


        return issues;
    }

    private List<PotentialIssue> findNewIssues(
            List<PotentialIssue> oldIssues,
            List<PotentialIssue> newIssues
    ) {

        Set<String> oldIssueKeys =
                new HashSet<>();


        for (
                PotentialIssue issue :
                oldIssues
        ) {

            String key =
                    issue.getTitle()
                    + "|"
                    + issue.getBugType();

            oldIssueKeys.add(key);
        }


        List<PotentialIssue> result =
                new ArrayList<>();


        for (
                PotentialIssue issue :
                newIssues
        ) {

            String key =
                    issue.getTitle()
                    + "|"
                    + issue.getBugType();


            if (
                    !oldIssueKeys.contains(
                            key
                    )
            ) {

                result.add(issue);
            }
        }


        return result;
    }

    private int calculateRiskScore(
            List<PotentialIssue> issues
    ) {

        int score = 0;


        for (
                PotentialIssue issue :
                issues
        ) {

            String severity =
                    issue.getSeverity();


            if (
                    "High".equalsIgnoreCase(
                            severity
                    )
            ) {

                score += 20;

            } else if (
                    "Medium".equalsIgnoreCase(
                            severity
                    )
            ) {

                score += 10;

            } else {

                score += 5;
            }
        }


        return Math.min(
                100,
                score
        );
    }

    private int calculateQualityScore(
            String code,
            List<PotentialIssue> issues
    ) {

        int score = 100;


        score -=
                issues.size() * 5;


        String[] lines =
                code.split("\\r?\\n");


        if (lines.length > 200) {

            score -= 10;

        } else if (lines.length > 100) {

            score -= 5;
        }


        return Math.max(
                0,
                Math.min(
                        100,
                        score
                )
        );
    }

   

    private String calculateRiskChange(
            int difference
    ) {

        if (difference > 0) {

            return "Risk Increased";

        }

        if (difference < 0) {

            return "Risk Decreased";
        }

        return "Risk Unchanged";
    }

    private String calculateQualityChange(
            int difference
    ) {

        if (difference > 0) {

            return "Quality Improved";

        }

        if (difference < 0) {

            return "Quality Decreased";
        }

        return "Quality Unchanged";
    }
}

