import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <nav className="footer-nav">
          <Link to="/about">About</Link>
          <Link to="/privacy">Privacy</Link>
        </nav>
        <div className="footer-bottom">
          <p>Built with ❤️ by <a href="https://x.com/debamitro" target="_blank">@debamitro</a> at <a href="https://www.sundai.club/events/boston/sundai-hack-141-agent-memory-frontier" target="_blank">SundAI Hack #141</a></p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
