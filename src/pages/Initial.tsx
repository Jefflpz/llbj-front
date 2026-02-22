import HeaderInitial from "../components/Header/Header";
import "../styles/Initial.css";
import Button from "../components/Buttons/Button";

export default function Initial() {
    return (
        <div className="initial-page">
            <div className="initial-card">
                <HeaderInitial></HeaderInitial>
            </div>
            <div className="content">
                <div className="texts">
                    <h3 className="heading">EDUCAÇÃO DO FUTURO</h3>
                    <p className="head-text">Transforme 
                        <span>sua escola com</span>
                        <span className="highlight">inteligência.</span>
                    </p>
                    <p className="final-text">A escola é um espaço onde o conhecimento, os valores e o respeito caminham juntos na construção do futuro.</p>
                    <div className="buttons">
                    <Button title="Acessar Sistema  🠒" style="green-gradient"></Button>
                    <Button title="Saiba mais" style="white"></Button>
                </div>
                </div>
                
                <img src="teacher img.png" alt="Teacher Image" />
            </div>
        </div>
    );
}