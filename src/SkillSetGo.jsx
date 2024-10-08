import { useState } from "react";

const domains = [
  "Web Development",
  "App Development",
  "Data Science",
  "Machine Learning",
  "Blockchain Development",
  "Cybersecurity",
  "Cloud Computing",
  "DevOps",
  "Game Development",
  "Artificial Intelligence",
];

const skillsByDomain = {
  "Web Development": [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Angular",
    "Vue.js",
    "TypeScript",
    "Next.js",
    "SASS",
    "Bootstrap",
    "Tailwind CSS",
    "jQuery",
    "Node.js",
    "Express.js",
    "Webpack",
    "GraphQL",
    "REST APIs",
    "Responsive Design",
    "SEO Fundamentals",
    "Web Accessibility",
  ],

  "App Development": [
    "Java",
    "Kotlin",
    "Swift",
    "Flutter",
    "React Native",
    "Objective-C",
    "Dart",
    "Android SDK",
    "iOS SDK",
    "MVVM Architecture",
    "Clean Architecture",
    "SQLite",
    "Realm Database",
    "Firebase",
    "In-app Purchases",
    "App Performance Optimization",
    "Push Notifications",
    "ARCore",
    "CoreData",
    "Google Maps API",
  ],

  "Data Science": [
    "Python",
    "R",
    "Pandas",
    "NumPy",
    "Matplotlib",
    "Seaborn",
    "TensorFlow",
    "PyTorch",
    "Scikit-learn",
    "Jupyter Notebooks",
    "Data Cleaning",
    "Data Visualization",
    "Statistical Analysis",
    "Regression Analysis",
    "Clustering Algorithms",
    "Classification Algorithms",
    "NLP",
    "Time Series Analysis",
    "Deep Learning",
    "Reinforcement Learning",
  ],

  "Machine Learning": [
    "Supervised Learning",
    "Unsupervised Learning",
    "Neural Networks",
    "Decision Trees",
    "Random Forest",
    "KNN",
    "Support Vector Machines",
    "Naive Bayes",
    "Gradient Boosting",
    "XGBoost",
    "Hyperparameter Tuning",
    "Cross-validation",
    "Model Evaluation Metrics",
    "Feature Selection",
    "PCA",
    "K-means Clustering",
    "CNN",
    "RNN",
    "Autoencoders",
    "Model Deployment",
  ],

  "Blockchain Development": [
    "Solidity",
    "Ethereum",
    "Hyperledger",
    "Smart Contracts",
    "Web3.js",
    "Truffle Suite",
    "Ganache",
    "IPFS",
    "NFTs",
    "dApps",
    "Consensus Mechanisms",
    "Layer 2 Scaling Solutions",
    "DeFi",
    "ERC20 Tokens",
    "ERC721 Tokens",
    "Staking and Yield Farming",
    "Blockchain Security",
    "Tokenomics",
    "Zero-Knowledge Proofs",
    "Sidechains",
  ],

  Cybersecurity: [
    "Network Security",
    "Cryptography",
    "Ethical Hacking",
    "Penetration Testing",
    "Malware Analysis",
    "Incident Response",
    "Firewalls",
    "IDS/IPS",
    "Security Auditing",
    "Vulnerability Assessment",
    "Risk Management",
    "Secure Coding Practices",
    "PKI",
    "Web Application Security",
    "OWASP Top 10",
    "Social Engineering",
    "Cloud Security",
    "SIEM",
    "Identity & Access Management",
    "Data Loss Prevention",
  ],

  "Cloud Computing": [
    "AWS",
    "Microsoft Azure",
    "Google Cloud Platform",
    "Kubernetes",
    "Docker",
    "Serverless Architecture",
    "IAM",
    "Cloud Networking",
    "Virtual Machines",
    "Cloud Storage Solutions",
    "CI/CD Pipelines",
    "Terraform",
    "Cloud Monitoring",
    "Cloud Security",
    "Multi-cloud Architecture",
    "Load Balancers",
    "Auto-scaling",
    "API Gateways",
    "Cloud Databases",
    "Cloud Cost Optimization",
  ],

  DevOps: [
    "Continuous Integration",
    "Continuous Delivery",
    "Jenkins",
    "Git",
    "Docker",
    "Kubernetes",
    "Helm",
    "Ansible",
    "Puppet",
    "Chef",
    "Terraform",
    "Prometheus",
    "Grafana",
    "Monitoring and Logging",
    "Infrastructure as Code",
    "Automated Testing",
    "Blue/Green Deployment",
    "Canary Deployment",
    "Version Control",
    "Build Automation",
  ],

  "Game Development": [
    "Unity",
    "Unreal Engine",
    "C#",
    "C++",
    "Game Physics",
    "2D Game Development",
    "3D Game Development",
    "Game Design Patterns",
    "Game UI/UX",
    "Blender",
    "Asset Management",
    "Animation",
    "Multiplayer Networking",
    "Audio Programming",
    "Game Scripting",
    "Shader Programming",
    "AR/VR Development",
    "Performance Optimization",
    "AI in Games",
    "Game Monetization Strategies",
  ],

  "Artificial Intelligence": [
    "Machine Learning",
    "Deep Learning",
    "NLP",
    "Computer Vision",
    "Reinforcement Learning",
    "Transfer Learning",
    "GANs",
    "Neural Networks",
    "Robotics",
    "Autonomous Systems",
    "Speech Recognition",
    "AI Ethics",
    "Knowledge Representation",
    "Prolog",
    "Expert Systems",
    "Decision Trees",
    "Bayesian Networks",
    "Heuristic Search",
    "Swarm Intelligence",
    "Genetic Algorithms",
  ],
};

