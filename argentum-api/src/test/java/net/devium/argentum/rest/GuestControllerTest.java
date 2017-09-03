package net.devium.argentum.rest;

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
import java.util.LinkedList;
import java.util.List;

import static net.devium.argentum.constants.ApplicationConstants.DECIMAL_PLACES;
import static org.hamcrest.Matchers.*;
import static org.junit.Assert.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
public class GuestControllerTest {
    @Autowired
    private GuestRepository guestRepository;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private ConfigRepository configRepository;
    @Autowired
    private BalanceEventRepository balanceEventRepository;

    private GuestController sut;

    private MockMvc mockMvc;

    @Before
    public void setUp() {
        sut = new GuestController(guestRepository, orderRepository, balanceEventRepository);
        mockMvc = MockMvcBuilders.standaloneSetup(sut).build();
    }

    @After
    public void tearDown() throws Exception {
        balanceEventRepository.deleteAll();
        orderRepository.deleteAll();
        guestRepository.deleteAll();
        configRepository.deleteAll();
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
                    null, null, BigDecimal.ZERO, BigDecimal.ZERO
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
                "CODE11", "name11", "mail11", "status11", null, null, BigDecimal.ZERO, BigDecimal.ZERO
        ));
        guests.add(new GuestEntity(
                "CODE10", "name11", "mail11", "status11", null, null, BigDecimal.ZERO, BigDecimal.ZERO
        ));
        guests.add(new GuestEntity(
                "CODE11", "name10", "mail11", "status11", null, null, BigDecimal.ZERO, BigDecimal.ZERO
        ));
        guests.add(new GuestEntity(
                "CODE11", "name11", "mail10", "status11", null, null, BigDecimal.ZERO, BigDecimal.ZERO
        ));
        guests.add(new GuestEntity(
                "CODE11", "name11", "mail11", "status10", null, null, BigDecimal.ZERO, BigDecimal.ZERO
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
                "someCode", "someName", "someMail", "someStatus", null, null, new BigDecimal(3.80), new BigDecimal(2.30)
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
        assertThat(guest1.getBalance(), is(BigDecimal.ZERO.setScale(DECIMAL_PLACES, BigDecimal.ROUND_HALF_UP)));
        assertThat(guest1.getBonus(), is(new BigDecimal(3.70).setScale(DECIMAL_PLACES, BigDecimal.ROUND_HALF_UP)));
    }

    @Test
    public void testMergeGuestsStealCard() throws Exception {
        GuestEntity guest1 = guestRepository.save(new GuestEntity(
                "someCode", "someName", "someMail", "someStatus", null, "someCard", new BigDecimal(3.80),
                new BigDecimal(2.30)
        ));

        String body = "[ { 'card': 'someCard', 'name': 'someUpdatedName' } ]";
        body = body.replace('\'', '"');

        mockMvc.perform(post("/guests")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(body))
                .andDo(print())
                .andExpect(status().isOk());

        assertThat(guestRepository.findAll(), hasSize(2));
        assertThat(guestRepository.findOne(guest1.getId()).getCard(), nullValue());
    }

    @Test
    public void testMergeGuestsDuplicateCode() throws Exception {

        String body = "[" +
                "   { 'code': 'someCode', 'name': 'someName' }," +
                "   { 'code': 'someCode', 'name': 'someOtherName' }, " +
                "]";
        body = body.replace('\'', '"');

        mockMvc.perform(post("/guests")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(body))
                .andDo(print())
                .andExpect(status().isBadRequest());

        assertThat(guestRepository.findAll(), empty());
    }

    @Test
    public void testMergeGuestsDuplicateCard() throws Exception {
        String body = "[" +
                "   { 'card': 'someCard', 'name': 'someName' }," +
                "   { 'card': 'someCard', 'name': 'someOtherName' }, " +
                "]";
        body = body.replace('\'', '"');

        mockMvc.perform(post("/guests")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(body))
                .andDo(print())
                .andExpect(status().isBadRequest());

        assertThat(guestRepository.findAll(), empty());
    }

    @Test
    public void testDeleteGuests() throws Exception {
        GuestEntity guest = guestRepository.save(new GuestEntity(
                "someCode", "someName", "someMail", "someStatus", null, "12341234", BigDecimal.ZERO, BigDecimal.ZERO
        ));
        orderRepository.save(new OrderEntity(guest, new Date(), new BigDecimal(5.00)));
        orderRepository.save(new OrderEntity(guest, new Date(), new BigDecimal(3.20)));

        mockMvc.perform(delete("/guests/"))
                .andDo(print())
                .andExpect(status().isNoContent());

        assertThat(orderRepository.findAll(), empty());
        assertThat(guestRepository.findAll(), empty());
    }

    @Test
    public void testGetByCard() throws Exception {
        GuestEntity guest = guestRepository.save(new GuestEntity(
                "someCode", "someName", "someMail", "someStatus", null, "12341234", BigDecimal.ZERO, BigDecimal.ZERO
        ));
        mockMvc.perform(get("/guests/card/12341234"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id", is((int) guest.getId())));
    }

    @Test
    public void testGetByCardNotFound() throws Exception {
        GuestEntity guest = guestRepository.save(new GuestEntity(
                "someCode", "someName", "someMail", "someStatus", null, null, BigDecimal.ZERO, BigDecimal.ZERO
        ));
        mockMvc.perform(get("/guests/card/12341234"))
                .andDo(print())
                .andExpect(status().isNotFound());
    }

    @Test
    public void testGetBySearch() throws Exception {
        GuestEntity guest1 = guestRepository.save(new GuestEntity(
                "CODE10", "someName", "someMail", "someStatus", null, null, BigDecimal.ZERO, BigDecimal.ZERO
        ));
        GuestEntity guest2 = guestRepository.save(new GuestEntity(
                "CODE11", "someOtherName", "someOtherMail", "someStatus", null, null, BigDecimal.ZERO, BigDecimal.ZERO
        ));
        GuestEntity guest3 = guestRepository.save(new GuestEntity(
                "CODE00", "someThirdName", "someThirdMail", "someStatus", null, null, BigDecimal.ZERO, BigDecimal.ZERO
        ));

        mockMvc.perform(get("/guests/search/code/CODE1"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(2)))
                .andExpect(jsonPath("$.data[0].id", is((int) guest1.getId())))
                .andExpect(jsonPath("$.data[1].id", is((int) guest2.getId())));

        mockMvc.perform(get("/guests/search/name/some"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(3)))
                .andExpect(jsonPath("$.data[0].id", is((int) guest1.getId())))
                .andExpect(jsonPath("$.data[1].id", is((int) guest2.getId())))
                .andExpect(jsonPath("$.data[2].id", is((int) guest3.getId())));

        mockMvc.perform(get("/guests/search/name/othername"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].id", is((int) guest2.getId())));

        mockMvc.perform(get("/guests/search/mail/some"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(3)))
                .andExpect(jsonPath("$.data[0].id", is((int) guest1.getId())))
                .andExpect(jsonPath("$.data[1].id", is((int) guest2.getId())))
                .andExpect(jsonPath("$.data[2].id", is((int) guest3.getId())));

        mockMvc.perform(get("/guests/search/mail/thirdmail"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].id", is((int) guest3.getId())));
    }

    @Test
    public void testGetBySearchMax3() throws Exception {
        GuestEntity guest1 = guestRepository.save(new GuestEntity(
                "CODE10", "someName", "someMail", "someStatus", null, null, BigDecimal.ZERO, BigDecimal.ZERO
        ));
        GuestEntity guest2 = guestRepository.save(new GuestEntity(
                "CODE11", "someName", "someMail", "someStatus", null, null, BigDecimal.ZERO, BigDecimal.ZERO
        ));
        GuestEntity guest3 = guestRepository.save(new GuestEntity(
                "CODE12", "someName", "someMail", "someStatus", null, null, BigDecimal.ZERO, BigDecimal.ZERO
        ));
        GuestEntity guest4 = guestRepository.save(new GuestEntity(
                "CODE13", "someName", "someMail", "someStatus", null, null, BigDecimal.ZERO, BigDecimal.ZERO
        ));
        GuestEntity guest5 = guestRepository.save(new GuestEntity(
                "CODE14", "someName", "someMail", "someStatus", null, null, BigDecimal.ZERO, BigDecimal.ZERO
        ));

        mockMvc.perform(get("/guests/code/CODE1"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(3)))
                .andExpect(jsonPath("$.data[0].id", is((int) guest1.getId())))
                .andExpect(jsonPath("$.data[1].id", is((int) guest2.getId())))
                .andExpect(jsonPath("$.data[2].id", is((int) guest3.getId())));
    }

    @Test
    public void testGetBySearchNotFound() throws Exception {
        GuestEntity guest1 = guestRepository.save(new GuestEntity(
                "CODE10", "someName", "someMail", "someStatus", null, null, BigDecimal.ZERO, BigDecimal.ZERO
        ));
        GuestEntity guest2 = guestRepository.save(new GuestEntity(
                "CODE11", "someName", "someMail", "someStatus", null, null, BigDecimal.ZERO, BigDecimal.ZERO
        ));
        GuestEntity guest3 = guestRepository.save(new GuestEntity(
                "CODE00", "someName", "someMail", "someStatus", null, null, BigDecimal.ZERO, BigDecimal.ZERO
        ));

        mockMvc.perform(get("/guests/code/CODE2"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", empty()));
    }

    @Test
    public void testAddBalance() throws Exception {
        GuestEntity guest = guestRepository.save(new GuestEntity(
                "someCode", "someName", "someMail", "someStatus", null, null, new BigDecimal(3.00), BigDecimal.ZERO
        ));

        mockMvc.perform(put("/guests/{guestId}/balance", guest.getId())
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content("2.20"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", closeTo(5.20, 0.001)));

        guest = guestRepository.findOne(guest.getId());
        assertThat(guest.getBalance(), is(new BigDecimal(5.20).setScale(DECIMAL_PLACES, BigDecimal.ROUND_HALF_UP)));
        List<BalanceEventEntity> balanceEvents = balanceEventRepository.findAll();
        assertThat(balanceEvents, hasSize(1));
        BalanceEventEntity balanceEvent = balanceEvents.get(0);
        assertThat(balanceEvent.getGuest(), is(guest));
        assertThat(balanceEvent.getTime(), notNullValue());
        assertThat(balanceEvent.getValue(), is(new BigDecimal(2.20).setScale(DECIMAL_PLACES, BigDecimal.ROUND_HALF_UP)));
    }

    @Test
    public void testAddBalanceGuestNotFound() throws Exception {
        mockMvc.perform(put("/guests/1/balance")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content("2.20"))
                .andDo(print())
                .andExpect(status().isNotFound());
    }

    @Test
    public void testAddBonus() throws Exception {
        GuestEntity guest = guestRepository.save(new GuestEntity(
                "someCode", "someName", "someMail", "someStatus", null, null, BigDecimal.ZERO, new BigDecimal(2.30)
        ));

        mockMvc.perform(put("/guests/{guestId}/bonus", guest.getId())
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content("5.20"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", closeTo(7.50, 0.001)));

        guest = guestRepository.findOne(guest.getId());
        assertThat(guest.getBonus(), is(new BigDecimal(7.50).setScale(DECIMAL_PLACES, BigDecimal.ROUND_HALF_UP)));
    }

    @Test
    public void testAddBonusGuestNotFound() throws Exception {
        mockMvc.perform(put("/guests/1/bonus")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content("5.20"))
                .andDo(print())
                .andExpect(status().isNotFound());
    }

    @Test
    public void testSetCard() throws Exception {
        GuestEntity guest = guestRepository.save(new GuestEntity(
                "someCode", "someName", "someMail", "someStatus", null, null, BigDecimal.ZERO, BigDecimal.ZERO
        ));

        mockMvc.perform(put("/guests/{guestId}/card", guest.getId())
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content("12341234"))
                .andDo(print())
                .andExpect(status().isNoContent());

        guest = guestRepository.findOne(guest.getId());
        assertThat(guest.getCard(), is("12341234"));
    }

    @Test
    public void testSetCardGuestNotFound() throws Exception {
        mockMvc.perform(put("/guests/1/card")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content("12341234"))
                .andDo(print())
                .andExpect(status().isNotFound());
    }

    @Test
    public void testSetCardStealCard() throws Exception {
        GuestEntity guest1 = guestRepository.save(new GuestEntity(
                "someCode", "someName", "someMail", "someStatus", null, "12341234", BigDecimal.ZERO, BigDecimal.ZERO
        ));
        GuestEntity guest2 = guestRepository.save(new GuestEntity(
                "someCode", "someName", "someMail", "someStatus", null, null, BigDecimal.ZERO, BigDecimal.ZERO
        ));

        mockMvc.perform(put("/guests/{guestId}/card", guest2.getId())
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content("12341234"))
                .andDo(print())
                .andExpect(status().isNoContent());

        guest1 = guestRepository.findOne(guest1.getId());
        assertThat(guest1.getCard(), nullValue());
    }

    @Test
    public void testCheckIn() throws Exception {
        GuestEntity guest = guestRepository.save(new GuestEntity(
                "someCode", "someName", "someMail", "someStatus", null, null, BigDecimal.ZERO, BigDecimal.ZERO
        ));

        mockMvc.perform(put("/guests/{guestId}/checkin", guest.getId())
                .contentType(MediaType.APPLICATION_JSON_UTF8))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", notNullValue()));

        guest = guestRepository.findOne(guest.getId());
        assertThat(guest.getCheckedIn(), notNullValue());
    }

    @Test
    public void testCheckInGuestNotFound() throws Exception {
        mockMvc.perform(put("/guests/1/checkin"))
                .andDo(print())
                .andExpect(status().isNotFound());
    }
}
