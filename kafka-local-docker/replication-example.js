const Kafka = require('node-rdkafka');

const admin = Kafka.AdminClient.create({
    'bootstrap.servers': 'localhost:9091,localhost:9092,localhost:9093',
});

const topicName = 'cool-topic-1010';

const newTopic = {
    topic: topicName,
    num_partitions: 2,
    replication_factor: 3,
    config: {
        'min.insync.replicas': '2',
    }
}

// create a new kafka topic 
admin.createTopic(newTopic, (err) => {
        if (err)
            console.log("error creating topic: ", err);
        else {
            console.log("topic created: ", topicName);

            // create consumer client
            const consumer = new Kafka.KafkaConsumer({
                'group.id': 'kafka',
                'metadata.broker.list': 'localhost:9091,localhost:9092,localhost:9093',
            }, {'auto.offset.reset': 'earliest'});

            consumer.on('ready', (arg) => {
                console.log('consumer ready.' + JSON.stringify(arg));
                consumer.subscribe([topicName])
                //start consuming messages
                consumer.consume();

                consumer.getMetadata({
                    topic: topicName,
                    timout: 1000
                }, (err, metadata) => {
                    if (err) {
                        console.error('Error getting metadata');
                        console.error(err);
                    } else {
                        console.log('Metadata', metadata);
                        // print the topics and corresponding partitions
                        metadata.topics.forEach(topic => {
                            if (topic.name !== '__consumer_offsets') {
                                console.log('Topic: ', topic.name);
                                topic.partitions.forEach(partition => console.log('Partition: ', partition));
                            }
                        });
                    }
                });
            });
            // get all topics
            consumer.connect();
        }
    }
);

// node replication-example.js
// topic created:  cool-topic-1010
// consumer ready.{"name":"rdkafka#consumer-2"}
// Metadata {
//   orig_broker_id: 1,
//   orig_broker_name: 'localhost:9091/1',
//   topics: [
//     { name: 'cool-topic-1001', partitions: [Array] },
//     { name: 'cool-topic-1004', partitions: [Array] },
//     { name: 'cool-topic-1010', partitions: [Array] },
//     { name: 'cool-topic-1002', partitions: [Array] },
//     { name: '__consumer_offsets', partitions: [Array] }
//   ],
//   brokers: [
//     { id: 2, host: 'localhost', port: 9092 },
//     { id: 3, host: 'localhost', port: 9093 },
//     { id: 1, host: 'localhost', port: 9091 }
//   ]
// }
// Topic:  cool-topic-1001
// Partition:  { id: 0, leader: 2, replicas: [ 2, 3, 1 ], isrs: [ 2, 3, 1 ] }
// Partition:  { id: 1, leader: 3, replicas: [ 3, 1, 2 ], isrs: [ 3, 1, 2 ] }
// Topic:  cool-topic-1004
// Partition:  { id: 0, leader: 1, replicas: [ 1, 2, 3 ], isrs: [ 1, 2, 3 ] }
// Partition:  { id: 1, leader: 2, replicas: [ 2, 3, 1 ], isrs: [ 2, 3, 1 ] }
// Topic:  cool-topic-1010
// Partition:  { id: 0, leader: 3, replicas: [ 3, 1, 2 ], isrs: [ 3, 1, 2 ] }
// Partition:  { id: 1, leader: 1, replicas: [ 1, 2, 3 ], isrs: [ 1, 2, 3 ] }
// Topic:  cool-topic-1002
// Partition:  { id: 0, leader: 3, replicas: [ 3, 1, 2 ], isrs: [ 3, 1, 2 ] }
// Partition:  { id: 1, leader: 1, replicas: [ 1, 2, 3 ], isrs: [ 1, 2, 3 ] }