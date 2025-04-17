package com.example.promart.model;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "sales_summary")
public class SalesSummary {

    @Id
    private String id;
    private String sellerId;
    private LocalDateTime lastUpdated;
    private List<ProductSalesData> topFastMoving;
    private List<ProductSalesData> topSlowMoving;

    // Constructors
    public SalesSummary() {
    }

    public SalesSummary(String sellerId, LocalDateTime lastUpdated,
            List<ProductSalesData> topFastMoving,
            List<ProductSalesData> topSlowMoving) {
        this.sellerId = sellerId;
        this.lastUpdated = lastUpdated;
        this.topFastMoving = topFastMoving;
        this.topSlowMoving = topSlowMoving;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSellerId() {
        return sellerId;
    }

    public void setSellerId(String sellerId) {
        this.sellerId = sellerId;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public List<ProductSalesData> getTopFastMoving() {
        return topFastMoving;
    }

    public void setTopFastMoving(List<ProductSalesData> topFastMoving) {
        this.topFastMoving = topFastMoving;
    }

    public List<ProductSalesData> getTopSlowMoving() {
        return topSlowMoving;
    }

    public void setTopSlowMoving(List<ProductSalesData> topSlowMoving) {
        this.topSlowMoving = topSlowMoving;
    }
}
