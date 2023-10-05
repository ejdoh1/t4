const Loader = ({ text }: { text: string }) => {
  return (
    <div className="h-screen">
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%)`,
        }}
        className="text-center"
      >
        <span className="loading loading-lg" />
        <p className="text-gray">{text}</p>
      </div>
    </div>
  );
};

export default Loader;
