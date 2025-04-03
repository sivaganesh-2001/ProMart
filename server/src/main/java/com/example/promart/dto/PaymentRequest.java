package com.example.promart.dto;

public class PaymentRequest {
    private int amount;
    private String currency;
    private String receipt;

    public int getAmount() {
        return amount;
    }
    public void setAmount(int amount) {
        this.amount = amount;
    }
    public String getCurrency() {
        return currency;
    }
    public void setCurrency(String currency) {
        this.currency = currency;
    }
    public String getReceipt() {
        return receipt;
    }
    public void setReceipt(String receipt) {
        this.receipt = receipt;
    }
}
