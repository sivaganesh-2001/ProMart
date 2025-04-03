package com.example.promart.service;
import com.example.promart.dto.PaymentRequest;
import com.example.promart.dto.PaymentVerificationRequest;
import com.example.promart.repository.PaymentRepository;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import okhttp3.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentService {
    private final PaymentRepository paymentRepository;

    @Autowired
    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Value("${razorpay.key.id}")
    private String RAZORPAY_KEY_ID;

    @Value("${razorpay.key.secret}")
    private String RAZORPAY_KEY_SECRET;

    private final OkHttpClient client = new OkHttpClient();

    public ResponseEntity<Map<String, Object>> createOrder(PaymentRequest paymentRequest) throws IOException {
        JsonObject json = new JsonObject();
        json.addProperty("amount", paymentRequest.getAmount());
        json.addProperty("currency", paymentRequest.getCurrency());
        json.addProperty("receipt", paymentRequest.getReceipt());
    
        RequestBody body = RequestBody.create(
                json.toString(),
                MediaType.parse("application/json")
        );
    
        Request request = new Request.Builder()
                .url("https://api.razorpay.com/v1/orders")
                .post(body)
                .addHeader("Authorization", Credentials.basic(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
                .build();
    
        try (Response response = client.newCall(request).execute()) {
            if (response.isSuccessful() && response.body() != null) {
                String responseData = response.body().string();
                JsonObject responseJson = JsonParser.parseString(responseData).getAsJsonObject();
    
                // Debugging: Print the response
                System.out.println("Razorpay API Response: " + responseJson.toString());
    
                // Convert JsonObject to Map safely
                Map<String, Object> responseMap = new HashMap<>();
                responseJson.entrySet().forEach(entry -> {
                    if (entry.getValue().isJsonPrimitive()) {
                        responseMap.put(entry.getKey(), entry.getValue().getAsString());
                    } else {
                        responseMap.put(entry.getKey(), entry.getValue().toString()); // Handle arrays/objects safely
                    }
                });
    
                return ResponseEntity.ok(responseMap);
            } else {
                return ResponseEntity.status(response.code()).body(null);
            }
        }
    }
    

    public ResponseEntity<String> verifySignature(PaymentVerificationRequest verificationRequest) {
        try {
            String payload = verificationRequest.getOrderId() + "|" + verificationRequest.getPaymentId();
            Mac sha256HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(RAZORPAY_KEY_SECRET.getBytes(), "HmacSHA256");
            sha256HMAC.init(secretKey);
            String generatedSignature = Base64.getEncoder().encodeToString(sha256HMAC.doFinal(payload.getBytes()));

            if (generatedSignature.equals(verificationRequest.getSignature())) {
                return ResponseEntity.ok("Payment verified successfully");
            } else {
                return ResponseEntity.badRequest().body("Invalid signature");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Verification failed");
        }
    }
}
