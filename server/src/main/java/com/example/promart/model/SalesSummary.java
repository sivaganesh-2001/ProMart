package com.example.promart.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "sales_summary")
public class SalesSummary {

    @Id
    private String id;
    private String sellerId;
    private LocalDateTime lastUpdated;
    private List<ProductSalesData> topFastMoving = new ArrayList<>();
    private List<ProductSalesData> topSlowMoving = new ArrayList<>();

    public SalesSummary() {
    }

    public SalesSummary(String sellerId, LocalDateTime lastUpdated,
            List<ProductSalesData> topFastMoving,
            List<ProductSalesData> topSlowMoving) {
        this.sellerId = sellerId;
        this.lastUpdated = lastUpdated;
        this.topFastMoving = topFastMoving != null ? topFastMoving : new ArrayList<>();
        this.topSlowMoving = topSlowMoving != null ? topSlowMoving : new ArrayList<>();
    }

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
        return topFastMoving != null ? topFastMoving : new ArrayList<>();
    }

    public void setTopFastMoving(List<ProductSalesData> topFastMoving) {
        this.topFastMoving = topFastMoving != null ? topFastMoving : new ArrayList<>();
    }

    public List<ProductSalesData> getTopSlowMoving() {
        return topSlowMoving != null ? topSlowMoving : new ArrayList<>();
    }

    public void setTopSlowMoving(List<ProductSalesData> topSlowMoving) {
        this.topSlowMoving = topSlowMoving != null ? topSlowMoving : new ArrayList<>();
    }
}