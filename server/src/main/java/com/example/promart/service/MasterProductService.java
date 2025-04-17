package com.example.promart.service;

import com.example.promart.model.MasterProduct;

public interface MasterProductService {
    MasterProduct rateMasterProduct(String productId, String userId, double rating);

    MasterProduct findById(String id);
}