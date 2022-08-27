const StyledReadOnlyPropertiesSection = (props: any) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-evenly",
        marginTop: "10px",
        flexWrap: "wrap",
      }}
    >
      {props.children}
    </div>
  );
};

export default StyledReadOnlyPropertiesSection;
