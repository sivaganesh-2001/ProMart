package com.example.promart.dto;

public class SalesComparisonResponse {
    private String label;
    private double onlineSales;
    private double offlineSales;

    public SalesComparisonResponse(String label, double onlineSales, double offlineSales) {
        this.label = label;
        this.onlineSales = onlineSales;
        this.offlineSales = offlineSales;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public double getOnlineSales() {
        return onlineSales;
    }

    public void setOnlineSales(double onlineSales) {
        this.onlineSales = onlineSales;
    }

    public double getOfflineSales() {
        return offlineSales;
    }

    public void setOfflineSales(double offlineSales) {
        this.offlineSales = offlineSales;
    }
}
