package net.devium.argentum;

import com.google.common.collect.ImmutableSet;
import net.devium.argentum.jpa.RoleEntity;
import net.devium.argentum.jpa.RoleRepository;
import net.devium.argentum.jpa.UserEntity;
import net.devium.argentum.jpa.UserRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest
public class ApplicationTest {
    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Test
    public void testUsers() throws Exception {
        List<UserEntity> users = userRepository.findAll();

        assertThat(users, hasSize(1));
        UserEntity admin = users.get(0);
        assertThat(admin.getUsername(), is("admin"));
        assertThat(admin.getPassword(), is("argentum"));

        List<RoleEntity> roles = roleRepository.findAll();
        assertThat(roles, hasSize(7));
        assertThat(admin.getRoles(), hasSize(7));

        Set<String> allRoles = ImmutableSet.of(
                "ADMIN",
                "ORDER",
                "COAT_CHECK",
                "CHECKIN",
                "TRANSFER",
                "SCAN",
                "ALL_RANGES"
        );
        Set<String> adminRoles = admin.getRoles().stream().map(RoleEntity::getName).collect(Collectors.toSet());
        assertThat(adminRoles, is(allRoles));
        Set<String> savedRoles = roles.stream().map(RoleEntity::getName).collect(Collectors.toSet());
        assertThat(savedRoles, is(allRoles));
    }
}
