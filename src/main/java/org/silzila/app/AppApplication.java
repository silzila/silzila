package org.silzila.app;

import javax.annotation.PreDestroy;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.silzila.app.service.ConnectionPoolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.awt.Desktop;
import java.io.*;
import java.net.URI;

@SpringBootApplication
public class AppApplication {

	private static final Logger logger = LogManager.getLogger(AppApplication.class);

	@Autowired
	ConnectionPoolService connectionPoolService;

	public static void main(String[] args) throws Exception {
		SpringApplication.run(AppApplication.class, args);
		logger.info("00000000000000");
		String home_url = "http://localhost:8080";
		System.setProperty("java.awt.headless", "false");
		// try {
		// Thread.sleep(1500);
		// java.awt.Desktop.getDesktop().browse(java.net.URI.create(home_url));
		// // Desktop desktop = Desktop.getDesktop();
		// // System.out.println("11111111111");
		// // System.out.println("2222222222");
		// // desktop.browse(new URI("http://localhost:8080"));
		// } catch (InterruptedException ie) {
		// Thread.currentThread().interrupt();
		// }
	}

	// during shut down or killing of app, this closes all connections
	// in connection pools
	@PreDestroy
	private void shutDown() {
		logger.info("############## APP Shutdown #################");
		connectionPoolService.clearAllConnectionPoolsInShutDown();
	}

}
