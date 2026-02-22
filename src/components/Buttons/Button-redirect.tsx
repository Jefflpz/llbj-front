import './Button-redirect.css';
import { Link } from 'react-router-dom';

interface Button {
  title: string;
  redirect: string;
}

export default function ButtonRedirect({ title, redirect }: Button) {
  return (
    <Link to={redirect} className="button-redirect">
      {title}
    </Link>
  );
}
