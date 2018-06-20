package net.devium.argentum.rest;

import com.google.common.collect.ImmutableList;
import net.devium.argentum.jpa.*;
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

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.junit.Assert.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
public class CoatCheckTagControllerTest {
    @Autowired
    private GuestRepository guestRepository;
    @Autowired
    private CoatCheckTagRepository coatCheckTagRepository;
    @Autowired
    private ConfigRepository configRepository;
    @Autowired
    private BalanceEventRepository balanceEventRepository;

    private CoatCheckTagController sut;

    private MockMvc mockMvc;

    @Before
    public void setUp() {
        sut = new CoatCheckTagController(
                coatCheckTagRepository,
                balanceEventRepository,
                guestRepository,
                configRepository
        );
        mockMvc = MockMvcBuilders.standaloneSetup(sut).build();
    }

    @After
    public void tearDown() throws Exception {
        balanceEventRepository.deleteAll();
        coatCheckTagRepository.deleteAll();
        guestRepository.deleteAll();
        configRepository.deleteAll();
    }

    @Test
    public void testGetTags() throws Exception {
        GuestEntity guest1 = guestRepository.save(new GuestEntity(
                "someCode",
                "someName",
                "someMail",
                "someStatus",
                null,
                null,
                BigDecimal.ZERO,
                BigDecimal.ZERO
        ));
        guest1 = guestRepository.save(guest1);
        GuestEntity guest2 = guestRepository.save(new GuestEntity(
                "someOtherCode",
                "someOtherName",
                "someOtherMail",
                "someOtherStatus",
                null,
                null,
                BigDecimal.ZERO,
                BigDecimal.ZERO
        ));
        guest2 = guestRepository.save(guest2);

        CoatCheckTagEntity coatCheckTag1 = coatCheckTagRepository.save(new CoatCheckTagEntity(5, new Date(), guest1));
        CoatCheckTagEntity coatCheckTag2 = coatCheckTagRepository.save(new CoatCheckTagEntity(7, new Date(), guest1));
        CoatCheckTagEntity coatCheckTag3 = coatCheckTagRepository.save(new CoatCheckTagEntity(3, new Date(), guest2));

        String body = "[3, 4, 5]";

        mockMvc.perform(get("/coat_check")
                                .contentType(MediaType.APPLICATION_JSON_UTF8)
                                .content(body)
        )
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].id", is(3)))
                .andExpect(jsonPath("$.data[0].time", notNullValue()))
                .andExpect(jsonPath("$.data[0].guest.id", is((int) guest2.getId())))
                .andExpect(jsonPath("$.data[1].id", is(5)))
                .andExpect(jsonPath("$.data[1].time", notNullValue()))
                .andExpect(jsonPath("$.data[1].guest.id", is((int) guest1.getId())));
    }

    @Test
    public void testGetAllTags() throws Exception {
        GuestEntity guest1 = guestRepository.save(new GuestEntity(
                "someCode",
                "someName",
                "someMail",
                "someStatus",
                null,
                null,
                BigDecimal.ZERO,
                BigDecimal.ZERO
        ));
        guest1 = guestRepository.save(guest1);
        GuestEntity guest2 = guestRepository.save(new GuestEntity(
                "someOtherCode",
                "someOtherName",
                "someOtherMail",
                "someOtherStatus",
                null,
                null,
                BigDecimal.ZERO,
                BigDecimal.ZERO
        ));
        guest2 = guestRepository.save(guest2);

        CoatCheckTagEntity coatCheckTag1 = coatCheckTagRepository.save(new CoatCheckTagEntity(5, new Date(), guest1));
        CoatCheckTagEntity coatCheckTag2 = coatCheckTagRepository.save(new CoatCheckTagEntity(7, new Date(), guest1));
        CoatCheckTagEntity coatCheckTag3 = coatCheckTagRepository.save(new CoatCheckTagEntity(3, new Date(), guest2));

        mockMvc.perform(get("/coat_check"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", containsInAnyOrder(5, 7, 3)));
    }

    @Test
    public void testRegisterTagsAlreadyRegistered() throws Exception {
        GuestEntity guest = guestRepository.save(new GuestEntity(
                "someCode",
                "someName",
                "someMail",
                "someStatus",
                null,
                null,
                BigDecimal.ZERO,
                BigDecimal.ZERO
        ));

        CoatCheckTagEntity coatCheckTag = coatCheckTagRepository.save(new CoatCheckTagEntity(4, new Date(), guest));

        String body = "{" +
                "   'ids': [3, 4, 5]," +
                "   'guestId': %s," +
                "   'price': 1.50" +
                "}";
        body = String.format(body, guest.getId());
        body = body.replace('\'', '"');

        mockMvc.perform(put("/coat_check")
                                .contentType(MediaType.APPLICATION_JSON_UTF8)
                                .content(body)
        )
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error", is("The following tags are already registered: [4].")));
    }

    @Test
    public void testRegisterTagsInsufficientFunds() throws Exception {
        GuestEntity guest = guestRepository.save(new GuestEntity(
                "someCode",
                "someName",
                "someMail",
                "someStatus",
                null,
                null,
                new BigDecimal(1.00),
                BigDecimal.ZERO
        ));

        String body = "{" +
                "   'ids': [3, 4, 5]," +
                "   'guestId': %s," +
                "   'price': 1.50" +
                "}";
        body = String.format(body, guest.getId());
        body = body.replace('\'', '"');

        mockMvc.perform(put("/coat_check")
                                .contentType(MediaType.APPLICATION_JSON_UTF8)
                                .content(body)
        )
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error", is("Insufficient funds.")));
    }

    @Test
    public void testRegisterTags() throws Exception {
        GuestEntity guest1 = guestRepository.save(new GuestEntity(
                "someCode",
                "someName",
                "someMail",
                "someStatus",
                null,
                null,
                new BigDecimal(3.00),
                new BigDecimal(1.00)
        ));
        guest1 = guestRepository.save(guest1);
        GuestEntity guest2 = guestRepository.save(new GuestEntity(
                "someOtherCode",
                "someOtherName",
                "someOtherMail",
                "someOtherStatus",
                null,
                null,
                BigDecimal.ZERO,
                BigDecimal.ZERO
        ));
        guest2 = guestRepository.save(guest2);

        CoatCheckTagEntity coatCheckTag1 = coatCheckTagRepository.save(new CoatCheckTagEntity(5, new Date(), guest1));
        CoatCheckTagEntity coatCheckTag2 = coatCheckTagRepository.save(new CoatCheckTagEntity(7, new Date(), guest1));
        CoatCheckTagEntity coatCheckTag3 = coatCheckTagRepository.save(new CoatCheckTagEntity(3, new Date(), guest2));

        String body = "{" +
                "   'ids': [8, 10, 11]," +
                "   'guestId': %s," +
                "   'price': 2.50" +
                "}";
        body = String.format(body, guest1.getId());
        body = body.replace('\'', '"');

        mockMvc.perform(put("/coat_check")
                                .contentType(MediaType.APPLICATION_JSON_UTF8)
                                .content(body)
        )
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].id", is(8)))
                .andExpect(jsonPath("$.data[0].time", notNullValue()))
                .andExpect(jsonPath("$.data[0].guest.id", is((int) guest1.getId())));

        List<CoatCheckTagEntity> coatCheckTags = coatCheckTagRepository.findAll();
        assertThat(coatCheckTags, hasSize(6));
        assertThat(coatCheckTags.get(3).getId(), is(8L));
        assertThat(coatCheckTags.get(3).getGuest(), is(guest1));
        assertThat(coatCheckTags.get(4).getId(), is(10L));
        assertThat(coatCheckTags.get(4).getGuest(), is(guest1));
        assertThat(coatCheckTags.get(5).getId(), is(11L));
        assertThat(coatCheckTags.get(5).getGuest(), is(guest1));
    }

    @Test
    public void testDeregisterTags() throws Exception {
        GuestEntity guest1 = guestRepository.save(new GuestEntity(
                "someCode",
                "someName",
                "someMail",
                "someStatus",
                null,
                null,
                new BigDecimal(3.00),
                new BigDecimal(1.00)
        ));
        guest1 = guestRepository.save(guest1);
        GuestEntity guest2 = guestRepository.save(new GuestEntity(
                "someOtherCode",
                "someOtherName",
                "someOtherMail",
                "someOtherStatus",
                null,
                null,
                BigDecimal.ZERO,
                BigDecimal.ZERO
        ));
        guest2 = guestRepository.save(guest2);

        CoatCheckTagEntity coatCheckTag1 = coatCheckTagRepository.save(new CoatCheckTagEntity(5, new Date(), guest1));
        CoatCheckTagEntity coatCheckTag2 = coatCheckTagRepository.save(new CoatCheckTagEntity(7, new Date(), guest1));
        CoatCheckTagEntity coatCheckTag3 = coatCheckTagRepository.save(new CoatCheckTagEntity(3, new Date(), guest2));

        String body = "[2,3,4]";

        mockMvc.perform(delete("/coat_check")
                                .contentType(MediaType.APPLICATION_JSON_UTF8)
                                .content(body)
        )
                .andDo(print())
                .andExpect(status().isNoContent());

        List<CoatCheckTagEntity> coatCheckTags = coatCheckTagRepository.findAll();
        assertThat(coatCheckTags, hasSize(2));
        assertThat(coatCheckTags.get(0).getId(), is(5L));
        assertThat(coatCheckTags.get(1).getId(), is(7L));
    }
}
