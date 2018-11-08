package fr.cpe.rest.impl;

import fr.cpe.rest.HelloRestService;
import fr.cpe.services.HelloService;
import fr.cpe.services.HelloWorldJmsProducer;

import javax.inject.Inject;

public class HelloRestServiceImpl implements HelloRestService {

    @Inject
    private HelloService helloService;

    @Inject
    private HelloWorldJmsProducer helloWorldJmsProducer;

//    public HelloRestServiceImpl() {
//        super();
//
//        helloService = new HelloService();
//    }

    @Override
    public String hello() {

        helloWorldJmsProducer.sendHelloWord();

        return helloService.hello();
//        return "Hello (REST)";
    }
}
