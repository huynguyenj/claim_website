import { Anchor } from "antd";

export default function AnchorComponent() {
  return (
    <>
      <div style={{ padding: "20px" }}>
        <Anchor
          direction="horizontal"
          items={[
            {
              key: "overview",
              href: "#overview",
              title: "Overview",
            },
            {
              key: "details",
              href: "#details",
              title: "Details",
            },
            {
              key: "part-3",
              href: "#part-3",
              title: "More",
            },
          ]}
        />
      </div>
    </>
  );
}
