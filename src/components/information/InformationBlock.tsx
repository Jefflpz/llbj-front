import './Information-block.css';

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
                <p id="number">{num}</p>
            </span>
            <p id="text">{text}</p>
        </div>
    )
}