import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft,FiCode,FiFileText,FiHome,FiInfo,FiPlay,FiRefreshCw, FiUpload,} from "react-icons/fi";
import CodeEditor from "../components/CodeEditor";
import { analyzeCode } from "../services/analysisService";
import { useTheme } from "../context/ThemeContext";
import "./CodeAnalyzer.css";
const languageOptions = [
  {
    value: "javascript",
    label: "JavaScript",
  },
  {
    value: "typescript",
    label: "TypeScript",
  },
  {
    value: "java",
    label: "Java",
  },
  {
    value: "python",
    label: "Python",
  },
  {
    value: "cpp",
    label: "C++",
  },
  {
    value: "c",
    label: "C",
  },
  {
    value: "csharp",
    label: "C#",
  },
  {
    value: "php",
    label: "PHP",
  },
  {
    value: "go",
    label: "Go",
  },
];
const sampleCode = {
  javascript: `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  console.log("Total:", total);
  return total;
}`,
  typescript: `function calculateTotal(items: any[]) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  console.log("Total:", total);
  return total;
}`,
  java: `public class Calculator {
    public int calculate(int a, int b) {
        try {
            return a / b;
        } catch (Exception e) {
        }
        return 0;
    }
}`,
  python: `def calculate_total(items):
    total = 0
    for item in items:
        total += item["price"]
    print("Total:", total)
    return total`,
  cpp: `#include <iostream>
using namespace std;
int main() {
    int numbers[5];
    for (int i = 0; i <= 5; i++) {
        cout << numbers[i] << endl;
    }
    return 0;
}`,
  c: `#include <stdio.h>
int main() {
    int numbers[5];
    for (int i = 0; i <= 5; i++) {
        printf("%d", numbers[i]);
    }
    return 0;
}`,
  csharp: `using System;
class Program {
    static void Main() {
        string name = null;
        Console.WriteLine(name.Length);
    }
}`,
  php: `<?php
function calculateTotal($items) {
    $total = 0;
    foreach ($items as $item) {
        $total += $item["price"];
    }
    echo $total;
    return $total;
}
?>`,
  go: `package main
import "fmt"
func main() {
    numbers := []int{1, 2, 3}
    for i := 0; i <= len(numbers); i++ {
        fmt.Println(numbers[i])
    }
}`,
};
const getFileExtension = (selectedLanguage) => {
  const extensions = {
    javascript: "js",
    typescript: "ts",
    java: "java",
    python: "py",
    cpp: "cpp",
    c: "c",
    csharp: "cs",
    php: "php",
    go: "go",
  };
  return extensions[selectedLanguage] || "txt";
};
const CodeAnalyzer = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { theme } = useTheme();
  const [projectName, setProjectName] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(
    sampleCode.javascript
  );
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const editorTheme = theme === "light" || theme === "eye"
      ? "vs"
      : "vs-dark";
 const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);
    setCode(sampleCode[selectedLanguage] || "" );
    setFileName("");
    setError("");
  };
  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setError("");
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const uploadedCode = loadEvent.target?.result;
      setCode( typeof uploadedCode === "string"
          ? uploadedCode
          : ""
      );
    };
    reader.onerror = () => {
      setError("Unable to read the selected file.");
    };
    reader.readAsText(file);
  };
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  const handleLoadSample = () => {
    setCode(
      sampleCode[language] || ""
    );
    setFileName("");
    setError("");
  };
  const handleClear = () => {
    setCode("");
    setFileName("");
    setError("");
  };
  const handleAnalyze = async () => {
    setError("");
    if (!projectName.trim()) {
      setError(
        "Please enter a project name."
      );
      return;
    }
    if (!code.trim()) {
      setError("Please enter or upload source code before starting the analysis.");
      return;
    }
    setIsAnalyzing(true);
    try {
      const analysisData = {
        projectName:
          projectName.trim(),
        language,
        fileName:
          fileName || `main.${getFileExtension(language)}`, code,
      };
      const result = await analyzeCode(analysisData);
      navigate("/analysis-result", {
          state: {
            analysis: result,
          },
        }
      );
    } catch (requestError) {
      console.error(
        "Code analysis error:",
        requestError
      );
      let message = "Unable to analyze the code. Please make sure the Spring Boot backend is running.";
      if (requestError.response?.data) {
        if (typeof requestError.response.data ==="string") {
          message = requestError.response.data;
        } else if (requestError.response.data.message) {
          message =requestError.response.data.message;
        }
      }
      setError(message);
    } finally {
      setIsAnalyzing(false);
    }
  };
  return (
    <div className="code-analyzer-page">
      <header className="code-analyzer-header">
        <div className="code-analyzer-header-left">
          <Link
            to="/dashboard"
            className="code-analyzer-back-button"
          >
            <FiArrowLeft />
            <span>
              Dashboard
            </span>
          </Link>
          <div className="code-analyzer-header-divider"></div>
          <div className="code-analyzer-title">
            <div className="code-analyzer-title-icon">
              <FiCode />
            </div>
            <div>
              <h1>
                Code Analyzer
              </h1>
              <p>
                Detect potential bugs before they
                become problems.
              </p>
            </div>
          </div>
        </div>
        <Link
          to="/dashboard"
          className="code-analyzer-home-button"
        >
          <FiHome />
          <span>
            Dashboard
          </span>
        </Link>
      </header>
      <main className="code-analyzer-main">
        <section className="code-analyzer-intro">
          <div>
            <span className="code-analyzer-label">
              AI CODE ANALYSIS
            </span>
            <h2>
              Analyze your source code
            </h2>
            <p>
              Add your project details, select a
              programming language, and provide your
              source code. Our analysis engine will
              identify potential bugs and code-quality
              issues.
            </p>
          </div>
        </section>
        <section className="code-analyzer-card">
          <div className="code-analyzer-card-header">
            <div className="code-analyzer-card-icon">
              <FiFileText />
            </div>
            <div>
              <h3>
                Analysis Details
              </h3>
              <p>
                Tell us about the code you want
                to analyze.
              </p>
            </div>
          </div>
          <div className="code-analyzer-form-grid">
            <div className="code-analyzer-field">
              <label htmlFor="projectName">
                Project Name
              </label>
              <input
                id="projectName"
                type="text"
                placeholder="Example: E-Commerce Backend"
                value={projectName}
                onChange={(event) =>
                  setProjectName(
                    event.target.value
                  )
                }
              />
            </div>
            <div className="code-analyzer-field">
              <label htmlFor="language">
                Programming Language
              </label>
              <select
                id="language"
                value={language}
                onChange={
                  handleLanguageChange
                }
              >
                {languageOptions.map(
                  (option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
        </section>
        <section className="code-analyzer-card">
          <div className="code-analyzer-card-header">
            <div className="code-analyzer-card-icon">
              <FiCode />
            </div>
            <div>
              <h3>
                Source Code
              </h3>
              <p>
                Paste your code or upload a source
                file for analysis.
              </p>
            </div>
          </div>
          <div className="code-analyzer-toolbar">
            <div className="code-analyzer-file-info">
              {fileName ? (
                <span>
                  <FiFileText />
                  {fileName}
                </span>
              ) : (
                <span>
                  <FiInfo />
                  No file uploaded
                </span>
              )}
            </div>
            <div className="code-analyzer-toolbar-actions">
              <input
                ref={fileInputRef}
                type="file"
                accept=".js,.jsx,.ts,.tsx,.java,.py,.cpp,.c,.h,.cs,.php,.go,.txt"
                onChange={
                  handleFileUpload
                }
                hidden
              />
             <button
                type="button"
                className="code-analyzer-tool-button"
                onClick={
                  handleUploadClick
                }
              >
                <FiUpload />
                Upload File
              </button>
              <button
                type="button"
                className="code-analyzer-tool-button"
                onClick={
                  handleLoadSample
                }
              >
                <FiRefreshCw />
                Sample Code
              </button>
              <button
                type="button"
                className="code-analyzer-tool-button danger"
                onClick={
                  handleClear
                }
              >
                Clear
              </button>
           </div>
          </div>
          <CodeEditor
            code={code}
            setCode={setCode}
            language={language}
            theme={editorTheme}
          />
        </section>
        {error && (
          <div className="code-analyzer-error">
            <FiInfo />
            <div>
              <strong>
                Analysis Error
              </strong>
              <p>
                {error}
              </p>
            </div>
          </div>
        )}
        <section className="code-analyzer-submit-section">
          <div className="code-analyzer-submit-info">
            <strong>
              Ready to analyze?
            </strong>
            <span>
              Your source code will be analyzed
              for potential bugs and quality issues.
            </span>
          </div>
          <button
            type="button"
            className="code-analyzer-submit-button"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <span className="code-analyzer-spinner"></span>
                Analyzing Code...
              </>
            ) : (
              <>
                <FiPlay />

                Analyze Code
              </>
            )}
          </button>
        </section>
      </main>
    </div>
  );
};
export default CodeAnalyzer;