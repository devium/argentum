package net.devium.argentum;

import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableSet;
import net.devium.argentum.jpa.RoleEntity;
import net.devium.argentum.jpa.RoleRepository;
import net.devium.argentum.jpa.UserEntity;
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
    public void authenticationManager(AuthenticationManagerBuilder builder, UserRepository userRepository,
                                      RoleRepository roleRepository) throws Exception {
        if (userRepository.count() == 0) {
            RoleEntity admin = new RoleEntity("ADMIN");
            RoleEntity order = new RoleEntity("ORDER");
            RoleEntity checkin = new RoleEntity("CHECKIN");
            RoleEntity scan = new RoleEntity("SCAN");
            RoleEntity rangeAll = new RoleEntity("ALL_RANGES");
            admin = roleRepository.save(ImmutableList.of(admin, order, checkin, scan, rangeAll)).get(0);

            UserEntity adminUser = userRepository.save(new UserEntity("admin", "argentum", ImmutableSet.of(admin)));
        }

        builder.userDetailsService(username -> new CustomUserDetails(userRepository.findByUsername(username)));
    }
}

