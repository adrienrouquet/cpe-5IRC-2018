package fr.cpe.services.impl;

import fr.cpe.services.HelloWorldJmsProducer;

import javax.annotation.Resource;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.jms.JMSContext;
import javax.jms.Queue;

@Stateless
public class HelloWorldJmsProducerImpl implements HelloWorldJmsProducer {

    @Resource(name = "java:/jmsTp")
    private Queue queue;

    @Inject
    private JMSContext context;

    @Override
    public void sendHelloWord() {
        context.createProducer()
                .send(queue, "Hello world !");
    }
}
