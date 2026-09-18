package com.onlinestore.dto;

import java.util.List;

public record ProductListResponse(
        List<ProductDto> products,
        Integer total,
        Integer skip,
        Integer limit
) {
}
