package com.silzila;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;

import com.silzila.service.ConnectionPoolService;

import javax.annotation.PreDestroy;
import java.io.*;
import java.net.URI;
import java.awt.Desktop;

@SpringBootApplication
public class VizApplication {

	@Autowired
	ConnectionPoolService connectionPoolService;

	public static void main(String[] args) throws IOException {
		SpringApplication.run(VizApplication.class, args);
        
		// UNCOMMENT FOR SINGLE BUILD WITH REACT APP
		// try {
		// URI url = new URI("http://localhost:8080");
		// Thread.sleep(2000);
		
		// if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
		// 	Desktop.getDesktop().browse(url);
		// } else {
		// 	String os = System.getProperty("os.name").toLowerCase();
		// 	if (os.contains("linux")) {
		// 	new ProcessBuilder("xdg-open", url.toString()).start();
		// 	}
		// 	else if (os.contains("mac")) {
		// 	new ProcessBuilder("open", url.toString()).start();	
		// 	}
		// 	else if (os.contains("win")) {
		// 		new ProcessBuilder("rundll32", "url.dll,FileProtocolHandler", url.toString()).start();
		// 	} else {
		// 		System.err.println("Opening the browser is not supported on this OS.");
		// 	}
		// }
        // } catch (Exception e) {
        //     e.printStackTrace();
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
