const Kafka = require('node-rdkafka');

const admin = Kafka.AdminClient.create({
    'bootstrap.servers': 'localhost:9092' 
});

const topicName = 'testtopic1234';
const newTopic = {
    topic: topicName,
    num_partitions: 2,
    replication_factor: 1
}

// create a new kafka topic 
admin.createTopic(newTopic, (err) => {
        if (err)
            console.log("error creating topic: ", err);
    }
);

// create a producer and put some data into test-topic
const producer = new Kafka.Producer({
    'metadata.broker.list': 'localhost:9092',
    'dr_cb': true
});

producer.on('ready', () => {
    producer.produce(
        topicName,
        -1,
        Buffer.from('Hello World! message 1'),
        Math.floor(Math.random() * 100),
    );
    producer.produce(
        topicName,
        -1,
        Buffer.from('Hello World! message 2'),
        // random key
        Math.floor(Math.random() * 100),
    );
    producer.produce(
        topicName,
        -1,
        Buffer.from('Hello World! message 1'),
        Math.floor(Math.random() * 100),
    );
    producer.produce(
        topicName,
        -1,
        Buffer.from('Hello World! message 2'),
        // random key
        Math.floor(Math.random() * 100),
    );
    producer.produce(
        topicName,
        -1,
        Buffer.from('Hello World! message 1'),
        Math.floor(Math.random() * 100),
    );
    producer.produce(
        topicName,
        -1,
        Buffer.from('Hello World! message 2'),
        // random key
        Math.floor(Math.random() * 100),
    );
    producer.flush(10000, () => {
        producer.disconnect();
      });
    console.log('produced messages');
}).on('delivery-report', (err, report) => {
    if (err) {
      console.warn('Error producing', err)
    } else {
      const {topic, key, value} = report;
      let k = key.toString().padEnd(10, ' ');
      console.log(`Produced event to topic ${topic}: key = ${k} value = ${value}`);
    }
  });

producer.connect();
