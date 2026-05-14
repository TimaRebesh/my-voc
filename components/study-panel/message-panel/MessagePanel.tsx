import type { ReactNode } from 'react';

type MessagePanelProps = {
  messages: ReactNode[];
  legend?: string;
  children?: ReactNode;
};

export default function MessagePanel({
  messages,
  legend,
  children,
}: MessagePanelProps) {
  return (
    <div className="flex flex-col items-center px-4 mt-20 text-primary">
      {legend && <p className="font-bold">{legend}</p>}
      {messages.map((message, ind) => (
        <div className="text-sm" key={ind}>
          {message}
        </div>
      ))}
      {children}
    </div>
  );
}
