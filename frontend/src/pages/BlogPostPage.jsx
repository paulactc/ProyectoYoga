import { Link, useParams } from 'react-router-dom'
import { getPostBySlug } from '../data/blogPosts'

function fmtFecha(iso) {
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}

function Bloque({ bloque }) {
  if (bloque.tipo === 'subtitulo') return <h2 className="blog-post-subtitulo">{bloque.texto}</h2>
  if (bloque.tipo === 'imagen') {
    return (
      <figure className="blog-post-imagen">
        <img src={bloque.src} alt={bloque.alt || ''} />
      </figure>
    )
  }
  return <p className="blog-post-parrafo">{bloque.texto}</p>
}

export default function BlogPostPage() {
  const { slug } = useParams()
  const post = getPostBySlug(slug)

  if (!post) {
    return (
      <section className="blog-post-notfound">
        <h1>No hemos encontrado este artículo</h1>
        <Link to="/blog" className="btn">← Volver al blog</Link>
      </section>
    )
  }

  return (
    <article className="blog-post">
      <header className={`blog-post-hero${slug === 'el-ego-espiritual' ? ' blog-post-hero--ego' : ''}${slug === 'abhyasa-y-vairagya' ? ' blog-post-hero--abhyasa' : ''}`}>
        <img
          src={post.imagenPortada}
          alt={post.imagenPortadaAlt || post.titulo}
          className={`blog-post-hero-img${slug === 'el-ego-espiritual' ? ' blog-post-hero-img--ego' : ''}${slug === 'abhyasa-y-vairagya' ? ' blog-post-hero-img--abhyasa' : ''}`}
        />
        <div className="blog-post-hero-overlay" />
        <div className="blog-post-hero-content">
          <Link to="/blog" className="blog-post-back">← Volver al blog</Link>
          <p className="blog-post-meta">{fmtFecha(post.fecha)} · {post.tiempoLectura}</p>
          <h1>{post.titulo}</h1>
        </div>
      </header>

      <div className="blog-post-body">
        {post.contenido.map((bloque, i) => <Bloque key={i} bloque={bloque} />)}
      </div>

      <div className="blog-post-cta">
        <p>Si te apetece llevar esto al cuerpo, el Pack Raíz te espera con 8 clases para empezar.</p>
        <div className="blog-post-cta-actions">
          <Link to="/aula-online" className="btn">Ver el Pack Raíz →</Link>
          <a href="/#contacto" className="btn btn-outline">O escríbeme →</a>
        </div>
      </div>
    </article>
  )
}
