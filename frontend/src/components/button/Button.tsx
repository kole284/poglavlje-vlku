import Link from 'next/link';
import './button.scss';

interface ButtonProps {
  text: string;
  route?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export default function Button({ text, route, onClick, disabled }: ButtonProps) {
  if (onClick) {
    return (
      <button className="button" onClick={onClick} disabled={disabled}>
        {text}
      </button>
    );
  }

  if (disabled) {
    return (
      <button className="button" disabled>
        {text}
      </button>
    );
  }

  return (
    <Link href={route || '/'} className="button">
      {text}
    </Link>
  );
}