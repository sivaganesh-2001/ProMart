package com.example.promart.model;

import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "mba_rules")
public class MBARule {
    private List<String> antecedents;
    private List<String> consequents;
    private double confidence;
    private double lift;

    // Getters and Setters
    public List<String> getAntecedents() { return antecedents; }
    public void setAntecedents(List<String> antecedents) { this.antecedents = antecedents; }

    public List<String> getConsequents() { return consequents; }
    public void setConsequents(List<String> consequents) { this.consequents = consequents; }

    public double getConfidence() { return confidence; }
    public void setConfidence(double confidence) { this.confidence = confidence; }

    public double getLift() { return lift; }
    public void setLift(double lift) { this.lift = lift; }
}
