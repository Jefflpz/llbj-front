import './Footer.css';

export default function Footer() {
    return (
        <div className='footer-background'>
            <div className='footer'>
                <div className='footer-content'>
                    <div className='first-column'>
                        <div className='footer-logo'>
                            <img src="owl.svg" alt="Logo LLBJ" className='icon-footer'/>
                            <h2 className='content-title'>LLBJ</h2>
                        </div>
                        <p>Sua escola, mais inteligente. A plataforma líder em gestão acadêmica moderna para instituições de ensino de alto nível.</p>
                        <div className='icons'>
                            <img src="share.svg" alt="Compartilhar" />
                            <img src="atsign.svg" alt="@" />
                        </div>
                    </div>    
                    <div className='column-content'>
                        <h3 className='content-title'>Plataforma</h3>
                        <p>Funcionalidades</p>
                        <p>Preços</p>
                        <p>Segurança</p>
                        <p>Versão Mobile</p>
                    </div>
                    <div className='column-content'>
                        <h3 className='content-title'>Empresa</h3>
                        <p>Sobre nós</p>
                        <p>Blog</p>
                        <p>Carreiras</p>
                        <p>Privacidade</p>
                    </div>
                    <div className='column-content'>
                        <h3 className='content-title'>Suporte</h3>
                        <p>0800 123 4567</p>
                        <p>contato@gmail.com</p>
                        <p>São Paulo, SP</p>
                    </div>
                </div>
                <hr />
                <div className='footer-bottom'>
                    <p>© 2024 LLBJ - Todos os direitos reservados. Feito com paixão pelo Diogo</p>
                    <div className='footer-end'>
                        <p>Termos de Uso</p>
                        <p>LGPD</p>
                    </div>
                </div>
            </div>
        </div>
    )
}