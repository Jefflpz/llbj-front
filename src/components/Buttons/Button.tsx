import './Button.css';

interface ButtonProps {
    title: string,
    style: string;
}
export default function Button({ title, style }: ButtonProps) {
    return (
        <p className={style}>{title}</p>
    )
}