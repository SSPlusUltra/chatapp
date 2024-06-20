import React, { useState, useEffect } from "react";
import axios from "axios";

const ProducerConsumer = () => {
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
      setTimeout(() => {
        setConsumerMessages([...consumerMessages, newConsumedMessage]);
      }, 1000);
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
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: "95vh",
        gap: "300px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          width: "500px",
          height: "600px",
          borderRadius: 20,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "20px",
        }}
      >
        <div style={{ marginBottom: "auto" }}>
          Producer
          <div style={{ maxHeight: "80%" }}>
            {producedMessages.map((msg, index) => (
              <div
                key={index}
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #ccc",
                  overflowWrap: "break-word",
                }}
              >
                {msg}
              </div>
            ))}
          </div>
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
            }}
          />
          <button
            onClick={handleSendMessage}
            style={{
              padding: "10px 20px",
              border: "none",
              backgroundColor: "#007bff",
              color: "#fff",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </div>
      </div>
      <div
        style={{
          backgroundColor: "white",
          width: "500px",
          height: "600px",
          borderRadius: 20,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          padding: "20px",
        }}
      >
        <div style={{ marginBottom: "auto" }}>
          Consumer
          <div style={{ maxHeight: "80%" }}>
            {consumerMessages.map((msg, index) => (
              <div
                key={index}
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #ccc",
                }}
              >
                {msg}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProducerConsumer;
