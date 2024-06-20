import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";
import { TableScrollArea } from "../kafka-table/TableScrollArea";
import { ScrollArea } from "@mantine/core";

const ProducerConsumer = (props) => {
  const [message, setMessage] = useState("");
  const [producedMessages, setProducedMessages] = useState([]);
  const [consumerMessages, setConsumerMessages] = useState([]);

  const fetchConsumerMessages = async () => {
    try {
      const response = await axios.get(
        "https://chatappconsumer-production.up.railway.app/api/messages/latest"
      );
      // Assuming response.data is an array of messages
      const newConsumedMessage = response.data; // Assuming response.data is the returned string message
      console.log(newConsumedMessage);
      props.onreq((prev) => [...prev, newConsumedMessage]);
      setConsumerMessages([...consumerMessages, newConsumedMessage]);
    } catch (error) {
      console.error("Error fetching consumer messages:", error);
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      try {
        // Step 1: Send message to Kafka producer
        const producerResponse = await axios.post(
          "https://chatappproducer-production.up.railway.app/api/kafka/publish",
          null,
          {
            params: { message: message },
          }
        );
        const newProducedMessage = producerResponse.data; // Assuming response.data is the returned string message
        setProducedMessages([...producedMessages, newProducedMessage]);
        setMessage("");

        // Step 2: Fetch latest consumed message from consumer API
        await fetchConsumerMessages(); // Refresh consumer messages after sending new message
      } catch (error) {
        console.error("Error sending or fetching messages:", error);
      }
    }
  };

  return (
    <div className="parentContainer">
      <div className="producerContainer">
        <div style={{ color: "white", fontWeight: "bold" }}>Producer</div>
        <div
          style={{
            marginBottom: "auto",
            alignItems: "center",
          }}
        >
          <ScrollArea>
            <div className="producerMessageContainer">
              {producedMessages.map((msg, index) => (
                <div key={index} className="producerChatBubble">
                  {msg}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="text"
            value={message}
            onChange={handleInputChange}
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              marginRight: "10px",
              height: "35px",
            }}
          />
          <button
            onClick={handleSendMessage}
            style={{
              border: "none",
              backgroundColor: "red",
              color: "#fff",
              borderRadius: "4px",
              cursor: "pointer",
              height: "35px",
              fontWeight: "bold",
              paddingBottom: "30px",
              paddingRight: "20px",
              paddingLeft: "20px",
              paddingTop: "4px",
            }}
          >
            Send
          </button>
        </div>
      </div>
      <div className="consumerContainer">
        <div style={{ color: "white", fontWeight: "bold" }}> Consumer</div>
        <div style={{ marginBottom: "auto" }}>
          <div className="consumerMessageContainer">
            {consumerMessages.map((msg, index) => (
              <div key={index} className="consumerChatBubble">
                {msg.recordvalue}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProducerConsumer;
