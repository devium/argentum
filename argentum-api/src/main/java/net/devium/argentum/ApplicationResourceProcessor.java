package net.devium.argentum;

import net.devium.argentum.rest.*;
import org.springframework.data.rest.webmvc.RepositoryLinksResource;
import org.springframework.hateoas.ResourceProcessor;
import org.springframework.hateoas.mvc.ControllerLinkBuilder;
import org.springframework.stereotype.Component;

@Component
public class ApplicationResourceProcessor implements ResourceProcessor<RepositoryLinksResource> {
    @Override
    public RepositoryLinksResource process(RepositoryLinksResource resource) {
        resource.add(ControllerLinkBuilder.linkTo(ProductRangeController.class).withRel("ranges"));
        resource.add(ControllerLinkBuilder.linkTo(ProductController.class).withRel("products"));
        resource.add(ControllerLinkBuilder.linkTo(OrderController.class).withRel("orders"));
        resource.add(ControllerLinkBuilder.linkTo(CategoryController.class).withRel("categories"));
        resource.add(ControllerLinkBuilder.linkTo(GuestController.class).withRel("guests"));
        return resource;
    }
}
