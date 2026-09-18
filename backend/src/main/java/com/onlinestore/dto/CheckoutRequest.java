package com.onlinestore.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.List;

public record CheckoutRequest(
        @NotBlank(message = "Full name is required")
        @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
        String fullName,

        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        String email,

        @NotBlank(message = "Phone is required")
        @Pattern(regexp = "^[+]?[0-9\\s\\-]{7,20}$", message = "Phone number is invalid")
        String phone,

        @NotBlank(message = "Address is required")
        @Size(min = 5, max = 200, message = "Address must be between 5 and 200 characters")
        String address,

        @NotBlank(message = "City is required")
        @Size(min = 2, max = 80, message = "City must be between 2 and 80 characters")
        String city,

        @NotBlank(message = "Postal code is required")
        @Pattern(regexp = "^[A-Za-z0-9\\s\\-]{3,12}$", message = "Postal code is invalid")
        String postalCode,

        @NotEmpty(message = "Cart cannot be empty")
        @Valid
        List<CheckoutItemRequest> items
) {
    public record CheckoutItemRequest(
            @NotNull(message = "Product id is required")
            Long productId,

            @NotBlank(message = "Product title is required")
            String title,

            @NotNull(message = "Price is required")
            @Min(value = 0, message = "Price must be non-negative")
            Double price,

            @NotNull(message = "Quantity is required")
            @Min(value = 1, message = "Quantity must be at least 1")
            Integer quantity
    ) {
    }
}
