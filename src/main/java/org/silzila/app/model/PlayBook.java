package org.silzila.app.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;

import com.fasterxml.jackson.annotation.JsonRawValue;
import com.vladmihalcea.hibernate.type.json.JsonStringType;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Data
@Getter
@Setter
@ToString
@Table(name = "playbook")
@TypeDef(name = "json", typeClass = JsonStringType.class)
public class PlayBook {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private String id;

    @NotBlank
    @Column(name = "user_id")
    private String userId;

    @NotBlank
    private String name;

    private String description;

    @NotBlank
    @Type(type = "json")
    @Column(columnDefinition = "json")
    @JsonRawValue
    private Object content;

    public PlayBook() {
    }

    public PlayBook(@NotBlank String userId, @NotBlank String name, String description, @NotBlank Object content) {
        this.userId = userId;
        this.name = name;
        this.description = description;
        this.content = content;
    }

}
