package net.devium.argentum.rest;

import com.google.common.collect.ImmutableSet;
import net.devium.argentum.jpa.ConfigEntity;
import net.devium.argentum.jpa.ConfigRepository;
import net.devium.argentum.rest.model.response.ConfigResponse;
import net.devium.argentum.rest.model.response.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.lang.invoke.MethodHandles;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/config")
public class ConfigController {
    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
    private ConfigRepository configRepository;

    @Autowired
    public ConfigController(ConfigRepository configRepository) {
        this.configRepository = configRepository;
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<?> getConfig() {
        ConfigEntity postpaidLimit = configRepository.findOne("postpaidLimit");

        ConfigResponse response = new ConfigResponse(
                postpaidLimit == null ? BigDecimal.ZERO : new BigDecimal(postpaidLimit.getValue())
        );

        return Response.ok(response);
    }

    @RequestMapping(method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_UTF8_VALUE,
            produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<?> setConfig(@RequestBody Map<String, String> body) {
        final Set<String> CONFIG_WHITELIST = ImmutableSet.of(
                "postpaidLimit"
        );

        List<ConfigEntity> newConfig = body.entrySet().stream()
                .filter(entry -> CONFIG_WHITELIST.contains(entry.getKey()))
                .map(entry -> new ConfigEntity(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());

        configRepository.save(newConfig);

        return ResponseEntity.noContent().build();
    }
}
