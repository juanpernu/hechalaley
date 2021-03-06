/* eslint-disable jsx-a11y/iframe-has-title */
import Link from 'next/link'
import Layout from '../layout'
import Anchor from '../anchor'

export default () => (
  <Layout className='cover-page'>
    <Anchor id='proposal' />
    <div className='proposal-page' id='proposal-page'>
      <style jsx>
        {`
          span {
            display: inline;
            
          }
          
          a {
            text-decoration: underline;
            color: #fe3e68;
          }

          .proposal-title {
            text-align: center;
            color: #fe3e68;
            padding-bottom: 15px;
          }

          .proposal-title::after {
            content: '';
            display: inline-block;
            margin-left: 7px;
            width: 20px;
            height: 4px;
            background-color: #2b3245;
          }
          
          .proposal-content {
            padding-top: 50px;
            display: grid;
            grid-template-columns: 49% 49%;
            grid-column-gap: 25px;
          }

          .proposal-content-items {
            align-self: center;
          }

          .proposal-content-items p {
            margin: 10px 0;
            font-size: 16px;
            line-height: 20px;
          }

          .ins-color {
            background-color: rgba(81, 254, 62, 0.31);
          }

          .del-color {
            background-color: rgba(254, 62, 104, 0.42);
          }

          .proposal-img {
            width: 100%;
            margin: 0 auto;
            height: auto;
          }

          @media screen  and (max-width: 480px) {
            .proposal-content {
              padding-top: 20px;
              display: flex;
              flex-direction: column-reverse;
            }

            .proposal-content img {
              margin-top: 20px;
            }
          }

        `}
      </style>
      <div className='proposal-content'>
        <img src='/static/proposal-congress.jpg' alt='Hecha la Ley - Propuesta' className='proposal-img' />
        <div className='proposal-content-items'>
          <h2 className='proposal-title'>Nuestra propuesta</h2>
          <p>
            Hecha la Ley busca <span className='ins-color'>transparentar</span> el trabajo en el Congreso Nacional y <span className='ins-color'>exponer cómo se mueven y cambian los proyectos</span> de ley en el proceso lgislativo.
          </p>
          <p>
            Hasta su aprobación definitiva un proyecto de ley atraviesa debates, negociaciones y revisiones.
          </p>
          <p>
            Invitamos a <span className='del-color'> periodistas, activistas, organizaciones de la sociedad civil, ciudadanas y ciudadanos</span>
            que se encuentren interesados en conocer el trabajo legislativo y proceso que
            se lleva a cabo para tratar los proyectos de ley en el Congreso Nacional de la República Argentina.
          </p>
          <p>
            Si querés tener más información sobre el Camino de la ley, <Link href='https://www.congreso.gob.ar/leyes.php'><a>hacé click acá.</a></Link>
          </p>
        </div>
      </div>
    </div>
  </Layout>
)
