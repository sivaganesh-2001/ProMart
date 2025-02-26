package com.example.promart.model;

import java.util.List;
import java.time.LocalDate;
import java.time.YearMonth;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.example.promart.model.ProductSalesData;

@Document(collection = "sales_summary")
public class SalesSummary {

    @Id
    private String id;
    private String sellerId;  // Matches products with the same sellerId
    // private YearMonth monthYear;  // Stores Year and Month (e.g., 2025-02)
    private LocalDate saleDate; // Date when this summary was created

    private List<ProductSalesData> topBestSelling;  // Top 10 best-selling products
    private List<ProductSalesData> topLeastSelling; // Top 10 least-selling products

    // Constructors
    public SalesSummary() {}

    public SalesSummary(String sellerId,  LocalDate saleDate, 
                        List<ProductSalesData> topBestSelling, List<ProductSalesData> topLeastSelling) {
        this.sellerId = sellerId;
        this.saleDate = saleDate;
        this.topBestSelling = topBestSelling;
        this.topLeastSelling = topLeastSelling;
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


    public List<ProductSalesData> getTopBestSelling() {
        return topBestSelling;
    }

    public void setTopBestSelling(List<ProductSalesData> topBestSelling) {
        this.topBestSelling = topBestSelling;
    }

    public List<ProductSalesData> getTopLeastSelling() {
        return topLeastSelling;
    }

    public void setTopLeastSelling(List<ProductSalesData> topLeastSelling) {
        this.topLeastSelling = topLeastSelling;
    }

    public LocalDate getSaleDate() {
        return saleDate;
    }

    public void setSaleDate(LocalDate saleDate) {
        this.saleDate = saleDate;
    }
}
