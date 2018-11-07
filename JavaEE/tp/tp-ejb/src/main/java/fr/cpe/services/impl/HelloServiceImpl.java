package fr.cpe.services.impl;

import fr.cpe.services.HelloService;

import javax.annotation.PostConstruct;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.ejb.Stateless;
import java.util.logging.Logger;

@Singleton
@Startup
public class HelloServiceImpl implements HelloService{

    Logger log = Logger.getLogger(HelloServiceImpl.class.getName());

    public String hello() {
        return "Hello (EJB)";
    }

    @PostConstruct
    public void init() {
        log.info(">>> INIT");
    }
}
