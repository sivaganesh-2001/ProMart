package com.example.promart.service;

import com.example.promart.model.MasterProduct;
import com.example.promart.model.Product;
import com.example.promart.dto.RecommendationResponse;
import com.example.promart.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.example.promart.repository.MasterProductRepository;
import java.util.List;

@Service
public class RecommendationService {

    private static final Logger logger = LoggerFactory.getLogger(RecommendationService.class);

    private final RestTemplate restTemplate;
    private final ProductRepository productRepository;
    private final MasterProductRepository masterProductRepository;

    @Value("${flask.recommendation.url}")
    private String flaskApiUrl;

    public RecommendationService(RestTemplate restTemplate, ProductRepository productRepository,
            MasterProductRepository masterProductRepository) {
        this.restTemplate = restTemplate;
        this.productRepository = productRepository;
        this.masterProductRepository = masterProductRepository;
    }

    public List<MasterProduct> getRecommendations(String email) {
        // Prepare request to Flask API
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        String requestBody = "{\"email\": \"" + email + "\"}";
        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

        // Log the request
        logger.info("Calling Flask API at {} with request: {}", flaskApiUrl, requestBody);

        // Call Flask API
        RecommendationResponse response = restTemplate.exchange(
                flaskApiUrl,
                HttpMethod.POST,
                entity,
                RecommendationResponse.class).getBody();

        // Log the response
        logger.info("Flask API response: {}", response);

        if (response == null || !"success".equals(response.getStatus())) {
            logger.error("Failed to fetch recommendations: {}", response != null ? response.getError() : "No response");
            throw new RuntimeException(response != null ? response.getError() : "Failed to fetch recommendations");
        }

        // Fetch product details from database
        List<String> masterIds = response.getRecommendations();
        logger.info("Recommended masterIds: {}", masterIds);

        List<MasterProduct> products = masterProductRepository.findAllById(masterIds);
        logger.info("Products fetched from DB: {}", products);

        return products;
    }
}