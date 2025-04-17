package com.example.promart.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "mba_transactions")
public class MBATransaction {
    @Id
    private String id;
    private List<String> masterIds;

    // Constructors
    public MBATransaction() {
    }

    public MBATransaction(List<String> masterIds) {
        this.masterIds = masterIds;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public List<String> getMasterIds() {
        return masterIds;
    }

    public void setMasterIds(List<String> masterIds) {
        this.masterIds = masterIds;
    }
}