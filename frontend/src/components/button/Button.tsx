import Link from 'next/link';
import './button.scss';

interface ButtonProps {
  text: string;
  route?: string;
  onClick?: () => void;
}

export default function Button({ text, route, onClick }: ButtonProps) {
  if (onClick) {
    return (
      <button className="button" onClick={onClick}>
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