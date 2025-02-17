package com.example.promart.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/location")
public class LocationController {

    private final String GOOGLE_MAPS_API_KEY = "AIzaSyAiEvhHmhIdeKSVUF2DqUEVKdWi3LOOjIw";

    @GetMapping("/autocomplete")
    public ResponseEntity<String> getLocationSuggestions(@RequestParam String input) {
        String url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" + input +
                     "&key=" + GOOGLE_MAPS_API_KEY + "&components=country:in&types=(cities)";
        RestTemplate restTemplate = new RestTemplate();
        String response = restTemplate.getForObject(url, String.class);
        return ResponseEntity.ok(response);
    }
}
