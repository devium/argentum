package net.devium.argentum.rest;

import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableSet;
import net.devium.argentum.jpa.RoleEntity;
import net.devium.argentum.jpa.RoleRepository;
import net.devium.argentum.jpa.UserEntity;
import net.devium.argentum.jpa.UserRepository;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.Collections.emptySet;
import static org.hamcrest.Matchers.*;
import static org.junit.Assert.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
public class UserControllerTest {
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private UserRepository userRepository;

    private UserController sut;

    private MockMvc mockMvc;

    @Before
    public void setUp() {
        sut = new UserController(userRepository, roleRepository);
        mockMvc = MockMvcBuilders.standaloneSetup(sut).build();
    }

    @After
    public void tearDown() throws Exception {
        List<RoleEntity> rangeRoles = roleRepository.findByNameContains("RANGE\\_");
        roleRepository.delete(rangeRoles);
    }

    @Test
    public void testMergeUsers() throws Exception {
        RoleEntity role1 = roleRepository.save(new RoleEntity("RANGE_SOMETHING"));
        RoleEntity role2 = roleRepository.findByNameContains("ADMIN").get(0);
        UserEntity user1 = userRepository.save(
                new UserEntity("someName", "somePassword", ImmutableSet.of(role1, role2))
        );
        UserEntity user2 = userRepository.save(
                new UserEntity("someOtherName", "someOtherPassword", ImmutableSet.of(role1))
        );

        String body = "[" +
                "   {" +
                "       'id': %s," +
                "       'username': 'someUpdatedName'," +
                "       'password': 'someUpdatedPassword'," +
                "       'roles': [" +
                "           'RANGE_SOMETHING'," +
                "           'ORDER'" +
                "       ]" +
                "   }," +
                "   {" +
                "       'id': %s," +
                "       'username': 'someOtherName'," +
                "       'roles': [" +
                "       ]" +
                "   }," +
                "   {" +
                "       'username': 'someThirdName'," +
                "       'password': 'someThirdPassword'," +
                "       'roles': [" +
                "           'SCAN'," +
                "           'ORDER'" +
                "       ]" +
                "   }" +
                "]";

        body = String.format(body, user1.getId(), user2.getId());
        body = body.replace('\'', '"');

        mockMvc.perform(post("/users")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(body))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].id", is((int) user1.getId())))
                .andExpect(jsonPath("$.data[0].username", is("someUpdatedName")))
                .andExpect(jsonPath("$.data[0].roles", containsInAnyOrder("RANGE_SOMETHING", "ORDER")))
                .andExpect(jsonPath("$.data[1].id", is((int) user2.getId())))
                .andExpect(jsonPath("$.data[1].username", is("someOtherName")))
                .andExpect(jsonPath("$.data[1].roles", empty()))
                .andExpect(jsonPath("$.data[2].id").isNumber())
                .andExpect(jsonPath("$.data[2].username", is("someThirdName")))
                .andExpect(jsonPath("$.data[2].roles", containsInAnyOrder("SCAN", "ORDER")));

        user1 = userRepository.findOne(user1.getId());
        user2 = userRepository.findOne(user2.getId());
        UserEntity user3 = userRepository.findByUsername("someThirdName");
        assertThat(user1.getPassword(), is("someUpdatedPassword"));
        assertThat(user1.getUsername(), is("someUpdatedName"));
        assertThat(user2.getPassword(), is("someOtherPassword"));
        assertThat(user3.getPassword(), is("someThirdPassword"));

        List<String> roles1 = user1.getRoles().stream()
                .map(RoleEntity::getName)
                .collect(Collectors.toList());

        assertThat(roles1, containsInAnyOrder("RANGE_SOMETHING", "ORDER"));

        userRepository.delete(ImmutableList.of(user1, user2, user3));
    }

    @Test
    public void testMergeUsersNoPassword() throws Exception {
        String body = "[" +
                "   {" +
                "       'username': 'someName'," +
                "       'roles': [" +
                "           'ADMIN'," +
                "           'ORDER'" +
                "       ]" +
                "   }" +
                "]";

        body = body.replace('\'', '"');

        mockMvc.perform(post("/users")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(body))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testMergeUsersDuplicateUsername() throws Exception {
        String body = "[" +
                "   {" +
                "       'username': 'someName'," +
                "       'password': 'somePassword'," +
                "       'roles': [" +
                "           'ORDER'" +
                "       ]" +
                "   }," +
                "   {" +
                "       'username': 'someName'," +
                "       'password': 'someOtherPassword'," +
                "       'roles': [" +
                "           'ADMIN'," +
                "           'SCAN'" +
                "       ]" +
                "   }" +
                "]";

        body = body.replace('\'', '"');

        mockMvc.perform(post("/users")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(body))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testMergeUsersExistingUsername() throws Exception {
        UserEntity user1 = userRepository.save(new UserEntity("someName", "somePassword", emptySet()));

        String body = "[" +
                "   {" +
                "       'username': 'someName'," +
                "       'password': 'someOtherPassword'," +
                "       'roles': [" +
                "           'ORDER'" +
                "       ]" +
                "   }" +
                "]";

        body = body.replace('\'', '"');

        mockMvc.perform(post("/users")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(body))
                .andDo(print())
                .andExpect(status().isBadRequest());

        userRepository.delete(user1.getId());
    }

    @Test
    public void testDeleteUsers() throws Exception {
        RoleEntity role1 = roleRepository.save(new RoleEntity("RANGE_SOMETHING"));
        UserEntity user1 = userRepository.save(new UserEntity("someName", "somePassword", ImmutableSet.of(role1)));
        UserEntity user2 = userRepository.save(
                new UserEntity("someOtherName", "someOtherPassword", emptySet())
        );

        String body = "[ %s ]";

        body = String.format(body, user1.getId());
        body = body.replace('\'', '"');

        mockMvc.perform(delete("/users")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(body))
                .andDo(print())
                .andExpect(status().isNoContent());

        user1 = userRepository.findOne(user1.getId());
        user2 = userRepository.findOne(user2.getId());
        // admin + user2 (someOtherName) are left.
        assertThat(userRepository.findAll(), hasSize(1 + 1));
        assertThat(user1, nullValue());
        assertThat(user2.getUsername(), is("someOtherName"));
        assertThat(user2.getPassword(), is("someOtherPassword"));

        userRepository.delete(user2.getId());
    }

    @Test
    public void testDeleteUsersEmpty() throws Exception {
        String body = "[]";

        mockMvc.perform(delete("/users")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(body))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testDeleteUsersNotFound() throws Exception {
        String body = "[ 42 ]"; // 1 might actually be admin.

        mockMvc.perform(delete("/users")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(body))
                .andDo(print())
                .andExpect(status().isNotFound());
    }
}