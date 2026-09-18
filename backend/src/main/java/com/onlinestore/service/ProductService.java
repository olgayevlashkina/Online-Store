package com.onlinestore.service;

import com.onlinestore.dto.CheckoutRequest;
import com.onlinestore.dto.CheckoutResponse;
import com.onlinestore.dto.ProductDto;
import com.onlinestore.dto.ProductListResponse;
import com.onlinestore.exception.ResourceNotFoundException;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Map;

@Service
public class ProductService {

    private final WebClient dummyJsonWebClient;

    public ProductService(WebClient dummyJsonWebClient) {
        this.dummyJsonWebClient = dummyJsonWebClient;
    }

    public ProductListResponse getProducts(Integer limit, Integer skip, String category, String search) {
        if (search != null && !search.isBlank()) {
            return fetchSearch(search.trim(), limit, skip);
        }
        if (category != null && !category.isBlank()) {
            return fetchByCategory(category.trim(), limit, skip);
        }
        return fetchAll(limit, skip);
    }

    public ProductDto getProductById(Long id) {
        try {
            return dummyJsonWebClient.get()
                    .uri("/products/{id}", id)
                    .retrieve()
                    .bodyToMono(ProductDto.class)
                    .block();
        } catch (WebClientResponseException.NotFound ex) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
    }

    public List<String> getCategories() {
        try {
            List<Map<String, Object>> categories = dummyJsonWebClient.get()
                    .uri("/products/categories")
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {
                    })
                    .block();

            if (categories == null) {
                return List.of();
            }

            return categories.stream()
                    .map(item -> {
                        Object slug = item.get("slug");
                        if (slug != null) {
                            return slug.toString();
                        }
                        Object name = item.get("name");
                        return name != null ? name.toString() : "";
                    })
                    .filter(s -> !s.isBlank())
                    .toList();
        } catch (Exception ex) {
            List<String> fallback = dummyJsonWebClient.get()
                    .uri("/products/category-list")
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<List<String>>() {
                    })
                    .block();
            return fallback != null ? fallback : List.of();
        }
    }

    public CheckoutResponse checkout(CheckoutRequest request) {
        double total = request.items().stream()
                .mapToDouble(item -> item.price() * item.quantity())
                .sum();
        return CheckoutResponse.of(Math.round(total * 100.0) / 100.0);
    }

    private ProductListResponse fetchAll(Integer limit, Integer skip) {
        String uri = UriComponentsBuilder.fromPath("/products")
                .queryParam("limit", limit != null ? limit : 30)
                .queryParam("skip", skip != null ? skip : 0)
                .toUriString();

        return dummyJsonWebClient.get()
                .uri(uri)
                .retrieve()
                .bodyToMono(ProductListResponse.class)
                .block();
    }

    private ProductListResponse fetchByCategory(String category, Integer limit, Integer skip) {
        String uri = UriComponentsBuilder.fromPath("/products/category/{category}")
                .queryParam("limit", limit != null ? limit : 30)
                .queryParam("skip", skip != null ? skip : 0)
                .buildAndExpand(category)
                .toUriString();

        return dummyJsonWebClient.get()
                .uri(uri)
                .retrieve()
                .bodyToMono(ProductListResponse.class)
                .block();
    }

    private ProductListResponse fetchSearch(String query, Integer limit, Integer skip) {
        String uri = UriComponentsBuilder.fromPath("/products/search")
                .queryParam("q", query)
                .queryParam("limit", limit != null ? limit : 30)
                .queryParam("skip", skip != null ? skip : 0)
                .toUriString();

        return dummyJsonWebClient.get()
                .uri(uri)
                .retrieve()
                .bodyToMono(ProductListResponse.class)
                .block();
    }
}
