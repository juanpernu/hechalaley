/* eslint-disable jsx-a11y/iframe-has-title */
import Link from 'next/link'
import Layout from '../layout'

export default () => (
  <Layout className='cover-page'>
    <div className='about-us-page' id='about-us-page'>
      <style jsx>
        {`
          a {
            color: #fe3e68;
            cursor: pointer;
          }

          a:hover {
            text-decoration: underline;
          }

          .about-us-page{
            padding: 200px 0;
            max-width: 1000px;
            margin: 0 auto;
          }

          .about-us-title {
            color: #2b3245;
            margin-bottom: 60px;
          }

          .about-us-title::after {
            content: '';
            display: inline-block;
            margin-left: 7px;
            width: 20px;
            height: 4px;
            background-color: #fe3e68;
          }

          .about-us-subtitle {
            color: #2b3245;
            margin-bottom: 15px;
          }

          .about-us-subtitle + p {
            margin-bottom: 15px;
          }
          
          .about-us-content {
            display: grid;
            grid-template-columns: 50% 50%;
          }

          .dl-logo {
            width: 95px;
            height: auto;
            margin-bottom: 15px;
          }

          .about-us-info {
            padding: 3px 0;
          }
        `}
      </style>
      <h2 className='about-us-title'>Sobre nosotros</h2>
      <div className='about-us-content'>
        <div className='about-us-content-column'>
          <h3 className='about-us-subtitle'>¿Quienes somos?</h3>
          <p>Directorio Legislativo</p>
          <img src='/static/logo-dl4americas.svg' alt='Directorio Legislativo - Logo' className='dl-logo' />
          <p className='about-us-info'>info@directoriolegislativo.org</p>
          <p className='about-us-info'>Dirección: Entre Ríos 258 3ºE, C.P. 1079</p>
          <p className='about-us-info'>Teléfono: (+54 11) 5218-4647</p>
          <p className='about-us-info'>www.directoriolegislativo.org</p>
        </div>
        <div className='about-us-content-column'>
          <h3 className='about-us-subtitle'>Legal</h3>
          <Link><a>Términos y condiciones</a></Link>
        </div>
      </div>
    </div>
  </Layout>
)