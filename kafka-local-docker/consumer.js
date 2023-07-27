const Kafka = require('node-rdkafka');
const topicName = 'testtopic1234';
// create consumer client
const consumer = new Kafka.KafkaConsumer({
    'group.id': 'kafka',
    'metadata.broker.list': 'localhost:9092',
    'enable.auto.commit': false
}, {'auto.offset.reset': 'earliest'});

consumer
    .on('ready', (arg) => {
        console.log('consumer ready.' + JSON.stringify(arg));
        consumer.subscribe([topicName])
        //start consuming messages
        consumer.consume();
    })
    .on('data', ({
        value,
        size,
        topic,
        offset,
        partition,
        key,
        timestamp,
    }) => {
        // print partition
        console.log(`Consumed message on partition ${partition}`);
        let k = key.toString().padEnd(10, ' ');
        console.log(`Consumed event from topic ${topicName}: key = ${k} value = ${value}`);
    })
    .on('error', (err) => {
        console.log(err);
    });

//starting the consumer
consumer.connect();

process.on('SIGINT', () => {
    console.log('\nDisconnecting consumer ...');
    consumer.disconnect();
});
