package com.example.promart.controller;

import java.util.Collections;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.example.promart.repository.MBATransactionRepository;
import com.example.promart.service.MBAService;

@RestController
@RequestMapping("/api/mba")
public class MBAController {

    private static final Logger logger = LoggerFactory.getLogger(MBAController.class);

    @Autowired
    private MBAService mbaService;

    @Autowired
    private MBATransactionRepository mbaTransactionRepository;

    @Value("${flask.api.url}")
    private String flaskApiUrl;

    private final RestTemplate restTemplate;

    public MBAController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        logger.info("MBAController initialized with flaskApiUrl: {}", flaskApiUrl);
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        logger.info("Test endpoint /api/mba/test called");
        return ResponseEntity.ok("MBAController is active");
    }

    @GetMapping("/generate")
    public ResponseEntity<String> generateTransactions() {
        logger.info("Received GET /api/mba/generate");
        try {
            mbaService.generateMBATransactions();
            long count = mbaTransactionRepository.count();
            logger.info("Generated {} transactions", count);
            return ResponseEntity.ok("{\"message\": \"Generated " + count + " transactions successfully\"}");
        } catch (Exception e) {
            logger.error("Failed to generate transactions: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Failed to generate transactions: " + e.getMessage() + "\"}");
        }
    }

    // @PostMapping("/generate")
    // public ResponseEntity<String> generateTransactionsPost() {
    // logger.info("Received POST /api/mba/generate");
    // try {
    // mbaService.generateMBATransactions();
    // long count = mbaTransactionRepository.count();
    // logger.info("Generated {} transactions", count);
    // return ResponseEntity.ok("{\"message\": \"Generated " + count + "
    // transactions successfully\"}");
    // } catch (Exception e) {
    // logger.error("Failed to generate transactions: {}", e.getMessage());
    // return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
    // .body("{\"error\": \"Failed to generate transactions: " + e.getMessage() +
    // "\"}");
    // }
    // }

    @GetMapping("/transactions")
    public ResponseEntity<List<List<String>>> getTransactions() {
        logger.info("Received GET /api/mba/transactions");
        try {
            List<List<String>> transactions = mbaService.getAllTransactions();
            logger.info("Returning {} transactions", transactions.size());
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            logger.error("Error fetching transactions: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/train")
    public ResponseEntity<String> trainMBA() {
        logger.info("Received GET /api/mba/train, forwarding to {}", flaskApiUrl + "/train");
        try {
            String url = flaskApiUrl + "/train";
            HttpHeaders headers = new HttpHeaders();
            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            logger.info("Flask response: {}", response.getBody());
            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
        } catch (RestClientException e) {
            logger.error("Failed to train MBA: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Failed to train MBA model: " + e.getMessage() + "\"}");
        }
    }

    @PostMapping("/predict")
    public ResponseEntity<String> predictMBA(@RequestBody String requestBody) {
        logger.info("Received POST /api/mba/predict with body: {}", requestBody);
        try {
            String url = flaskApiUrl + "/predict";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
            logger.info("Flask response: {}", response.getBody());
            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
        } catch (RestClientException e) {
            logger.error("Failed to predict MBA: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Failed to predict MBA recommendations: " + e.getMessage() + "\"}");
        }
    }
}