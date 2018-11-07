package fr.cpe.rest.impl;

import fr.cpe.rest.AddRestService;
import fr.cpe.services.AddService;

import javax.inject.Inject;
import java.util.List;

public class AddRestServiceImpl implements AddRestService {

    @Inject
    private AddService addService;

    @Override
    public Double add(List<Double> a) {
        return addService.add(a);
    }
}
