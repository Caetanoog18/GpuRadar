package com.caetano.gpu_radar_api.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "favorites",
uniqueConstraints = {
        @UniqueConstraint(name = "uk_favorite_url", columnNames = "url")
    }
)
public class Favorite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String store;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false, unique = true, length = 1000)
    private String url;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    protected Favorite() {}

    public Favorite(String name, String store, BigDecimal price, String url){
        this.name = name;
        this.store = store;
        this.price = price;
        this.url = url;
        this.createdAt = LocalDateTime.now();
    }

    @PrePersist
    public void prePersist(){
        if(createdAt == null) createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getStore() {
        return store;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public String getUrl() {
        return url;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
