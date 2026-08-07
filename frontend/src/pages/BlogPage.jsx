import { Link } from 'react-router-dom'
import { BLOG_POSTS } from '../data/blogPosts'

function fmtFecha(iso) {
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function BlogPage() {
  return (
    <>
      <header className="page-header">
        <p className="hero-eyebrow">Blog</p>
        <h1>Palabras <em>desde la esterilla</em></h1>
        <p>Reflexiones sobre yoga, cuerpo y práctica — para leer antes o después de tu clase.</p>
      </header>

      <section className="blog-grid-section">
        <div className="blog-grid">
          {BLOG_POSTS.map(post => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="blog-card">
              <div className="blog-card-img">
                <img src={post.imagenPortada} alt={post.imagenPortadaAlt || post.titulo} />
              </div>
              <div className="blog-card-body">
                <p className="blog-card-meta">{fmtFecha(post.fecha)} · {post.tiempoLectura}</p>
                <h2>{post.titulo}</h2>
                <p className="blog-card-resumen">{post.resumen}</p>
                <span className="blog-card-cta">Leer más →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
