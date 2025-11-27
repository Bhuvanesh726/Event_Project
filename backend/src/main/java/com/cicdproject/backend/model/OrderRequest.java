package com.cicdproject.backend.model;

public class OrderRequest {
    private double amount;

    public OrderRequest() {
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }
}