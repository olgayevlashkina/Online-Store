package com.onlinestore.dto;

import java.time.Instant;
import java.util.UUID;

public record CheckoutResponse(
        String orderId,
        String message,
        Double total,
        Instant createdAt
) {
    public static CheckoutResponse of(double total) {
        return new CheckoutResponse(
                UUID.randomUUID().toString(),
                "Order placed successfully",
                total,
                Instant.now()
        );
    }
}
