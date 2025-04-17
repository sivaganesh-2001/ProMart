package com.example.promart.service;

import com.example.promart.model.*;
import com.example.promart.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MBAService {

    private static final Logger logger = LoggerFactory.getLogger(MBAService.class);

    @Autowired
    private BillingOfflineRepository billingOfflineRepository;

    @Autowired
    private BillingOnlineRepository billingOnlineRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private MBATransactionRepository mbaTransactionRepository;

    public void generateMBATransactions() {
        try {
            logger.info("Starting MBA transaction generation");
            mbaTransactionRepository.deleteAll();
            logger.debug("Cleared existing MBA transactions");

            List<BillingOffline> offlineBillings = billingOfflineRepository.findAll();
            logger.info("Found {} offline billings", offlineBillings.size());
            int offlineTransactions = processBillings(offlineBillings, "offline");

            List<BillingOnline> onlineBillings = billingOnlineRepository.findAll();
            logger.info("Found {} online billings", onlineBillings.size());
            int onlineTransactions = processBillings(onlineBillings, "online");

            long totalTransactions = mbaTransactionRepository.count();
            logger.info("Generated {} transactions ({} offline, {} online)",
                    totalTransactions, offlineTransactions, onlineTransactions);
        } catch (Exception e) {
            logger.error("Error generating MBA transactions", e);
            throw new RuntimeException("Failed to generate MBA transactions", e);
        }
    }

    private int processBillings(List<? extends Object> billings, String billingType) {
        int transactionCount = 0;
        int skippedCount = 0;
        for (Object billing : billings) {
            List<ProductDetails> items;
            String billingId = "unknown";
            try {
                if (billing instanceof BillingOffline) {
                    items = ((BillingOffline) billing).getItems();
                    billingId = ((BillingOffline) billing).getId();
                } else if (billing instanceof BillingOnline) {
                    items = ((BillingOnline) billing).getItems();
                    billingId = ((BillingOnline) billing).getId();
                } else {
                    logger.warn("Unknown billing type for billing ID: {}", billingId);
                    skippedCount++;
                    continue;
                }

                if (items == null || items.isEmpty()) {
                    logger.info("Skipping {} billing ID: {} - null or empty items", billingType, billingId);
                    skippedCount++;
                    continue;
                }

                List<String> masterIds = new ArrayList<>();
                for (ProductDetails item : items) {
                    String productId = item.getProductId();
                    if (productId == null) {
                        logger.info("Skipping item in {} billing ID: {} - null productId", billingType, billingId);
                        continue;
                    }

                    try {
                        logger.debug("Querying product for productId: {} in {} billing ID: {}",
                                productId, billingType, billingId);
                        Product product = productRepository.findById(productId).orElse(null);
                        if (product != null) {
                            if (product.getMasterId() != null) {
                                masterIds.add(product.getMasterId());
                                logger.debug("Added masterId: {} for productId: {}",
                                        product.getMasterId(), productId);
                            } else {
                                logger.info("No masterId for productId: {} in {} billing ID: {}",
                                        productId, billingType, billingId);
                            }
                        } else {
                            logger.info("No product found for productId: {} in {} billing ID: {}",
                                    productId, billingType, billingId);
                        }
                    } catch (Exception e) {
                        logger.error("Error querying productId: {} in {} billing ID: {}",
                                productId, billingType, billingId, e);
                    }
                }

                if (!masterIds.isEmpty()) {
                    MBATransaction transaction = new MBATransaction(masterIds);
                    mbaTransactionRepository.save(transaction);
                    logger.debug("Saved transaction with masterIds: {} for {} billing ID: {}",
                            masterIds, billingType, billingId);
                    transactionCount++;
                } else {
                    logger.info("No valid masterIds for {} billing ID: {}", billingType, billingId);
                    skippedCount++;
                }
            } catch (Exception e) {
                logger.error("Error processing {} billing ID: {}", billingType, billingId, e);
                skippedCount++;
            }
        }
        logger.info("Processed {} {} billings: {} transactions generated, {} skipped",
                billings.size(), billingType, transactionCount, skippedCount);
        return transactionCount;
    }

    public List<List<String>> getAllTransactions() {
        try {
            List<List<String>> transactions = mbaTransactionRepository.findAll()
                    .stream()
                    .map(MBATransaction::getMasterIds)
                    .collect(Collectors.toList());
            logger.info("Retrieved {} transactions", transactions.size());
            return transactions;
        } catch (Exception e) {
            logger.error("Error retrieving transactions", e);
            throw new RuntimeException("Failed to retrieve transactions", e);
        }
    }
}