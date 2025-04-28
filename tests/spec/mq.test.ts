import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import request from "supertest";
import { GATEWAY_URL, loginAndGetToken } from "./setup";

let token: string;
let consumer: Consumer;

const kafka = new Kafka({
    clientId: 'test-client',
    brokers: ['localhost:29092'],
    connectionTimeout: 10000,
    retry: {
        initialRetryTime: 1000,
        retries: 5
    }
});

async function setupConsumer(): Promise<void> {
    consumer = kafka.consumer({ groupId: 'test-group' });

    try {
        await consumer.connect();
        console.log('Connected to Kafka consumer');

        await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error: any) {
        console.error(`Failed to connect consumer: ${error.message}`);
        throw error;
    }
}

async function consumeEvent(): Promise<any> {

    return new Promise((resolve) => {
        consumer.run({
            eachMessage: async ({ message }: EachMessagePayload) => {
                if (message.value) {
                    const content = JSON.parse(message.value.toString());
                    resolve(content);
                }
            }
        });
    });
}

beforeAll(async () => {
    jest.setTimeout(30000);
    token = await loginAndGetToken();
    await setupConsumer();
}, 30000);

afterAll(async () => {
    if (consumer) {
        await consumer.disconnect().catch(err =>
            console.error('Error disconnecting consumer:', err)
        );
    }
});

describe('Kafka MQ event flow verification', () => {
    it('should emit user-created event', async () => {
        await consumer.subscribe({ topic: 'user-created', fromBeginning: false });

        const eventPromise = consumeEvent();

        await new Promise(resolve => setTimeout(resolve, 1000)); // delay ensures subscription is established

        const userRes = await request(GATEWAY_URL)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'User Emit Event',
                email: `emit.${Date.now()}@example.com`
            });

        let userEvent = await eventPromise;
        expect(userEvent).toHaveProperty('email');
        expect(userEvent).toHaveProperty('name');
    }, 15000);
});