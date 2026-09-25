package com.aicodebugpredictor.controller;
import com.aicodebugpredictor.dto.CompareCodeRequest;
import com.aicodebugpredictor.dto.CompareCodeResponse;
import com.aicodebugpredictor.service.CompareCodeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/compare")
@CrossOrigin(origins = "http://localhost:5173")
public class CompareCodeController {
    private final CompareCodeService codeCompareService;
    public CompareCodeController(
    		CompareCodeService codeCompareService
    ) {
        this.codeCompareService = codeCompareService;
    }
    @PostMapping
    public ResponseEntity<?> compareCode(
            @Valid
            @RequestBody
            CompareCodeRequest request
    ) {
        try {
            CompareCodeResponse response = codeCompareService.compareCode(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(
                            e.getMessage()
                    );
        }
    }
}

