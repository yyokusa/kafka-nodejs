# 1
$node admin-and-producer.js

produced messages

Produced event to topic  testtopic1234: key = 52         

Produced event to topic testtopic1234: key = 8          

Produced event to topic testtopic1234: key = 98         

Produced event to topic testtopic1234: key = 35         

Produced event to topic testtopic1234: key = 29         

Produced event to topic testtopic1234: key = 69         


# 2
$node consumer.js

consumer 
ready.{"name":"rdkafka#consumer-1"}

Consumed message on partition 0

Consumed event from topic 
testtopic1234: key = 35         
value = Hello World! 
message 1

Consumed message on partition 0

Consumed event from topic 
testtopic1234: key = 29         
value = Hello World! 
message 2

Consumed message on partition 0

Consumed event from topic 
testtopic1234: key = 69         
value = Hello World! 
message 2

# 3
$node consumer.js

consumer 
ready.{"name":"rdkafka#consumer-1"}

Consumed message on partition 1

Consumed event from topic 
testtopic1234: key = 52         
value = Hello World! 
message 1

Consumed message on partition 1

Consumed event from topic 
testtopic1234: key = 8          
value = Hello World! 
message 2

Consumed message on partition 1

Consumed event from topic 
testtopic1234: key = 98         
value = Hello World! 
message 1





