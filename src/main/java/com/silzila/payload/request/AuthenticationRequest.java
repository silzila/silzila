package com.silzila.payload.request;

import com.silzila.model.base.ModelBase;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
public class AuthenticationRequest extends ModelBase {

	private static final long serialVersionUID = 7151443507829405471L;

	@NotBlank
	@Email(message = "Email id should be valid")
	private String username;
	@NotNull(message = "Password must be provided")
	private String password;
	private String device;
}
