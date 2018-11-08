package fr.cpe.jms.consumer;

import javax.ejb.ActivationConfigProperty;
import javax.ejb.MessageDriven;
import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageListener;
import javax.jms.TextMessage;
import java.util.logging.Logger;

@MessageDriven(name = "HelloWorldMDB", activationConfig = {
        @ActivationConfigProperty(propertyName = "destinationType", propertyValue = "javax.jms.Queue"),
        @ActivationConfigProperty(propertyName = "destination", propertyValue = "jmsTp"),
        @ActivationConfigProperty(propertyName = "acknowledgeMode", propertyValue = "Auto-acknowledge") })
public class HelloWorldJmsConsumer implements MessageListener {

    private static Logger logger = Logger.getLogger(HelloWorldJmsConsumer.class.getName());

    @Override
    public void onMessage(Message var1) {
        logger.info(">>> onMessage() - " + var1.toString());

        try {

            if (var1 instanceof TextMessage) {
                String msg = ((TextMessage) var1).getText();
                logger.info(msg);

                // Do something...
            }
        } catch (JMSException e) {
            e.printStackTrace();
        }

        logger.info("<<< onMessage()");
    }
}
