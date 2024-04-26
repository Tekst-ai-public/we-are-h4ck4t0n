interface LoadingProps {
  color?: string;
  size?: number;
}

function Loading({ color = 'white', size = 15 }: LoadingProps) {
  return (
    <div
      className={`flex items-center justify-center`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <svg id="loading-svg" viewBox="25 25 50 50">
        <circle id="loading-circle" cx="50" cy="50" r="20" stroke={color}></circle>
      </svg>
    </div>
  );
}

export default Loading;
