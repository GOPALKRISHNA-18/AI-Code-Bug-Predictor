package com.aicodebugpredictor.controller;
import com.aicodebugpredictor.dto.AnalysisResponse;
import com.aicodebugpredictor.dto.CodeAnalysisRequest;
import com.aicodebugpredictor.service.CodeAnalysisService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/analysis")
@CrossOrigin(origins = "http://localhost:5173")
public class AnalysisController {
    private final CodeAnalysisService codeAnalysisService;
    public AnalysisController(
           CodeAnalysisService codeAnalysisService
    ) {
        this.codeAnalysisService = codeAnalysisService;
    }
    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeCode(
            @Valid @RequestBody CodeAnalysisRequest request
    ) {
        try {
            AnalysisResponse response =
                    codeAnalysisService.analyzeCode(
                            request
                    );
            return ResponseEntity.ok(
                    response
            );
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(
                            e.getMessage()
                    );
        }
    }
    @GetMapping("/history")
    public ResponseEntity<?> getAnalysisHistory() {
        try {
            List<AnalysisResponse> history =  codeAnalysisService
                            .getAnalysisHistory();
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(
                            e.getMessage()
                    );
        }
    }
    @DeleteMapping("/history")
    public ResponseEntity<?> deleteAllHistory() {
        try {
            codeAnalysisService
                    .deleteAllAnalysesForCurrentUser();
            Map<String, String> response = new HashMap<>();
            response.put("message","Analysis history deleted successfully.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put( "message", e.getMessage());
            return ResponseEntity
                    .badRequest()
                    .body(response);
        }
    }
    @GetMapping("/{analysisId}")
    public ResponseEntity<?> getAnalysisById(
            @PathVariable Long analysisId
    ) {
        try {
            AnalysisResponse response = codeAnalysisService
                            .getAnalysisById( analysisId );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity
                    .notFound()
                    .build();
        }
   }
    @DeleteMapping("/{analysisId}")
    public ResponseEntity<?> deleteAnalysis(
            @PathVariable Long analysisId
    ) {
        try {
            codeAnalysisService.deleteAnalysis(analysisId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Analysis deleted successfully.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity
                    .badRequest()
                    .body(response);
        }
    }
}