import './ButtonRedirect.css';
import { Link } from 'react-router-dom';

interface ButtonRedirectProps {
  title: string;
  redirect: string;
}

export default function ButtonRedirect({
  title,
  redirect,
}: ButtonRedirectProps) {
  return (
    <Link to={redirect} className="button-redirect">
      {title}
    </Link>
  );
}
