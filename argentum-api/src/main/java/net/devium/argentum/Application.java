package net.devium.argentum;

import com.google.common.collect.ImmutableSet;
import net.devium.argentum.jpa.Role;
import net.devium.argentum.jpa.User;
import net.devium.argentum.jpa.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;

@SpringBootApplication
@EnableResourceServer
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Autowired
    public void authenticationManager(AuthenticationManagerBuilder builder, UserRepository repository) throws Exception {
        if (repository.count() == 0) {
            repository.save(new User("admin", "argentum", ImmutableSet.of(new Role("ADMIN"))));
        }
        builder.userDetailsService(username -> new CustomUserDetails(repository.findByUsername(username)));
    }
}

