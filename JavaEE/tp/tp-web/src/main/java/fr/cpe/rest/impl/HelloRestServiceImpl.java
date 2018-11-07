package fr.cpe.rest.impl;

import fr.cpe.rest.HelloRestService;
import fr.cpe.services.HelloService;

import javax.inject.Inject;

public class HelloRestServiceImpl implements HelloRestService {

    @Inject
    private HelloService helloService;

//    public HelloRestServiceImpl() {
//        super();
//
//        helloService = new HelloService();
//    }

    @Override
    public String hello() {

        return helloService.hello();
//        return "Hello (REST)";
    }
}