const SkillSetGo = () => {
  const [selectedDomain, setSelectedDomain] = useState("");
  const [knownSkills, setKnownSkills] = useState([]);
  const [recommendedSkills, setRecommendedSkills] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedSkill, setExpandedSkill] = useState(null);

  const handleDomainChange = (e) => {
    setSelectedDomain(e.target.value);
    setKnownSkills([]);
    setRecommendedSkills(null);
    console.log("Domain changed:", e.target.value);
  };

  const handleSkillToggle = (skill) => {
    setKnownSkills((prevSkills) =>
      prevSkills.includes(skill)
        ? prevSkills.filter((s) => s !== skill)
        : [...prevSkills, skill]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Submitting form:", { selectedDomain, knownSkills });

      const result = await fetch("http://localhost:3000/next-skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domain: selectedDomain,
          skills: knownSkills,
        }),
      });

      if (!result.ok) {
        throw new Error(`HTTP error! status: ${result.status}`);
      }

      const data = await result.json(); 

      console.log("Parsed Data:", data);

      if (!data || !Array.isArray(data.nextSkills)) {
        throw new Error("Invalid API response");
      }

      setRecommendedSkills(data.nextSkills);
      setRoadmap(data.roadmap || []);
    } catch (error) {
      console.error("Error fetching recommended skills:", error);
      setRecommendedSkills([]);
      setRoadmap([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSkill = (skill) => {
    setExpandedSkill(expandedSkill === skill ? null : skill);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-2 text-center text-gray-800">
            SkillSetGo
          </h1>
          <p className="text-xl text-center text-gray-600 mb-8">
            Upskill yourself, in the best way possible
          </p>

          <form onSubmit={handleSubmit} className="mb-8">
            <div className="mb-4">
              <label
                htmlFor="domain"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Select Domain:
              </label>
              <select
                id="domain"
                value={selectedDomain}
                onChange={handleDomainChange}
                className="w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select a domain</option>
                {domains.map((domain) => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>
            </div>
            {selectedDomain && (
              <div className="mb-4">
                <p className="mb-2 text-sm font-medium text-gray-700">
                  Select Known Skills:
                </p>
                <div className="flex flex-wrap gap-2">
                  {skillsByDomain[selectedDomain].map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleSkillToggle(skill)}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        knownSkills.includes(skill)
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <button
              type="submit"
              disabled={!selectedDomain || knownSkills.length === 0 || loading}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : "Get Recommendations"}
            </button>
          </form>

          {recommendedSkills && roadmap.length > 0 ? (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Recommended Skills
              </h2>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                {recommendedSkills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Learning Roadmap
              </h2>
              {/* Vertical Roadmap */}
              <div className="relative flex flex-col items-center">
                {/* Vertical Line */}
                <div className="absolute w-1 bg-gray-300 h-full left-1/2 transform -translate-x-1/2"></div>
                {roadmap.map((item, index) => (
                  <div key={item.name} className="relative w-full py-8">
                    <div
                      className={`flex items-center w-full ${
                        index === 0
                          ? "justify-end"
                          : index === roadmap.length - 1
                          ? "justify-end"
                          : index % 2 === 0
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`w-5/12 ${
                          index === 0 || index === roadmap.length - 1
                            ? "text-right"
                            : index % 2 === 0
                            ? "text-right"
                            : "text-left"
                        }`}
                      >
                        <button
                          onClick={() => toggleSkill(item.name)}
                          className={`px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 z-10 relative ${
                            index % 2 === 0 ? "ml-4" : "mr-4"
                          }`}
                        >
                          {item.name}
                        </button>
                      </div>
                      <div className="w-2/12 flex justify-center">
                        <div className="w-4 h-4 bg-blue-500 rounded-full z-10"></div>
                      </div>
                      <div className="w-5/12"></div>
                    </div>
                    {/* Horizontal connector */}
                    <div
                      className={`absolute top-1/2 h-1 bg-gray-300 ${
                        index % 2 === 0 ? "left-1/2" : "right-1/2"
                      }`}
                      style={{
                        width: "calc(25% - 1rem)",
                        transform: "translateY(-50%)",
                      }}
                    ></div>
                    {/* Expanded Course Info */}
                    {expandedSkill === item.name && (
                      <div
                        className={`absolute top-full mt-2 z-20 w-5/12 ${
                          index === 0 || index === roadmap.length - 1
                            ? "right-0"
                            : index % 2 === 0
                            ? "right-0"
                            : "left-0"
                        }`}
                      >
                        <div className="bg-gray-200 p-4 rounded-md shadow-lg text-gray-700">
                          <p>Course: {item.course}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p>No recommendations available at this time.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillSetGo;
