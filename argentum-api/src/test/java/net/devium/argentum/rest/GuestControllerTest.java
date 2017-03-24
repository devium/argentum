package net.devium.argentum.rest;

import net.devium.argentum.jpa.GuestEntity;
import net.devium.argentum.jpa.GuestRepository;
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
import java.util.LinkedList;
import java.util.List;

import static net.devium.argentum.ApplicationConstants.DECIMAL_PLACES;
import static org.hamcrest.Matchers.*;
import static org.junit.Assert.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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

    @Test
    public void testMergeGuests() throws Exception {
        GuestEntity guest1 = guestRepository.save(new GuestEntity(
                "someCode",
                "someName",
                "someMail",
                "someStatus",
                null,
                null,
                new BigDecimal(3.80),
                new BigDecimal(2.30)
        ));
        String body = "[" +
                "   { 'id': %s, 'code': 'someUpdatedCode', 'name': 'someUpdatedName', 'mail': 'someUpdatedMail', " +
                "       'status': 'someUpdatedStatus', 'checkedIn': 1490357316000, 'card': 'someCard', 'bonus': 3.70 }," +
                "   { 'code': 'someOtherCode', 'name': 'someOtherName', 'mail': 'someOtherMail', " +
                "       'status': 'someOtherStatus', 'checkedIn': null, 'card': 'someOtherCard', 'balance': 1.30 }, " +
                "   { 'code': 'someThirdCode', 'name': 'someThirdName', 'mail': 'someThirdMail', " +
                "       'status': 'someThirdStatus', 'checkedIn': 1490358516000, 'card': null, 'bonus': 1.50, 'balance': 2.10 }, " +
                "   {}" +
                "]";
        body = String.format(body, guest1.getId());
        body = body.replace('\'', '"');

        mockMvc.perform(post("/guests")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(body))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(4)))
                .andExpect(jsonPath("$.data[0].id", is((int) guest1.getId())))
                .andExpect(jsonPath("$.data[0].code", is("someUpdatedCode")))
                .andExpect(jsonPath("$.data[0].name", is("someUpdatedName")))
                .andExpect(jsonPath("$.data[0].mail", is("someUpdatedMail")))
                .andExpect(jsonPath("$.data[0].status", is("someUpdatedStatus")))
                .andExpect(jsonPath("$.data[0].checkedIn", is(1490357316000L)))
                .andExpect(jsonPath("$.data[0].card", is("someCard")))
                .andExpect(jsonPath("$.data[0].balance", closeTo(0.00, 0.001)))
                .andExpect(jsonPath("$.data[0].bonus", closeTo(3.70, 0.001)))
                .andExpect(jsonPath("$.data[1].id").isNumber())
                .andExpect(jsonPath("$.data[1].code", is("someOtherCode")))
                .andExpect(jsonPath("$.data[1].name", is("someOtherName")))
                .andExpect(jsonPath("$.data[1].mail", is("someOtherMail")))
                .andExpect(jsonPath("$.data[1].status", is("someOtherStatus")))
                .andExpect(jsonPath("$.data[1].checkedIn", nullValue()))
                .andExpect(jsonPath("$.data[1].card", is("someOtherCard")))
                .andExpect(jsonPath("$.data[1].balance", closeTo(1.30, 0.001)))
                .andExpect(jsonPath("$.data[1].bonus", closeTo(0.00, 0.001)))
                .andExpect(jsonPath("$.data[2].id").isNumber())
                .andExpect(jsonPath("$.data[2].code", is("someThirdCode")))
                .andExpect(jsonPath("$.data[2].name", is("someThirdName")))
                .andExpect(jsonPath("$.data[2].mail", is("someThirdMail")))
                .andExpect(jsonPath("$.data[2].status", is("someThirdStatus")))
                .andExpect(jsonPath("$.data[2].checkedIn", is(1490358516000L)))
                .andExpect(jsonPath("$.data[2].card", nullValue()))
                .andExpect(jsonPath("$.data[2].balance", closeTo(2.10, 0.001)))
                .andExpect(jsonPath("$.data[2].bonus", closeTo(1.50, 0.001)))
                .andExpect(jsonPath("$.data[3].id").isNumber())
                .andExpect(jsonPath("$.data[3].code", is("")))
                .andExpect(jsonPath("$.data[3].name", is("")))
                .andExpect(jsonPath("$.data[3].mail", is("")))
                .andExpect(jsonPath("$.data[3].status", is("")))
                .andExpect(jsonPath("$.data[3].checkedIn", nullValue()))
                .andExpect(jsonPath("$.data[3].card", nullValue()))
                .andExpect(jsonPath("$.data[3].balance", closeTo(0.00, 0.001)))
                .andExpect(jsonPath("$.data[3].bonus", closeTo(0.00, 0.001)));

        assertThat(guestRepository.findAll(), hasSize(4));
        guest1 = guestRepository.findOne(guest1.getId());
        assertThat(guest1.getCode(), is("someUpdatedCode"));
        assertThat(guest1.getName(), is("someUpdatedName"));
        assertThat(guest1.getMail(), is("someUpdatedMail"));
        assertThat(guest1.getStatus(), is("someUpdatedStatus"));
        assertThat(guest1.getCheckedIn().getTime(), is(1490357316000L));
        assertThat(guest1.getCard(), is("someCard"));
        assertThat(guest1.getBalance(), is(new BigDecimal(0.0).setScale(DECIMAL_PLACES, BigDecimal.ROUND_HALF_UP)));
        assertThat(guest1.getBonus(), is(new BigDecimal(3.70).setScale(DECIMAL_PLACES, BigDecimal.ROUND_HALF_UP)));
    }
}
