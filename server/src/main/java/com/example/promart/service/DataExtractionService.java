package com.example.promart.service;

import com.example.promart.model.BillingOnline;
import com.example.promart.model.CFTransaction;
import com.example.promart.model.Product;
import com.example.promart.model.ProductDetails;
import com.example.promart.repository.BillingOnlineRepository;
import com.example.promart.repository.CFTransactionRepository;
import com.example.promart.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DataExtractionService {

    private static final Logger logger = LoggerFactory.getLogger(DataExtractionService.class);

    @Autowired
    private BillingOnlineRepository billingOnlineRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CFTransactionRepository cfTransactionRepository;

    public void extractAndSaveTransactions() {
        try {
            logger.info("Starting data extraction and transaction generation");

            // Optionally clear existing transactions (uncomment if needed)
            // cfTransactionRepository.deleteAll();
            // logger.debug("Cleared existing CF transactions");

            // Fetch all billing records
            List<BillingOnline> billings = billingOnlineRepository.findAll();
            logger.info("Found {} billing records", billings.size());

            int transactionCount = 0;
            int skippedCount = 0;

            for (BillingOnline billing : billings) {
                String customerEmail = billing.getCustomerEmail();
                List<ProductDetails> items = billing.getItems();

                // Check if items list is null or empty
                if (items == null || items.isEmpty()) {
                    logger.warn("No items found in billing ID: {}", billing.getId());
                    skippedCount++;
                    continue;
                }

                for (ProductDetails item : items) {
                    String productId = item.getProductId();
                    int quantity = item.getQuantity();

                    if (productId == null) {
                        logger.warn("Skipping item with null productId in billing ID: {}", billing.getId());
                        skippedCount++;
                        continue;
                    }

                    // Fetch product details
                    Product product = productRepository.findById(productId).orElse(null);
                    if (product == null) {
                        logger.warn("No product found for productId: {} in billing ID: {}", productId, billing.getId());
                        skippedCount++;
                        continue;
                    }

                    String masterId = product.getMasterId();
                    if (masterId == null) {
                        logger.warn("No masterId found for productId: {} in billing ID: {}", productId,
                                billing.getId());
                        skippedCount++;
                        continue;
                    }

                    // Create a new transaction for each item
                    CFTransaction transaction = new CFTransaction();
                    transaction.setCustomerEmail(customerEmail);
                    transaction.setMasterId(masterId);
                    transaction.setQuantity(quantity);
                    transaction.setLastUpdated(java.time.LocalDateTime.now());
                    cfTransactionRepository.save(transaction);
                    logger.info("Saved new transaction for customer: {} and product: {} in billing ID: {}",
                            customerEmail, masterId, billing.getId());

                    transactionCount++;
                }
            }

            logger.info("Processed {} billings: {} transactions generated, {} skipped",
                    billings.size(), transactionCount, skippedCount);
        } catch (Exception e) {
            logger.error("Error during data extraction: {}", e.getMessage());
            throw new RuntimeException("Failed to extract and save transactions", e);
        }
    }

    public List<CFTransaction> getAllTransactions() {
        try {
            logger.info("Fetching all CF transactions");
            List<CFTransaction> transactions = cfTransactionRepository.findAll();
            logger.info("Found {} transactions", transactions.size());
            return transactions;
        } catch (Exception e) {
            logger.error("Error fetching transactions: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch transactions", e);
        }
    }
}