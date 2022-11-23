package org.silzila.app.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;

import org.hibernate.annotations.GenericGenerator;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@ToString
@Table(name = "file_data")
public class FileData {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private String id;

    @NotBlank
    @Column(name = "user_id")
    private String userId;

    @NotBlank
    private String name;

    @NotBlank
    private String fileName;

    public FileData() {
    }

    public FileData(@NotBlank String userId, @NotBlank String name, @NotBlank String fileName) {
        this.userId = userId;
        this.name = name;
        this.fileName = fileName;
    }

}
