package com.example.promart.service;

import com.example.promart.model.Customer;
import com.example.promart.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

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
}
