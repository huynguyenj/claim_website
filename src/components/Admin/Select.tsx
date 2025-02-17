import { Select } from "antd";

export default function SelectComponent() {
  return (
    <Select
      defaultValue={"All"}
      style={{
        width: 200,
      }}
      options={[
        { value: "all", label: "All" },
        { value: "users", label: "Users" },
        { value: "claims", label: "Claims" },
        { value: "funds", label: "Funds" },
      ]}
    />
  );
}
