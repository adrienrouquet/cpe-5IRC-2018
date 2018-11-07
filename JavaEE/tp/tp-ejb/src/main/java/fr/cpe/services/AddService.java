package fr.cpe.services;

import javax.ejb.Local;
import java.util.List;

@Local
public interface AddService {

    Double add(List<Double> a);
}
