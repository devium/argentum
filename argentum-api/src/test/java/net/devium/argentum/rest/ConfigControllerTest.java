package net.devium.argentum.rest;

import net.devium.argentum.jpa.ConfigEntity;
import net.devium.argentum.jpa.ConfigRepository;
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

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
public class ConfigControllerTest {
    @Autowired
    private ConfigRepository configRepository;

    private ConfigController sut;

    private MockMvc mockMvc;

    @Before
    public void setUp() {
        sut = new ConfigController(configRepository);
        mockMvc = MockMvcBuilders.standaloneSetup(sut).build();
    }

    @After
    public void tearDown() throws Exception {
        configRepository.deleteAll();
    }

    @Test
    public void testGetConfigDefault() throws Exception {
        mockMvc.perform(get("/config"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.prepaid", is(true)));
    }

    @Test
    public void testGetConfigSet() throws Exception {
        configRepository.save(new ConfigEntity("prepaid", "false"));

        mockMvc.perform(get("/config"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.prepaid", is(false)));
    }

    @Test
    public void testSetConfig() throws Exception {
        String body = "{" +
                "   'prepaid': false" +
                "}";

        body = body.replace('\'', '"');

        mockMvc.perform(put("/config")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(body))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.prepaid", is(false)));

        assertThat(configRepository.findOne("prepaid").getValue(), is("false"));
    }
}
