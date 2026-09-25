package com.aicodebugpredictor.controller;
import com.aicodebugpredictor.dto.CodeComparisonRequest;
import com.aicodebugpredictor.dto.CodeComparisonResponse;
import com.aicodebugpredictor.service.CodeComparisonService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/comparison")
@CrossOrigin(origins = "http://localhost:5173")
public class ComparisonController {
    private final CodeComparisonService codeComparisonService;
    public ComparisonController(
            CodeComparisonService codeComparisonService
    ) {
        this.codeComparisonService = codeComparisonService;
    }
  @PostMapping("/compare")
    public ResponseEntity<?> compareCode(
            @Valid
            @RequestBody
            CodeComparisonRequest request
    ) {
        try {
            CodeComparisonResponse response = codeComparisonService.compareCode(request );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            String message = e.getMessage() != null
                            ? e.getMessage()
                            : "Unable to compare code versions.";
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message",message));
        }
    }
    @GetMapping("/{comparisonId}")
    public ResponseEntity<?> getComparison(
            @PathVariable Long comparisonId
    ) {
        try {
            CodeComparisonResponse response = codeComparisonService.getComparisonById(comparisonId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            String message = e.getMessage() != null
                            ? e.getMessage()
                            : "Comparison not found.";
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", message ));
        }
    }
   @GetMapping("/history")
    public ResponseEntity<?> getComparisonHistory() {
        try {
            List<CodeComparisonResponse> history = codeComparisonService.getComparisonHistory();
            return ResponseEntity.ok( history);
        } catch (Exception e) {
            String message = e.getMessage() != null
                            ? e.getMessage()
                            : "Unable to load comparison history.";
            return ResponseEntity.badRequest().body(Map.of("message", message ));
        }
    }
    @DeleteMapping("/{comparisonId}")
    public ResponseEntity<?> deleteComparison(
            @PathVariable Long comparisonId
    ) {
        try {
            codeComparisonService.deleteComparison(comparisonId);
            return ResponseEntity.ok(Map.of("message","Comparison deleted successfully." ));
        } catch (Exception e) {
            String message = e.getMessage() != null
                            ? e.getMessage()
                            : "Unable to delete comparison.";
            return ResponseEntity.badRequest().body(Map.of("message",message));
        }
    }
    @DeleteMapping("/history")
    public ResponseEntity<?> deleteAllComparisons() {
        try {
            codeComparisonService.deleteAllComparisons();
            return ResponseEntity.ok(Map.of("message","Comparison history deleted successfully." ));
        } catch (Exception e) {
            String message = e.getMessage() != null
                            ? e.getMessage()
                            : "Unable to delete comparison history.";
            return ResponseEntity.badRequest().body(Map.of("message",message));
        }
    }
}