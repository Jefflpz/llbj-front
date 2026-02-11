import './InformationBlock.css';

interface Information {
    image: string;
    desc: string;
    num: string;
    text: string;
}

export default function InformationBlock({ image, desc, num, text }: Information) {
    return (
        <div className="info-block">
            <span>
                <img src={image} alt={desc} />
                <p className="number">{num}</p>
            </span>
            <p className="text">{text}</p>
        </div>
    )
}