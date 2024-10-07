#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm>

using namespace std;

// List of domains and skills
const vector<pair<string, vector<string>>> domains = {
    {"Web Development", {"HTML", "CSS", "JavaScript", "React", "Angular", "Vue.js", "TypeScript",
                         "Next.js", "SASS", "Bootstrap", "Tailwind CSS", "jQuery", "Node.js",
                         "Express.js", "Webpack", "GraphQL", "REST APIs", "Responsive Design",
                         "SEO Fundamentals", "Web Accessibility"}},
    
    {"App Development", {"Java", "Kotlin", "Swift", "Flutter", "React Native", "Objective-C", "Dart",
                         "Android SDK", "iOS SDK", "MVVM Architecture", "Clean Architecture", "SQLite",
                         "Realm Database", "Firebase", "In-app Purchases", "App Performance Optimization",
                         "Push Notifications", "ARCore", "CoreData", "Google Maps API"}},
    
    {"Data Science", {"Python", "R", "Pandas", "NumPy", "Matplotlib", "Seaborn", "TensorFlow", 
                      "PyTorch", "Scikit-learn", "Jupyter Notebooks", "Data Cleaning", "Data Visualization",
                      "Statistical Analysis", "Regression Analysis", "Clustering Algorithms", 
                      "Classification Algorithms", "NLP", "Time Series Analysis", "Deep Learning", 
                      "Reinforcement Learning"}},
    
    {"Machine Learning", {"Supervised Learning", "Unsupervised Learning", "Neural Networks", "Decision Trees",
                          "Random Forest", "KNN", "Support Vector Machines", "Naive Bayes", "Gradient Boosting",
                          "XGBoost", "Hyperparameter Tuning", "Cross-validation", "Model Evaluation Metrics",
                          "Feature Selection", "PCA", "K-means Clustering", "CNN", "RNN", "Autoencoders", 
                          "Model Deployment"}},
    
    {"Blockchain Development", {"Solidity", "Ethereum", "Hyperledger", "Smart Contracts", "Web3.js", "Truffle Suite",
                                 "Ganache", "IPFS", "NFTs", "dApps", "Consensus Mechanisms", "Layer 2 Scaling Solutions",
                                 "DeFi", "ERC20 Tokens", "ERC721 Tokens", "Staking and Yield Farming", 
                                 "Blockchain Security", "Tokenomics", "Zero-Knowledge Proofs", "Sidechains"}},
    
    {"Cybersecurity", {"Network Security", "Cryptography", "Ethical Hacking", "Penetration Testing", 
                       "Malware Analysis", "Incident Response", "Firewalls", "IDS/IPS", "Security Auditing", 
                       "Vulnerability Assessment", "Risk Management", "Secure Coding Practices", "PKI", 
                       "Web Application Security", "OWASP Top 10", "Social Engineering", "Cloud Security", 
                       "SIEM", "Identity & Access Management", "Data Loss Prevention"}},
    
    {"Cloud Computing", {"AWS", "Microsoft Azure", "Google Cloud Platform", "Kubernetes", "Docker", 
                         "Serverless Architecture", "IAM", "Cloud Networking", "Virtual Machines", 
                         "Cloud Storage Solutions", "CI/CD Pipelines", "Terraform", "Cloud Monitoring", 
                         "Cloud Security", "Multi-cloud Architecture", "Load Balancers", "Auto-scaling", 
                         "API Gateways", "Cloud Databases", "Cloud Cost Optimization"}},
    
    {"DevOps", {"Continuous Integration", "Continuous Delivery", "Jenkins", "Git", "Docker", 
                 "Kubernetes", "Helm", "Ansible", "Puppet", "Chef", "Terraform", "Prometheus", 
                 "Grafana", "Monitoring and Logging", "Infrastructure as Code", "Automated Testing",
                 "Blue/Green Deployment", "Canary Deployment", "Version Control", "Build Automation"}},
    
    {"Game Development", {"Unity", "Unreal Engine", "C#", "C++", "Game Physics", "2D Game Development", 
                          "3D Game Development", "Game Design Patterns", "Game UI/UX", "Blender", 
                          "Asset Management", "Animation", "Multiplayer Networking", "Audio Programming", 
                          "Game Scripting", "Shader Programming", "AR/VR Development", "Performance Optimization",
                          "AI in Games", "Game Monetization Strategies"}},
    
    {"Artificial Intelligence", {"Machine Learning", "Deep Learning", "NLP", "Computer Vision", "Reinforcement Learning",
                                  "Transfer Learning", "GANs", "Neural Networks", "Robotics", "Autonomous Systems", 
                                  "Speech Recognition", "AI Ethics", "Knowledge Representation", "Prolog", "Expert Systems", 
                                  "Decision Trees", "Bayesian Networks", "Heuristic Search", "Swarm Intelligence", 
                                  "Genetic Algorithms"}}
};

// Function to get the next skills after the user's last learned skill
vector<string> getNextSkills(const string &domainName, const vector<string> &learnedSkills) {
    vector<string> nextSkills;

    // Search for the given domain
    for (const auto &domain : domains) {
        if (domain.first == domainName) {
            // If no skills were learned, return all skills
            if (learnedSkills.empty()) {
                nextSkills = domain.second;
            } else {
                // Find the last learned skill in the domain
                auto lastSkillIt = find(domain.second.begin(), domain.second.end(), learnedSkills.back());
                if (lastSkillIt != domain.second.end()) {
                    // Collect all skills after the last learned skill
                    nextSkills.assign(lastSkillIt + 1, domain.second.end());
                }
            }
            break;
        }
    }
    
    return nextSkills;
}

int main(int argc, char* argv[]) {
    if (argc != 2) {
        cerr << "Usage: " << argv[0] << " \"domain:skill1,skill2,skill3\"" << endl;
        return 1;
    }

    string input = argv[1];
    size_t colonPos = input.find(':');
    string domainName = input.substr(0, colonPos);
    vector<string> learnedSkills;

    if (colonPos != string::npos) {
        string skills = input.substr(colonPos + 1);
        stringstream ss(skills);
        string skill;
        while (getline(ss, skill, ',')) {
            learnedSkills.push_back(skill);
        }
    }

    vector<string> nextSkills = getNextSkills(domainName, learnedSkills);
    
    // Print the next skills as a comma-separated string
    for (size_t i = 0; i < nextSkills.size(); ++i) {
        cout << nextSkills[i];
        if (i < nextSkills.size() - 1) {
            cout << ",";
        }
    }
    cout << endl;

    return 0;
}