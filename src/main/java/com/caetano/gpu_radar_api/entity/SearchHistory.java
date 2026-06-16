package com.caetano.gpu_radar_api.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "search_history")
public class SearchHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String searchedTerm;

    @Column(nullable = false)
    private Integer resultCount;

    @Column(precision = 12, scale = 2)
    private BigDecimal lowestPriceFound;

    @Column(nullable = false)
    private LocalDateTime searchedAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private UserAccount user;

    protected SearchHistory() {
    }

    public SearchHistory(
            String searchedTerm,
            Integer resultCount,
            BigDecimal lowestPriceFound,
            UserAccount user
    ) {
        this.searchedTerm = searchedTerm;
        this.resultCount = resultCount;
        this.lowestPriceFound = lowestPriceFound;
        this.user = user;
        this.searchedAt = LocalDateTime.now();
    }

    @PrePersist
    public void prePersist() {
        if (searchedAt == null) {
            searchedAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public String getSearchedTerm() {
        return searchedTerm;
    }

    public Integer getResultCount() {
        return resultCount;
    }

    public BigDecimal getLowestPriceFound() {
        return lowestPriceFound;
    }

    public LocalDateTime getSearchedAt() {
        return searchedAt;
    }

    public UserAccount getUser() {
        return user;
    }
}