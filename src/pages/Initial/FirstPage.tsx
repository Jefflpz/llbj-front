import HeaderInitial from "../../components/Header/Header";
import "./FirstPage.css";
import Button from "../../components/Buttons/Button";

export default function FirstPage() {
    return (
        <div className="initial-page">
            <div className="initial-card">
                <HeaderInitial></HeaderInitial>
            </div>
            <div className="content">
                <div className="texts">
                    <h3 className="head">EDUCAÇÃO DO FUTURO</h3>
                    <p className="head-text">Transforme 
                        <span>sua escola com</span>
                        <span className="highlight">inteligência.</span>
                    </p>
                    <p className="final-text">A escola é um espaço onde o conhecimento, os valores e o respeito caminham juntos na construção do futuro.</p>
                    <div className="buttons">
                    <Button title="Acessar Sistema  🠒" style="green-gradient"></Button>
                    <Button title="Saiba Mais" style="white"></Button>
                </div>
                </div>
                
                <img src="teacher img.png" alt="Teacher Image" />
            </div>
            <img src="border.svg" alt="border" className="border"/>
        </div>
    );
}