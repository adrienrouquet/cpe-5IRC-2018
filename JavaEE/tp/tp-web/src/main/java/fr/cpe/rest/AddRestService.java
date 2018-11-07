package fr.cpe.rest;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Path("/add")
public interface AddRestService {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    Double add(@QueryParam("a")List<Double> a);
}
