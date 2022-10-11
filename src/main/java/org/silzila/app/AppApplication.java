package org.silzila.app;

import javax.annotation.PreDestroy;

import org.silzila.app.service.ConnectionPoolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AppApplication {

	@Autowired
	ConnectionPoolService connectionPoolService;

	public static void main(String[] args) {
		SpringApplication.run(AppApplication.class, args);
	}

	// during shut down or killing of app, this closes all connections
	// in connection pools
	@PreDestroy
	private void shutDown() {
		System.out.println("############## APP Shutdown #################");
		connectionPoolService.clearAllConnectionPoolsInShutDown();
	}

}
