package com.example.fitness_tracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.sql.*;
import java.sql.DriverManager;



@SpringBootApplication
public class FitnessTrackerApplication {

	public static void main(String[] args) throws Exception {
        Connection conn = DriverManager.getConnection("jdbc:h2:~/test", "sa", "");
        conn.close();
		SpringApplication.run(FitnessTrackerApplication.class, args);

	}

}
