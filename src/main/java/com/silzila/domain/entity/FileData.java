package com.silzila.domain.entity;

import com.silzila.domain.base.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import javax.validation.constraints.NotBlank;

import lombok.*;

@Entity
@Table(name = "file_data")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FileData extends BaseEntity {

    @NotBlank
    @Column(name = "user_id")
    private String userId;
    @NotBlank
    @Column(name = "name")
    private String name;
    @NotBlank
    @Column(name = "file_name")
    private String fileName;

}
