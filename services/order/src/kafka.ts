import {Kafka, Partitioners} from 'kafkajs';

const kafka = new Kafka({
    clientId: 'order-service',
    brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
});

export const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner,
});

export async function connectKafka() {
    await producer.connect();
}