import { Select } from "antd";

export default function SelectComponent() {
  return (
    <Select
      defaultValue={"All"}
      style={{
        width: 110,
      }}
      options={[
        { value: "all", label: "All" },
        { value: "users", label: "Users" },
        { value: "claims", label: "Projects" },
        { value: "funds", label: "Contracts" },
      ]}
    />
  );
}
