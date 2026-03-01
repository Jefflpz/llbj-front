import './Button.css';

interface ButtonProps {
    title: string;
    style: string;
    onClick?: () => void;
}

export default function Button({ title, style, onClick }: ButtonProps) {
    return (
        <button className={style} id='button' onClick={onClick}>
            {title}
        </button>
    );
}