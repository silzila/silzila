package com.silzila;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;

import com.silzila.service.ConnectionPoolService;

import javax.annotation.PreDestroy;
import java.io.*;

@SpringBootApplication
public class VizApplication {

	@Autowired
	ConnectionPoolService connectionPoolService;

	public static void main(String[] args) throws IOException {
		SpringApplication.run(VizApplication.class, args);

		// UNCOMMENT for Single build with react
		// System.out.println(
		// "------- Trying to open App in browser." +
		// "If not loaded properly then refresh page again --------");
		// // don't add /api at the end of URL for opening React Home page
		// String home_url = "http://localhost:8080";
		// System.setProperty("java.awt.headless", "false");
		// try {
		// Thread.sleep(1500);
		// java.awt.Desktop.getDesktop().browse(java.net.URI.create(home_url));
		// } catch (InterruptedException ie) {
		// Thread.currentThread().interrupt();
		// }
	}

	// during shut down or killing of app, this closes all connections
	// in connection pools
	@PreDestroy
	private void shutDown() {
		System.out.println("############## APP Shutdown #################");
		connectionPoolService.clearAllConnectionPoolsInShutDown();
	}
}
