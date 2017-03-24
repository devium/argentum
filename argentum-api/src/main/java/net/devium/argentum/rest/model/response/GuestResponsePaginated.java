package net.devium.argentum.rest.model.response;

import java.util.List;

public class GuestResponsePaginated {
    private final List<GuestResponse> guests;
    private final long guestsTotal;

    public GuestResponsePaginated(List<GuestResponse> guests, long guestsTotal) {
        this.guests = guests;
        this.guestsTotal = guestsTotal;
    }

    public List<GuestResponse> getGuests() {
        return guests;
    }

    public long getGuestsTotal() {
        return guestsTotal;
    }
}
