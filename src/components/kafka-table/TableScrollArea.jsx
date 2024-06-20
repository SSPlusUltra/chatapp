import cx from "clsx";
import { useState } from "react";
import { Table, ScrollArea } from "@mantine/core";
import classes from "./TableScrollArea.module.css";
import "@mantine/core/styles.css";

export function TableScrollArea(props) {
  const [scrolled, setScrolled] = useState(false);
  console.group(props.reqdata);
  const rows =
    props.reqdata.length > 0 ? (
      props?.reqdata?.map((row) => (
        <Table.Tr key={row.timestamp}>
          <Table.Td>{row.timestamp}</Table.Td>
          <Table.Td>{row.recordoffset}</Table.Td>
          <Table.Td>{row.partition}</Table.Td>
          <Table.Td>{row.recordvalue}</Table.Td>
        </Table.Tr>
      ))
    ) : (
      <Table.Tr>
        <Table.Td>0</Table.Td>
        <Table.Td>0</Table.Td>
        <Table.Td>0</Table.Td>
        <Table.Td>0</Table.Td>
      </Table.Tr>
    );

  return (
    <div className="tableContainer">
      <ScrollArea
        h={300}
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      >
        <Table style={{ color: "white" }} miw={700}>
          <Table.Thead
            className={cx(classes.header, { [classes.scrolled]: scrolled })}
          >
            <Table.Tr>
              <Table.Th>TimeStamp</Table.Th>
              <Table.Th>offset</Table.Th>
              <Table.Th>partition</Table.Th>
              <Table.Th>message</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
    </div>
  );
}
