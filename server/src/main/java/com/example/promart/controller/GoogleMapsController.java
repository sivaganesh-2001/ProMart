package com.example.promart.controller;

import com.example.promart.service.GoogleMapsService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import java.util.Map;

@RestController
@RequestMapping("/api/maps")
@CrossOrigin(origins = "http://localhost:3000")
public class GoogleMapsController {

    private final GoogleMapsService googleMapsService;
    private final RestTemplate restTemplate = new RestTemplate();
    private final String apiKey = "AIzaSyAiEvhHmhIdeKSVUF2DqUEVKdWi3LOOjIw";

    public GoogleMapsController(GoogleMapsService googleMapsService) {
        this.googleMapsService = googleMapsService;
    }

    @GetMapping("/autocomplete")
    public ResponseEntity<String> getPlaceSuggestions(
            @RequestParam String input,
            @RequestParam double lat,
            @RequestParam double lng) {
    
        String[] radiusLevels = {"5000", "20000", "50000", "100000"}; // Expanding search range (5km → 20km → 50km → 100km)
    
        for (String radius : radiusLevels) {
            String url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input="
                    + input + "&location=" + lat + "," + lng
                    + "&radius=" + radius + "&key=" + apiKey;
    
            String response = restTemplate.getForObject(url, String.class);
    
            if (response != null && !response.contains("\"predictions\":[]")) {
                return ResponseEntity.ok(response);
            }
        }
    
        // If no results in expanding radius, fetch suggestions without location bias
        String generalUrl = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input="
                + input + "&key=" + apiKey;
        String generalResponse = restTemplate.getForObject(generalUrl, String.class);
        
        // Fetch nearby places based on popularity
        String nearbyUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + lat + "," + lng
                + "&radius=5000&keyword=" + input + "&key=" + apiKey; // Adjust radius and keyword as needed
        String nearbyResponse = restTemplate.getForObject(nearbyUrl, String.class);
        
        // Combine responses if needed
        return ResponseEntity.ok(generalResponse + nearbyResponse);
    }

    @GetMapping("/place/details")
public ResponseEntity<String> getPlaceDetails(@RequestParam String placeId) {
    String url = "https://maps.googleapis.com/maps/api/place/details/json?place_id=" + placeId + "&key=" + apiKey;
    String response = restTemplate.getForObject(url, String.class);
    return ResponseEntity.ok(response);
}
}