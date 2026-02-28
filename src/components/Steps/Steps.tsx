import './Steps.css';

interface Props {
    number: string,
    title: string,
    step: string;
}
export default function Steps( { number, title, step }: Props) {
    return (
        <div className='step'>
            <div className='step-number'>
                <p className='number'>{number}</p>
            </div>
            <h2 className='step-title'>{title}</h2>
            <p className='explanation'>{step}</p>
        </div>
    )
}