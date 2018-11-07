package fr.cpe.rest;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("/hello")
public interface HelloRestService {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    String hello();
}
