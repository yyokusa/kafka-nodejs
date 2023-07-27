const Kafka = require('node-rdkafka');

const admin = Kafka.AdminClient.create({
  'bootstrap.servers': 'localhost:9092' 
});

const newTopic = {
    topic: 'test-topic',
    num_partitions: 2,
    replication_factor: 1
}

// create a new kafka topic 
admin.createTopic(newTopic, (err) => {
        console.log("error: ", err);
    }
);

// create consumer client
const consumer = new Kafka.KafkaConsumer({
    'group.id': 'kafka',
    'metadata.broker.list': 'localhost:9092',
    'enable.auto.commit': false
});

// get all topics
consumer.connect({
    allTopics: true
});

consumer.on('ready', () => {
    consumer.getMetadata({
        allTopics: true
    }, (err, metadata) => {
        if (err) {
            console.error('Error getting metadata');
            console.error(err);
        } else {
            console.log('Metadata', metadata);
        }
    });
});
