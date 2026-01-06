package com.hgthaii.tblog.domain;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Entity
@Getter
@Setter
@Table(name = "authors")
public class Author implements Serializable {

    @Id
    @GeneratedValue
    private Long id;

    @Column(unique = true,  nullable = false)
    private String name;

    private String bio;

    private String avatar;
}
