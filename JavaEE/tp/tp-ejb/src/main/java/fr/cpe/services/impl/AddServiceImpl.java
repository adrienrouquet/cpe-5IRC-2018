package fr.cpe.services.impl;

import fr.cpe.services.AddService;

import javax.ejb.Stateless;
import java.util.List;

@Stateless
public class AddServiceImpl implements AddService {

    @Override
    public Double add(List<Double> a) {
        return a.stream()
                .mapToDouble(Double::doubleValue)
                .sum();
    }
}
