package com.example.promart.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.promart.model.Product;
import com.example.promart.model.Seller;
import com.example.promart.repository.ProductRepository;
import com.example.promart.repository.SellerRepository;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SellerRepository sellerRepository;

    // Remove the constructor injection
    // private final ProductService productService;

    // public ProductServiceImpl(ProductService productService) {
    // this.productService = productService;
    // }

    @Override
    public Product createProduct(Product product) {
        if (product.getSellerEmail() == null || product.getSellerEmail().isEmpty()) {
            throw new IllegalArgumentException("Seller email must be provided.");
        }

        // Log the lookup process
        System.out.println("Looking for seller with email: " + product.getSellerEmail());

        // Find seller by email
        Seller seller = sellerRepository.findByEmail(product.getSellerEmail())
                .orElseThrow(() -> new RuntimeException("Seller not found with email: " + product.getSellerEmail()));

        System.out.println("Seller found: " + seller.getShopName());

        // Remove sellerEmail before saving product
        product.setSellerEmail(null);

        // Save product
        Product savedProduct = productRepository.save(product);

        // Associate product with seller
        seller.getProducts().add(savedProduct);
        sellerRepository.save(seller);
        return savedProduct;
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Product getProductById(String id) {
        return productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
    }

    @Override
    public List<Product> getProductsBySellerId(String sellerId) {
        Seller seller = sellerRepository.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Seller not found"));
        return seller.getProducts(); // Return the list of products for the seller
    }

    @Override
    public List<Product> searchProducts(String query) {
        return productRepository.findByNameContaining(query);
    }

    @Override
    public List<Product> getPopularProducts() {
        return productRepository.findTop5ByOrderBySoldCountDesc();
    }

    public List<Product> getProductsByIds(List<String> ids) {
        return productRepository.findByIdIn(ids);
    }

    public boolean deleteProduct(String productId, String sellerEmail) {
        System.out.println("Attempting to delete product: " + productId + " for seller: " + sellerEmail);

        Optional<Seller> sellerOpt = sellerRepository.findByEmail(sellerEmail);

        if (sellerOpt.isEmpty()) {
            System.out.println("Seller not found: " + sellerEmail);
            return false;
        }

        Seller seller = sellerOpt.get();
        if (seller.getProducts() == null || seller.getProducts().isEmpty()) {
            System.out.println("Seller has no products.");
            return false;
        }

        Product productToDelete = seller.getProducts()
                .stream()
                .filter(product -> product.getId().equals(productId))
                .findFirst()
                .orElse(null);

        if (productToDelete == null) {
            System.out.println("Product not found in seller's list: " + productId);
            return false;
        }

        seller.getProducts().remove(productToDelete);
        sellerRepository.save(seller);

        if (productRepository.existsById(productId)) {
            productRepository.deleteById(productId);
            System.out.println("Product successfully deleted.");
            return true;
        }

        System.out.println("Product did not exist in repository.");
        return false;
    }

    public Product updateProduct(String productId, Product updatedProduct) {
        Optional<Product> existingProduct = productRepository.findById(productId);

        if (existingProduct.isPresent()) {
            Product product = existingProduct.get();
            product.setProductName(updatedProduct.getProductName());
            product.setBrand(updatedProduct.getBrand());
            product.setPrice(updatedProduct.getPrice());
            product.setStock(updatedProduct.getStock());
            product.setUnit(updatedProduct.getUnit());
            product.setNetQuantity(updatedProduct.getNetQuantity());

            return productRepository.save(product);
        } else {
            throw new RuntimeException("Product not found!");
        }
    }

    public void reduceStock(Map<String, Integer> productQuantities) {
        for (Map.Entry<String, Integer> entry : productQuantities.entrySet()) {
            String productId = entry.getKey();
            int quantity = entry.getValue();
            Optional<Product> productOpt = productRepository.findById(productId);
            if (productOpt.isPresent()) {
                Product product = productOpt.get();
                try {
                    product.reduceStock(quantity);
                    productRepository.save(product);
                } catch (RuntimeException e) {
                    throw new RuntimeException(
                            "Error reducing stock for product ID " + productId + ": " + e.getMessage());
                }
            } else {
                throw new RuntimeException("Product not found with ID: " + productId);
            }
        }
    }

}
