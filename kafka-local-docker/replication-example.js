const Kafka = require('node-rdkafka');

const admin = Kafka.AdminClient.create({
    'bootstrap.servers': 'localhost:9091,localhost:9092,localhost:9093',
});

const topicName = 'cool-topic';

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
    }
);


// create a consumer and read metadata
const consumer = new Kafka.KafkaConsumer({
    'group.id': 'kafka',
    'metadata.broker.list': 'localhost:9091,localhost:9092,localhost:9093',
}, {});

consumer.connect();

consumer.on('ready', () => {
    consumer.getMetadata({
        timeout: 10000
    }, (err, metadata) => {
        if (err) {
            console.log("error getting metadata: ", err);
        } else {
            console.log("metadata: ", metadata);
            // get partitions for topic
            const partitions = metadata.topics.find(t => t.name === topicName).partitions;
            console.log("partitions: ", partitions);
        }
    });
});

// metadata:  {
//     orig_broker_id: 2,
//     orig_broker_name: 'localhost:9092/2',
//     topics: [
//       { name: 'cool-topic', partitions: [Array] },
//       { name: '__consumer_offsets', partitions: [Array] }
//     ],
//     brokers: [
//       { id: 2, host: 'localhost', port: 9092 },
//       { id: 3, host: 'localhost', port: 9093 },
//       { id: 1, host: 'localhost', port: 9091 }
//     ]
//   }
//   partitions:  [
//     { id: 0, leader: 2, replicas: [ 2, 1, 3 ], isrs: [ 2 ] },
//     { id: 1, leader: 3, replicas: [ 3, 2, 1 ], isrs: [ 3, 2, 1 ] }
//   ]
