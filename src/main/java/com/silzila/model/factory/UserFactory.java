package com.silzila.model.factory;

import com.silzila.domain.entity.User;
import com.silzila.model.security.SecurityUser;
import org.springframework.security.core.authority.AuthorityUtils;

public class UserFactory {

  public static SecurityUser create(User user) {
    return new SecurityUser(
        user.getId(),
        user.getUsername(),
        user.getPassword(),
        user.getLastPasswordReset(),
        AuthorityUtils.commaSeparatedStringToAuthorityList(user.getAuthorities()));
  }

}
