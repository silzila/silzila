package com.silzila.domain.entity;

import com.silzila.domain.base.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.*;

import java.util.Date;

@Entity
@Table(name = "user", uniqueConstraints = {
    @UniqueConstraint(columnNames = "username") })
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {

  private static final long serialVersionUID = 2353528370345499815L;

  @Column(name = "name")
  private String name;
  @Column(name = "username")
  private String username;
  @Column(name = "password")
  private String password;
  @Column(name = "last_password_reset")
  private Date lastPasswordReset;
  @Column(name = "authorities")
  private String authorities;

}
