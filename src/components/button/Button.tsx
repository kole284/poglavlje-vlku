import Link from 'next/link';
import './button.scss';

interface ButtonProps {
  text: string;
  route: string;
}

export default function Button({ text, route }: ButtonProps) {
  return (

    <Link href={route} className="button">
      {text}
    </Link>
  );
}