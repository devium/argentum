package net.devium.argentum;

import net.devium.argentum.rest.ProductRangeController;
import org.springframework.data.rest.webmvc.RepositoryLinksResource;
import org.springframework.hateoas.ResourceProcessor;
import org.springframework.hateoas.mvc.ControllerLinkBuilder;
import org.springframework.stereotype.Component;

@Component
public class ApplicationResourceProcessor implements ResourceProcessor<RepositoryLinksResource> {
    @Override
    public RepositoryLinksResource process(RepositoryLinksResource resource) {
        resource.add(ControllerLinkBuilder.linkTo(ProductRangeController.class).withRel("product_ranges"));
        resource.add(ControllerLinkBuilder.linkTo(ProductRangeController.class).withRel("products"));
        return resource;
    }
}
