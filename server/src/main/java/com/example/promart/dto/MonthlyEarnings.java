package com.example.promart.dto;

public class MonthlyEarnings {
    private int month;
    private double totalEarnings;

    public MonthlyEarnings(int month, double totalEarnings) {
        this.month = month;
        this.totalEarnings = totalEarnings;
    }

    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public double getTotalEarnings() {
        return totalEarnings;
    }

    public void setTotalEarnings(double totalEarnings) {
        this.totalEarnings = totalEarnings;
    }
}
