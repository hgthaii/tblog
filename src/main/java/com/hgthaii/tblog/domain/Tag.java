package com.hgthaii.tblog.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Entity
@Getter
@Setter
@Table(name = "tags")
public class Tag implements Serializable {

    @Id
    @GeneratedValue
    private Long id;

    private String name;

    @Column(unique = true)
    private String slug;
}
