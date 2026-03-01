import './Header.css';
import Button from '../Buttons/Button';
import { useNavigate } from 'react-router-dom';

export default function HeaderInitial() {
    const navigate = useNavigate();

    return (
        <div className='header'>
            <img src="owl.svg" alt="Owl" className='icon' />
            <div className='nav'>
                <a href="#inicio">
                    <h4>Início</h4>
                </a>
                <a href="#funcionalidades">
                    <h4>Funcionalidades</h4>
                </a>
                <a href="#contato">
                    <h4>Contato</h4>
                </a>
            </div>
            <Button title='Login' style='blue-gradient' onClick={() => navigate('/login')}></Button>
        </div>
    )
}