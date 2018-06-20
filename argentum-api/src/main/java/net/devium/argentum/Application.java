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

import java.util.List;

@SpringBootApplication
@EnableResourceServer
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Autowired
    public void authenticationManager(
            AuthenticationManagerBuilder builder, UserRepository userRepository,
            RoleRepository roleRepository
    ) throws Exception {
        if (userRepository.count() == 0) {
            RoleEntity admin = new RoleEntity("ADMIN");
            RoleEntity order = new RoleEntity("ORDER");
            RoleEntity coatCheck = new RoleEntity("COAT_CHECK");
            RoleEntity checkin = new RoleEntity("CHECKIN");
            RoleEntity transfer = new RoleEntity("TRANSFER");
            RoleEntity scan = new RoleEntity("SCAN");
            RoleEntity rangeAll = new RoleEntity("ALL_RANGES");
            List<RoleEntity> all_roles = ImmutableList.of(admin, order, coatCheck, checkin, transfer, scan, rangeAll);
            all_roles = roleRepository.save(all_roles);

            userRepository.save(new UserEntity("admin", "argentum", ImmutableSet.copyOf(all_roles)));
        }

        builder.userDetailsService(username -> new CustomUserDetails(userRepository.findByUsername(username)));
    }
}

