package com.example.promart.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import java.util.Map;

@Service
public class GoogleMapsService {
    
    @Value("${google.maps.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    // Fetch Place Autocomplete
    public Map<String, Object> getPlaceAutocomplete(String input) {
        String url = "https://maps.googleapis.com/maps/api/place/autocomplete/json" +
                     "?input=" + input +
                     "&key=" + apiKey +
                     "&location=12.9716,77.5946&radius=5000"; // Default to Bangalore

        ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
        return response.getBody();
    }

    // Fetch Place Details
    public Map<String, Object> getPlaceDetails(String placeId) {
        String url = "https://maps.googleapis.com/maps/api/place/details/json" +
                     "?place_id=" + placeId +
                     "&key=" + apiKey;

        ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
        return response.getBody();
    }
}
