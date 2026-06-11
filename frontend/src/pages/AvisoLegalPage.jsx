import { Link } from 'react-router-dom'

export default function AvisoLegalPage() {
  return (
    <main className="legal-main">
      <div className="legal-wrap">
        <p className="hero-eyebrow">Legal</p>
        <h1>Aviso Legal</h1>
        <p className="legal-updated">Última actualización: junio de 2026</p>

        <section className="legal-section">
          <p>Con el fin de dar cumplimiento al artículo 10 de la Ley 34/2002 de Servicios de la Sociedad de la Información y del Comercio Electrónico, informamos a los usuarios de nuestros datos:</p>
          <div className="legal-info-box">
            <p><strong>Denominación:</strong> Paula Castillo Toldos</p>
            <p><strong>Domicilio:</strong> Urbanización Aldea del Coto, portal 2, escalera 2, Chiclana de la Frontera (Cádiz)</p>
            <p><strong>Teléfono:</strong> <a href="tel:+34722439479">722 439 479</a></p>
            <p><strong>Email:</strong> <a href="mailto:paula_ctc@hotmail.es">paula_ctc@hotmail.es</a></p>
            <p><strong>Sitio Web:</strong> <a href="https://proyectoyoga-production.up.railway.app/">proyectoyoga-production.up.railway.app</a></p>
          </div>
        </section>

        <section className="legal-section">
          <h2>1. Objeto</h2>
          <p>
            Paula Castillo Toldos (en adelante también «el prestador»), como responsable del sitio web, pone a disposición de los usuarios el presente documento, que regula el uso del sitio web con el que se pretende dar cumplimiento a las obligaciones que dispone la Ley 34/2002, de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSICE), así como informar a todos los usuarios del sitio web respecto de cuáles son las condiciones de uso.
          </p>
          <p>
            A través de la web, Paula Castillo Toldos facilita a los usuarios el acceso y utilización de diferentes servicios y contenidos puestos a disposición a través del sitio web.
          </p>
          <p>
            Toda persona que acceda a esta web asume el papel de usuario (en adelante «el usuario»), e implica la aceptación total y sin reservas de todas y cada una de las disposiciones incluidas en este aviso legal, así como a cualesquiera otras disposiciones legales que fueran de aplicación.
          </p>
          <p>
            Como usuarios, tienen que leer atentamente este Aviso Legal en cualquiera de las ocasiones en que entren a la web, pues esta puede sufrir modificaciones ya que el prestador se reserva el derecho a modificar cualquier tipo de información que pudiera aparecer en la web, sin que exista la obligación de pre-avisar o poner en conocimiento de los usuarios dichas obligaciones, siendo suficiente la publicación en el sitio web.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Condiciones de acceso y uso de la web</h2>

          <h3>2.1. Veracidad de la información</h3>
          <p>
            Toda la información que facilita el usuario tiene que ser veraz. El usuario garantiza la autenticidad de los datos comunicados a través de los formularios de contacto. Será responsabilidad del usuario mantener toda la información facilitada permanentemente actualizada. En todo caso, el usuario será el único responsable de las manifestaciones falsas o inexactas que realice y de los perjuicios que cause al prestador o a terceros.
          </p>

          <h3>2.2. Menores de edad</h3>
          <p>
            Para el uso de los servicios, los menores de edad tienen que obtener siempre previamente el consentimiento de los padres, tutores o representantes legales, responsables últimos de todos los actos realizados por los menores a su cargo. La responsabilidad en la determinación de contenidos concretos a los cuales acceden los menores corresponde a aquellos.
          </p>

          <h3>2.3. Obligación de hacer un uso correcto de la web</h3>
          <p>
            El usuario se compromete a utilizar la web de conformidad a la Ley y al presente Aviso Legal, así como a la moral y buenas costumbres. A tal efecto, el usuario se abstendrá de utilizar la página con finalidades ilícitas o prohibidas, lesivas de derechos e intereses de terceros, o que de cualquier forma puedan dañar, inutilizar, sobrecargar, deteriorar o impedir la normal utilización de equipos informáticos o documentos del prestador.
          </p>
          <p>En particular, el usuario se compromete a no transmitir, difundir o poner a disposición de terceros material que:</p>
          <ul className="legal-list">
            <li>Sea contrario a los derechos fundamentales y libertades públicas reconocidas constitucionalmente;</li>
            <li>Induzca, incite o promueva actuaciones delictivas, denigrantes, difamatorias, violentas o contrarias a la ley;</li>
            <li>Promueva actitudes discriminatorias por razón de sexo, raza, religión, creencias, edad o condición;</li>
            <li>Sea contrario al derecho al honor, a la intimidad personal o familiar o a la propia imagen;</li>
            <li>Perjudique la credibilidad del prestador o de terceros;</li>
            <li>Constituya publicidad ilícita, engañosa o desleal.</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>3. Exclusión de garantías y responsabilidad</h2>
          <p>
            El prestador se exime de cualquier tipo de responsabilidad derivada de la información publicada en el sitio web, siempre que esta información haya sido manipulada o introducida por un tercero ajeno.
          </p>
          <p>
            Esta web ha sido revisada y probada para que funcione correctamente. Sin embargo, el prestador no descarta la posibilidad de que existan determinados errores de programación, o que sucedan causas de fuerza mayor, catástrofes naturales, huelgas u otras circunstancias que hagan imposible el acceso a la página web.
          </p>
          <p>
            Paula Castillo Toldos no otorga ninguna garantía ni se hace responsable de los daños y perjuicios de cualquier naturaleza derivados de la falta de disponibilidad o del funcionamiento de la web; de la existencia de virus o programas maliciosos en los contenidos; o del uso ilícito, negligente o fraudulento de los mismos.
          </p>
        </section>

        <section className="legal-section">
          <h2>4. Cookies</h2>
          <p>
            El sitio web del prestador puede utilizar cookies para llevar a cabo determinadas funciones consideradas imprescindibles para el correcto funcionamiento y visualización del sitio. En ningún caso se utilizarán las cookies para recoger información de carácter personal.
          </p>
          <p>
            Para más información, consulta nuestra <Link to="/politica-cookies">Política de Cookies</Link>.
          </p>
        </section>

        <section className="legal-section">
          <h2>5. Enlaces (links)</h2>
          <p>
            Desde el sitio web es posible que se redirija a contenidos de terceras webs. Dado que no siempre se pueden controlar los contenidos introducidos por terceros, Paula Castillo Toldos no asume ningún tipo de responsabilidad respecto a estos contenidos. En todo caso, el prestador procederá a la retirada inmediata de cualquier contenido que pudiera contravenir la legislación nacional o internacional, la moral o el orden público.
          </p>
        </section>

        <section className="legal-section">
          <h2>6. Protección de datos personales</h2>
          <p>
            El prestador está comprometido con el cumplimiento de la normativa de protección de datos personales y garantiza el cumplimiento íntegro de las obligaciones dispuestas en el Reglamento Europeo de Protección de Datos (RGPD) y la normativa española de protección de datos.
          </p>
        </section>

        <section className="legal-section">
          <h2>7. Redes sociales</h2>
          <p>
            Paula Castillo Toldos puede estar presente en redes sociales. El tratamiento de los datos que los usuarios incluyan en las mismas se regirá por las condiciones de uso, políticas de privacidad y normativas de acceso de las redes sociales correspondientes y aceptadas previamente por el usuario. El prestador tratará sus datos con el fin de informarle de las actividades, productos o servicios a través de estas redes, pero no se hará responsable de sus políticas de privacidad.
          </p>
          <p>Queda prohibida la publicación de contenidos que:</p>
          <ul className="legal-list">
            <li>Sean presuntamente ilícitos o contravengan los principios de la buena fe;</li>
            <li>Atenten contra los derechos fundamentales de las personas o generen opiniones negativas en usuarios o terceros;</li>
            <li>Contravengan los principios de legalidad, protección de la dignidad humana, protección de menores o protección del consumidor.</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>8. Propiedad intelectual e industrial</h2>
          <p>
            El sitio web, incluyendo la programación, diseños, logotipos, textos, vídeos, fotografías y gráficos, son propiedad del prestador o dispone de licencia o autorización expresa por parte de los autores. Todos los contenidos del sitio web se encuentran protegidos por la normativa de propiedad intelectual e industrial.
          </p>
          <p>
            La reproducción total o parcial, uso, distribución y comunicación pública requieren de la autorización escrita previa por parte del prestador. Cualquier uso no autorizado será considerado un incumplimiento grave de los derechos de propiedad intelectual o industrial del autor.
          </p>
          <p>
            Para cualquier observación respecto a posibles incumplimientos de los derechos de propiedad intelectual o industrial, puede contactar a través del email <a href="mailto:paula_ctc@hotmail.es">paula_ctc@hotmail.es</a>.
          </p>
        </section>

        <section className="legal-section">
          <h2>9. Ley aplicable y jurisdicción</h2>
          <p>
            Para la resolución de las controversias o cuestiones relacionadas con la presente página web o de las actividades en esta desarrolladas, será de aplicación la legislación española, a la que se someten expresamente las partes, siendo competentes para la resolución de todos los conflictos los Juzgados y Tribunales españoles.
          </p>
        </section>

        <section className="legal-section legal-contact">
          <h2>Datos de contacto</h2>
          <address className="legal-address">
            <strong>Paula Castillo Toldos</strong><br />
            Urbanización Aldea del Coto, portal 2, escalera 2<br />
            Chiclana de la Frontera, Cádiz<br />
            <br />
            Teléfono: <a href="tel:+34722439479">722 439 479</a><br />
            Email: <a href="mailto:paula_ctc@hotmail.es">paula_ctc@hotmail.es</a>
          </address>
        </section>
      </div>
    </main>
  )
}
