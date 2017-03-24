package net.devium.argentum.rest;

import net.devium.argentum.jpa.GuestEntity;
import net.devium.argentum.jpa.GuestRepository;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.util.LinkedList;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
public class GuestControllerTest {
    @Autowired
    private GuestRepository guestRepository;

    private GuestController sut;

    private MockMvc mockMvc;

    @Before
    public void setUp() {
        sut = new GuestController(guestRepository);
        mockMvc = MockMvcBuilders.standaloneSetup(sut).build();
    }

    @After
    public void tearDown() throws Exception {
        guestRepository.deleteAll();
    }

    @Test
    public void testGetGuestsPaginated() throws Exception {
        List<GuestEntity> guests = new LinkedList<>();
        for (int i = 0; i < 5; ++i) {
            guests.add(new GuestEntity(
                    String.format("CODE%s", i),
                    String.format("name%s", i),
                    String.format("mail%s", i),
                    String.format("status%s", i),
                    null,
                    null,
                    new BigDecimal(0),
                    new BigDecimal(0)
            ));
        }
        guests = guestRepository.save(guests);

        mockMvc.perform(get("/guests?page=1&size=2&code=&name=&mail=&status="))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.guestsTotal", is(5)))
                .andExpect(jsonPath("$.data.guests", hasSize(2)))
                .andExpect(jsonPath("$.data.guests[0].id", is((int) guests.get(2).getId())))
                .andExpect(jsonPath("$.data.guests[0].code", is("CODE2")))
                .andExpect(jsonPath("$.data.guests[0].name", is("name2")))
                .andExpect(jsonPath("$.data.guests[0].mail", is("mail2")))
                .andExpect(jsonPath("$.data.guests[0].status", is("status2")))
                .andExpect(jsonPath("$.data.guests[1].id", is((int) guests.get(3).getId())))
                .andExpect(jsonPath("$.data.guests[1].code", is("CODE3")))
                .andExpect(jsonPath("$.data.guests[1].name", is("name3")))
                .andExpect(jsonPath("$.data.guests[1].mail", is("mail3")))
                .andExpect(jsonPath("$.data.guests[1].status", is("status3")));

    }

    @Test
    public void testGetGuestsPaginatedAndFiltered() throws Exception {
        List<GuestEntity> guests = new LinkedList<>();
        guests.add(new GuestEntity(
                "CODE11",
                "name11",
                "mail11",
                "status11",
                null,
                null,
                new BigDecimal(0),
                new BigDecimal(0)
        ));
        guests.add(new GuestEntity(
                "CODE10",
                "name11",
                "mail11",
                "status11",
                null,
                null,
                new BigDecimal(0),
                new BigDecimal(0)
        ));
        guests.add(new GuestEntity(
                "CODE11",
                "name10",
                "mail11",
                "status11",
                null,
                null,
                new BigDecimal(0),
                new BigDecimal(0)
        ));
        guests.add(new GuestEntity(
                "CODE11",
                "name11",
                "mail10",
                "status11",
                null,
                null,
                new BigDecimal(0),
                new BigDecimal(0)
        ));
        guests.add(new GuestEntity(
                "CODE11",
                "name11",
                "mail11",
                "status10",
                null,
                null,
                new BigDecimal(0),
                new BigDecimal(0)
        ));
        guests = guestRepository.save(guests);

        mockMvc.perform(get("/guests?page=0&size=2&code=11&name=11&mail=11&status=11"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.guestsTotal", is(1)))
                .andExpect(jsonPath("$.data.guests", hasSize(1)))
                .andExpect(jsonPath("$.data.guests[0].id", is((int) guests.get(0).getId())));
    }
}
