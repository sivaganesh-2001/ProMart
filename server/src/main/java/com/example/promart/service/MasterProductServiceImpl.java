package com.example.promart.service;

import com.example.promart.model.MasterProduct;
import com.example.promart.model.Product;
import com.example.promart.repository.MasterProductRepository;
import com.example.promart.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MasterProductServiceImpl implements MasterProductService {

    private static final Logger logger = LoggerFactory.getLogger(MasterProductServiceImpl.class);

    @Autowired
    private MasterProductRepository masterProductRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    @Transactional
    public MasterProduct rateMasterProduct(String productId, String userId, double rating) {
        logger.info("Attempting to rate product with ID: {}", productId);

        // Step 1: Fetch the Product to get its masterId
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> {
                    logger.error("Product with ID {} not found", productId);
                    return new RuntimeException("Product not found");
                });

        String masterId = product.getMasterId();
        if (masterId == null) {
            logger.error("No masterId found for product ID: {}", productId);
            throw new RuntimeException("Master product ID not found for this product");
        }

        // Step 2: Fetch the MasterProduct using masterId
        MasterProduct masterProduct = masterProductRepository.findById(masterId)
                .orElseThrow(() -> {
                    logger.error("MasterProduct with ID {} not found", masterId);
                    return new RuntimeException("MasterProduct not found");
                });

        // Step 3: Update the rating in MasterProduct
        masterProduct.updateRating(userId, rating);

        // Step 4: Save and return the updated MasterProduct
        return masterProductRepository.save(masterProduct);
    }

    @Override
    public MasterProduct findById(String id) {
        return masterProductRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("MasterProduct not found"));
    }
}