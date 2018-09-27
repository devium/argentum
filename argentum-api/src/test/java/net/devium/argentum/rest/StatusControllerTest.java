package net.devium.argentum.rest;

import net.devium.argentum.jpa.StatusEntity;
import net.devium.argentum.jpa.StatusRepository;
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

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.core.IsNull.notNullValue;
import static org.junit.Assert.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
public class StatusControllerTest {
    @Autowired
    private StatusRepository statusRepository;

    private StatusController sut;

    private MockMvc mockMvc;

    @Before
    public void setUp() {
        sut = new StatusController(statusRepository);
        mockMvc = MockMvcBuilders.standaloneSetup(sut).build();
    }

    @After
    public void tearDown() throws Exception {
        statusRepository.deleteAll();
    }

    @Test
    public void testGetStatuses() throws Exception {
        StatusEntity status1 = new StatusEntity("someStatus", "Some Status", "#443322");
        StatusEntity status2 = new StatusEntity("someOtherStatus", "Some Other Status", "#112233");
        status1 = statusRepository.save(status1);
        status2 = statusRepository.save(status2);

        mockMvc.perform(get("/statuses"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(2)))
                .andExpect(jsonPath("$.data[0].id", is((int) status1.getId())))
                .andExpect(jsonPath("$.data[0].internalName", is("someStatus")))
                .andExpect(jsonPath("$.data[0].displayName", is("Some Status")))
                .andExpect(jsonPath("$.data[0].color", is("#443322")))
                .andExpect(jsonPath("$.data[1].id", is((int) status2.getId())))
                .andExpect(jsonPath("$.data[1].internalName", is("someOtherStatus")))
                .andExpect(jsonPath("$.data[1].displayName", is("Some Other Status")))
                .andExpect(jsonPath("$.data[1].color", is("#112233")));
    }

    @Test
    public void testMergeStatuses() throws Exception {
        StatusEntity status1 = statusRepository.save(new StatusEntity("someStatus", "Some Status", "#778899"));
        String body = "[" +
                "   { 'id': %s, 'internalName': 'someUpdatedStatus', 'displayName': 'Some Updated Status', 'color': '#998877' }," +
                "   { 'internalName': 'someOtherStatus', 'displayName': 'Some Other Status', 'color': '#112233' }," +
                "   { 'internalName': 'someThirdStatus', 'displayName': 'Some Third Status', 'color': '#332211' }," +
                "   {}" +
                "]";
        body = String.format(body, status1.getId());
        body = body.replace('\'', '"');

        mockMvc.perform(post("/statuses")
                                .contentType(MediaType.APPLICATION_JSON_UTF8)
                                .content(body))
                .andDo(print())
                .andExpect(status().isNoContent());

        assertThat(statusRepository.findAll(), hasSize(4));
        status1 = statusRepository.findOne(status1.getId());
        assertThat(status1.getInternalName(), is("someUpdatedStatus"));
        assertThat(status1.getDisplayName(), is("Some Updated Status"));
        assertThat(status1.getColor(), is("#998877"));
    }

    @Test
    public void testMergeStatusesEmpty() throws Exception {
        statusRepository.save(new StatusEntity("someStatus", "Some Status", "#778899"));
        String body = "[]";

        mockMvc.perform(post("/statuses")
                                .contentType(MediaType.APPLICATION_JSON_UTF8)
                                .content(body))
                .andDo(print())
                .andExpect(status().isNoContent());

        assertThat(statusRepository.findAll(), hasSize(1));
    }

    @Test
    public void testDeleteStatuses() throws Exception {
        StatusEntity status1 = statusRepository.save(new StatusEntity(
                "someStatus", "Some Status", "#112233"
        ));
        StatusEntity status2 = statusRepository.save(new StatusEntity(
                "someOtherStatus", "Some Other Status", "#332211"
        ));
        StatusEntity status3 = statusRepository.save(new StatusEntity(
                "someThirdStatus", "Some Third Status", "#998877"
        ));

        String body = String.format("[ %s, %s ]", status1.getId(), status2.getId());

        mockMvc.perform(delete("/statuses")
                                .contentType(MediaType.APPLICATION_JSON_UTF8)
                                .content(body))
                .andDo(print())
                .andExpect(status().isNoContent());

        assertThat(statusRepository.findAll(), hasSize(1));
        assertThat(statusRepository.findOne(status3.getId()), notNullValue());
    }

    @Test
    public void testDeleteStatusesEmpty() throws Exception {
        String body = "[]";

        mockMvc.perform(delete("/statuses")
                                .contentType(MediaType.APPLICATION_JSON_UTF8)
                                .content(body))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }
}
