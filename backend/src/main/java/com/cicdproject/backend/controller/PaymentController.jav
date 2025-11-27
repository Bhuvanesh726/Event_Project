package com.cicdproject.backend.controller;

import com.cicdproject.backend.model.OrderRequest;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @PostMapping("/create-order")
    public ResponseEntity<String> createOrder(@RequestBody OrderRequest orderRequest) {
        try {
            RazorpayClient razorpayClient = new RazorpayClient(keyId, keySecret);
            JSONObject orderRequestJson = new JSONObject();
            orderRequestJson.put("amount", orderRequest.getAmount() * 100);
            orderRequestJson.put("currency", "INR");
            orderRequestJson.put("receipt", "event_receipt_" + System.currentTimeMillis());
            Order order = razorpayClient.orders.create(orderRequestJson);
            return ResponseEntity.ok(order.toString());
        } catch (RazorpayException e) {
            System.err.println("RazorpayException: " + e.getMessage());
            return ResponseEntity.status(500).body("Error creating Razorpay order");
        }
    }
}