import './Header.css';
import Button from '../Buttons/Button';

export default function HeaderInitial() {
    return (
        <div className='header'>
            <img src="owl.svg" alt="Owl" className='icon'/>
            <div className='nav'>
                <h4>Início</h4>
                <h4>Funcionalidades</h4>
                <h4>Contato</h4>
            </div>
            <Button title='Login' style='blue-gradient'></Button>
        </div>
    )
}