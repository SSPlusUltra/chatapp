import { useState } from "react";
import "./App.css";
import { TableScrollArea } from "./components/kafka-table/TableScrollArea";
import ProducerConsumer from "./components/producer-consumer/ProducerConsumer";
import { MantineProvider, ScrollArea, Text } from "@mantine/core";

function App() {
  const [tableData, setTableData] = useState([]);
  const [scrolled, setScrolled] = useState(false);

  function handlereq(res) {
    setTableData(res);
  }

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <ScrollArea
        h={800}
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ color: "white", fontSize: "23px", fontWeight: "bold" }}>
            Kafka Demo
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              alignItems: "center",
            }}
          >
            <ProducerConsumer onreq={handlereq} />
            <div
              style={{ color: "#6FC9E8", fontWeight: "bold", fontSize: "20px" }}
            >
              Kafka broker live status:
            </div>
            <TableScrollArea reqdata={tableData} />
          </div>
        </div>
      </ScrollArea>
    </MantineProvider>
  );
}

export default App;
