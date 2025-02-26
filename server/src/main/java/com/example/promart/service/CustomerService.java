package com.example.promart.service;

import com.example.promart.model.Customer;
import com.example.promart.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

@Service
public class CustomerService {
    @Autowired
    private CustomerRepository customerRepository;

    public void saveOrUpdateCustomer(String customerName, String customerEmail) {
        Optional<Customer> existingCustomer = customerRepository.findByCustomerEmail(customerEmail);

        if (existingCustomer.isPresent()) {
            // Update existing customer name
            Customer customer = existingCustomer.get();
            customer.setCustomerName(customerName);
            customerRepository.save(customer);
            System.out.println("Customer updated: " + customerEmail);
        } else {
            // Create new customer
            Customer newCustomer = new Customer(customerName, customerEmail);
            customerRepository.save(newCustomer);
            System.out.println("New customer created: " + customerEmail);
        }
    }

    public Customer saveCustomer(Customer customer) {
        // Check if customer already exists
        if (customerRepository.existsByCustomerEmail(customer.getCustomerEmail())) {
            return customerRepository.findByCustomerEmail(customer.getCustomerEmail()).orElse(null);
        }
        
        // Set creation timestamp
        customer.setCreatedAt(LocalDateTime.now());
        
        return customerRepository.save(customer);
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Customer getCustomerByEmail(String email) {
        return customerRepository.findByCustomerEmail(email).orElse(null);
    }

    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public void deleteCustomer(String email) {
        Optional<Customer> customerOptional = customerRepository.findByCustomerEmail(email);
        if (customerOptional.isPresent()) {
            Customer customer = customerOptional.get();
        if (customer != null) {
            customerRepository.delete(customer);
        }
    }
}
}
