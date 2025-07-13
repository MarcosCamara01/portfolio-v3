export const Callout = ({ text = null, children }: any) => (
  <div className="bg-gray-200 dark:bg-foreground dark:text-gray-300 rounded flex items-start p-3 my-6 text-base gap-2">
    <span className="block w-6 text-center text-color-secondary">
      <RayIcon />
    </span>
    <span className="block grow">{text ?? children}</span>
  </div>
);

const RayIcon = () => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    height="26"
    width="26"
    viewBox="0 0 256 256"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M213.85,125.46l-112,120a8,8,0,0,1-13.69-7l14.66-73.33L45.19,143.49a8,8,0,0,1-3-13l112-120a8,8,0,0,1,13.69,7L153.18,90.9l57.63,21.61a8,8,0,0,1,3,12.95Z"></path>
  </svg>
);
