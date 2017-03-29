package net.devium.argentum;

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
        assertThat(roles, hasSize(5));
        assertThat(admin.getRoles(), hasSize(1));

        assertThat(admin.getRoles().iterator().next().getName(), is("ADMIN"));
        assertThat(roles.get(0).getName(), is("ADMIN"));
        assertThat(roles.get(1).getName(), is("ORDER"));
        assertThat(roles.get(2).getName(), is("CHECKIN"));
        assertThat(roles.get(3).getName(), is("SCAN"));
        assertThat(roles.get(4).getName(), is("ALL_RANGES"));
    }
}
