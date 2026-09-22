import { Link } from 'react-router-dom'
import './Privacy.css'
import Footer from './Footer'

function Privacy() {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Privacy Policy</h1>
        <Link to="/" className="back-link">← Back to Home</Link>
      </header>

      <section className="page-section">
        <h2>Data We Collect</h2>
        <p>
          When you use YC Idea Checker, we collect the startup idea description you
          provide and the YC batch you select. This information is sent to our server
          to generate a prediction and is not stored permanently.
        </p>
      </section>

      <section className="page-section">
        <h2>How We Use Your Data</h2>
        <p>
          Your idea description is used solely to generate a prediction about whether
          your idea resembles those accepted into the selected YC batch. We do not use
          your ideas for training AI models, marketing, or any other purpose.
        </p>
      </section>

      <section className="page-section">
        <h2>Data Retention</h2>
        <p>
          We do not persistently store the ideas you submit. Your input is processed
          in real-time and discarded after the response is generated. No logs of idea
          submissions are retained beyond standard, ephemeral server request logs.
        </p>
      </section>

      <section className="page-section">
        <h2>Third-Party Services</h2>
        <p>
          Our predictions are generated using AI models that may be hosted by
          third-party providers. When you submit an idea, it may be briefly processed
          by these providers. Their respective privacy policies govern how they handle
          data during processing.
        </p>
      </section>

      <section className="page-section">
        <h2>Cookies &amp; Analytics</h2>
        <p>
          We do not use tracking cookies or third-party analytics. This site does not
          set any cookies on your browser.
        </p>
      </section>

      <section className="page-section">
        <h2>Your Rights</h2>
        <p>
          Since we do not permanently store your personal data, there is no data to
          access, modify, or delete. If you have any questions or concerns about
          privacy, please contact us.
        </p>
      </section>

      <section className="page-section">
        <h2>Changes to This Policy</h2>
        <p>
          We may update this privacy policy from time to time. Any changes will be
          reflected on this page with an updated date.
        </p>
      </section>

      <section className="page-section">
        <p className="last-updated">Last updated: {new Date('09-22-2026').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </section>

      <Footer />
    </div>
  )
}

export default Privacy
