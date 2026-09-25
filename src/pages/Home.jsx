import {FiArrowRight,FiBarChart2,FiCheckCircle,FiCode,FiCpu,FiGitBranch,FiShield,FiTarget,FiZap,} from "react-icons/fi";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Home.css";
const features = [
 {
    icon: <FiCpu />,
    title: "AI Bug Prediction",
    description:
      "Analyze source code using intelligent analysis techniques to identify areas that may contain potential bugs.",
 },
 {
    icon: <FiTarget />,
    title: "Risk Score",
    description:
      "Get a clear risk score that helps you understand the potential problem level of your code.",
 },
 {
    icon: <FiCode />,
    title: "Multiple Languages",
    description:
     "Analyze code written in languages such as Java, Python, JavaScript, C++, C# and more.",
 },
{
    icon: <FiBarChart2 />,
    title: "Code Quality",
    description:
      "Understand code complexity, maintainability and other quality-related indicators.",
 },
 {
    icon: <FiGitBranch />,
    title: "Version Comparison",
    description:
      "Compare different versions of your source code and identify newly introduced potential problems.",
 },
 {
    icon: <FiZap />,
    title: "Smart Suggestions",
    description:
      "Receive explanations and suggestions that can help improve and optimize your source code.",
 },
];
const steps = [
  {
    number: "01",
    title: "Upload or Paste Code",
    description:
      "Add your source code using the editor or upload a supported source-code file.",
  },
  {
    number: "02",
    title: "Select Language",
    description:
      "Choose the programming language so the analyzer can apply the appropriate analysis rules.",
  },
  {
    number: "03",
    title: "Run Analysis",
    description:
      "The system examines code structure, patterns, complexity and potential error conditions.",
  },
  {
    number: "04",
    title: "Review Results",
    description:
      "View predicted bugs, severity, risk score, explanations and recommended improvements.",
  },
];
const Home = () => {
  return (
    <div className="home-page">
      <Navbar />
      <main>
       <section className="hero-section">
          <div className="hero-container">
            <div className="hero-content">
              <div className="hero-badge">
                <FiCpu />
                AI-Powered Code Analysis
              </div>
              <h1>
                Find Potential Bugs
                <span>Before They Find You.</span>
              </h1>
              <p>
                Analyze your source code with intelligent bug prediction,
                code-quality analysis and AI-generated recommendations.
                Identify potential problems before execution or deployment.
              </p>
              <div className="hero-buttons">
                <Link to="/login" className="primary-button">
                  Analyze Your Code
                  <FiArrowRight />
                </Link>
                <a href="#how-it-works" className="secondary-button">
                  See How It Works
                </a>
              </div>
              <div className="hero-trust">
                <div>
                  <FiCheckCircle />
                  Multiple Languages
                </div>
                <div>
                  <FiShield />
                  Secure Analysis
                </div>
                <div>
                  <FiTarget />
                  Risk Detection
                </div>
              </div>
            </div>
           <div className="hero-code-card">
              <div className="code-window-header">
                <div className="window-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span>Example.java</span>
                <div className="risk-mini">Risk 78%</div>
              </div>
              <div className="code-content">
                <div className="code-line">
                  <span>01</span>
                  <code>
                    public class <b>Example</b> {"{"}
                  </code>
                </div>
                <div className="code-line">
                  <span>02</span>
                  <code>
                    &nbsp;&nbsp;public static void main
                  </code>
                </div>
                <div className="code-line">
                  <span>03</span>
                  <code>&nbsp;&nbsp;{"{"}</code>
                </div>
                <div className="code-line warning-line">
                  <span>04</span>
                  <code>
                    &nbsp;&nbsp;&nbsp;&nbsp;int result = 10 / 0;
                  </code>
                </div>
                <div className="code-line">
                  <span>05</span>
                  <code>
                    &nbsp;&nbsp;&nbsp;&nbsp;System.out.println(result);
                  </code>
                </div>
                <div className="code-line">
                  <span>06</span>
                  <code>&nbsp;&nbsp;{"}"}</code>
               </div>
                <div className="code-line">
                  <span>07</span>
                  <code>{"}"}</code>
                </div>
              </div>
              <div className="code-warning">
                <FiTarget />
                <div>
                  <strong>Potential Issue Detected</strong>
                  <p>Possible division by zero on line 04.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      <section className="features-section" id="features">
          <div className="section-container">
            <div className="section-heading">
              <span>POWERFUL ANALYSIS</span>
              <h2>
                Everything You Need to
                <strong> Understand Your Code</strong>
              </h2>
             <p>
                AI Code Bug Predictor combines code analysis, risk detection
                and intelligent explanations in one platform.
              </p>
            </div>
            <div className="features-grid">
              {features.map((feature) => (
                <div className="feature-card" key={feature.title}>
                  <div className="feature-icon">{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <span className="feature-arrow">
                    <FiArrowRight />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="workflow-section" id="how-it-works">
          <div className="section-container">
            <div className="section-heading">
              <span>SIMPLE WORKFLOW</span>
              <h2>
                From Source Code to
                <strong> Actionable Insights</strong>
              </h2>
              <p>
                Analyze your code in a few simple steps and understand where
                potential problems may exist.
              </p>
            </div>
            <div className="workflow-grid">
              {steps.map((step) => (
                <div className="workflow-card" key={step.number}>
                  <div className="workflow-number">{step.number}</div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="about-section" id="about">
          <div className="section-container">
            <div className="about-card">
              <div className="about-icon">
                <FiCode />
              </div>
              <div className="about-content">
                <span>SMARTER DEVELOPMENT</span>
                <h2>
                  Improve Code Before
                  <strong> Deployment</strong>
                </h2>
                <p>
                  AI Code Bug Predictor is designed to help developers and
                  students understand potential weaknesses in source code.
                  Instead of waiting until execution or deployment to discover
                  problems, the platform analyzes code patterns and presents
                  possible risks with explanations and improvement suggestions.
                </p>
                <div className="about-points">
                  <div>
                    <FiCheckCircle />
                    Detect potential coding mistakes
                  </div>
                  <div>
                    <FiCheckCircle />
                    Understand bug severity
                  </div>
                  <div>
                    <FiCheckCircle />
                    Track code-quality trends
                  </div>
                  <div>
                    <FiCheckCircle />
                    Compare code versions
                  </div>
                </div>
                <Link to="/login" className="primary-button">
                  Start Analyzing
                  <FiArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};
export default Home;