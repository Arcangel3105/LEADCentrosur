import { SVGProps } from "react";

export function CsvIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M8 13h2c.6 0 1 .4 1 1v2c0 .6-.4 1-1 1H8c-.6 0-1-.4-1-1v-2c0-.6.4-1 1-1z" />
      <path d="M12 17h4" />
      <path d="M12 13h4" />
    </svg>
  );
}
