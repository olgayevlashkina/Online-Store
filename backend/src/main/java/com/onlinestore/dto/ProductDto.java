package com.onlinestore.dto;

import java.util.List;

public record ProductDto(
        Long id,
        String title,
        String description,
        String category,
        Double price,
        Double discountPercentage,
        Double rating,
        Integer stock,
        String brand,
        String thumbnail,
        List<String> images
) {
}
