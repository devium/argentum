package net.devium.argentum.rest.model.response;

public class ConfigResponse {
    private final boolean prepaid;

    public ConfigResponse(boolean prepaid) {
        this.prepaid = prepaid;
    }

    public boolean isPrepaid() {
        return prepaid;
    }
}
