import { useState } from "react";
import { ChevronDown, BookOpen } from "lucide-react";

const SkillSetGo = () => {
  const [selectedDomain, setSelectedDomain] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [recommendedSkills, setRecommendedSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleDomainChange = (domain) => {
    setSelectedDomain(domain);
    setSelectedSkills([]);
    setRecommendedSkills([]);
  };

  const handleSkillToggle = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const getRecommendations = async () => {
    if (!selectedDomain || selectedSkills.length === 0) return;

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/next-skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: selectedDomain,
          skills: selectedSkills,
        }),
      });

      const data = await response.json();
      setRecommendedSkills(data.nextSkills);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            SkillSetGo
          </h1>
          <p className="text-gray-600 mt-2">
            A next-gen course recommendation system
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Domain Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Domain
            </label>
            <div className="relative">
              <select
                value={selectedDomain}
                onChange={(e) => handleDomainChange(e.target.value)}
                className="w-full p-3 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
              >
                <option value="">Choose a domain</option>
                {domains.map((domain) => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
          </div>

          {/* Skills Selection */}
          {selectedDomain && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Skills
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {skillsByDomain[selectedDomain]?.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => handleSkillToggle(skill)}
                    className={`p-3 rounded-lg border transition-all ${
                      selectedSkills.includes(skill)
                        ? "bg-blue-500 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-200 hover:border-blue-400"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Get Recommendations Button */}
          {selectedSkills.length > 0 && (
            <button
              onClick={getRecommendations}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <BookOpen size={20} />
              {isLoading ? "Getting Recommendations..." : "Get Recommendations"}
            </button>
          )}

          {/* Recommended Skills as Roadmap */}
          {recommendedSkills.length > 0 && (
            <div className="mt-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-8 text-center">
                Your Learning Roadmap
              </h3>

              {/* Timeline Container */}
              <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full" />

                {/* Timeline Items */}
                <div className="relative">
                  {recommendedSkills.map((skill, index) => (
                    <div
                      key={skill}
                      className={`flex items-center mb-8 ${
                        index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                      }`}
                    >
                      {/* Content */}
                      <div
                        className={`w-5/12 ${
                          index % 2 === 0 ? "text-right pr-8" : "text-left pl-8"
                        }`}
                      >
                        <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-lg hover:shadow-xl transition-all">
                          <span className="font-medium text-gray-800">
                            {skill}
                          </span>
                        </div>
                      </div>

                      {/* Circle on Timeline */}
                      <div className="w-2/12 flex justify-center">
                        <div className="w-4 h-4 bg-white rounded-full border-4 border-blue-500 transform transition-transform hover:scale-125" />
                      </div>

                      {/* Empty space for opposite side */}
                      <div className="w-5/12" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillSetGo;
