#include <unordered_map>
#include <vector>
#include <string>
#include <iostream>
#include <fstream>
#include <sstream>
#include <cmath>
#include <map>
#include <algorithm>
#include <stdexcept>

using namespace std;

class Word2Vec {
public:
    Word2Vec(const string& filePath);
    vector<float> getVector(const string& word);

private:
    unordered_map<string, vector<float>> wordEmbeddings;
    string normalizeSkill(const string& skill);
};

struct CourseRecommendation {
    string courseName;
    string courseUrl;
    vector<string> nextSkills;
};

string Word2Vec::normalizeSkill(const string& skill) {
    string normalized = skill;
    transform(normalized.begin(), normalized.end(), normalized.begin(), ::tolower);
    normalized.erase(remove_if(normalized.begin(), normalized.end(), ::isspace), normalized.end());
    return normalized;
}

Word2Vec::Word2Vec(const string& filePath) {
    ifstream file(filePath);
    if (!file.is_open()) {
        cerr << "Error opening file: " << filePath << endl;
        return;
    }

    string line;
    while (getline(file, line)) {
        istringstream iss(line);
        string word;
        iss >> word;

        word = normalizeSkill(word);

        string vectorString;
        vector<float> vector;

        while (iss >> vectorString) {
            // Remove brackets if present
            vectorString.erase(remove(vectorString.begin(), vectorString.end(), '['), vectorString.end());
            vectorString.erase(remove(vectorString.begin(), vectorString.end(), ']'), vectorString.end());
            try {
                vector.push_back(stof(vectorString));
            } catch (const invalid_argument&) {
                cerr << "Invalid number in word vector: " << vectorString << endl;
            }
        }

        wordEmbeddings[word] = vector;
    }

    file.close();
}

vector<float> Word2Vec::getVector(const string& word) {
    string normalizedWord = normalizeSkill(word);
    auto it = wordEmbeddings.find(normalizedWord);
    if (it != wordEmbeddings.end()) {
        return it->second;
    }
    cerr << "Skill not found: " << word << endl;
    return vector<float>(3, 0.0f);  
}

vector<vector<float>> getVectorsForSkills(Word2Vec& word2Vec, const string& inputSkills) {
    vector<vector<float>> vectors;
    stringstream ss(inputSkills);
    string skill;

    while (getline(ss, skill, ',')) {
        skill.erase(remove(skill.begin(), skill.end(), ' '), skill.end());
        if (!skill.empty()) {
            vectors.push_back(word2Vec.getVector(skill));
        }
    }

    return vectors;
}

vector<float> combineVectors(const vector<vector<float>>& vectors) {
    if (vectors.empty()) return {};

    size_t vectorSize = vectors[0].size();
    vector<float> combined(vectorSize, 0.0f);

    for (const auto& vec : vectors) {
        for (size_t i = 0; i < vectorSize; ++i) {
            combined[i] += vec[i];
        }
    }

    for (size_t i = 0; i < vectorSize; ++i) {
        combined[i] /= vectors.size();
    }

    return combined;
}

float cosineSimilarity(const vector<float>& vecA, const vector<float>& vecB) {
    float dotProduct = 0.0f, normA = 0.0f, normB = 0.0f;

    for (size_t i = 0; i < vecA.size(); ++i) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }

    return (normA == 0 || normB == 0) ? 0.0f : dotProduct / (sqrt(normA) * sqrt(normB));
}

map<vector<float>, CourseRecommendation> loadCourseData(const string& filePath, Word2Vec& word2Vec) {
    map<vector<float>, CourseRecommendation> dataSet;
    ifstream file(filePath);
    string line;

    if (!file.is_open()) {
        throw runtime_error("Unable to open course data file.");
    }

    bool isFirstLine = true; // Skip header
    while (getline(file, line)) {
        if (isFirstLine) {
            isFirstLine = false;
            continue;
        }

        stringstream ss(line);
        string skills, courseName, courseUrl, nextSkills;

        getline(ss, skills, ',');         
        getline(ss, courseName, ',');   
        getline(ss, courseUrl, ',');   
        getline(ss, nextSkills);         

        vector<vector<float>> skillVectors = getVectorsForSkills(word2Vec, skills);
        vector<float> combinedVector = combineVectors(skillVectors);

        vector<string> nextSkillsList;
        stringstream nextSkillsStream(nextSkills);
        string skill;
        while (getline(nextSkillsStream, skill, '|')) {
            skill.erase(remove(skill.begin(), skill.end(), ' '), skill.end());
            nextSkillsList.push_back(skill);
        }

        dataSet[combinedVector] = {courseName, courseUrl, nextSkillsList};
    }

    file.close();
    return dataSet;
}

CourseRecommendation recommendCourse(Word2Vec& word2Vec, const vector<float>& userVector,
                                     const map<vector<float>, CourseRecommendation>& dataSet) {
    float bestSimilarity = -1.0f;
    CourseRecommendation bestCourse;

    for (const auto& entry : dataSet) {
        float similarity = cosineSimilarity(userVector, entry.first);
        if (similarity > bestSimilarity) {
            bestSimilarity = similarity;
            bestCourse = entry.second;
        }
    }

    return bestCourse;
}

int main() {
    try {
        Word2Vec word2Vec("word_vectors.txt");

        map<vector<float>, CourseRecommendation> dataSet = loadCourseData("course_data.csv", word2Vec);

        string inputSkills;
        getline(cin, inputSkills);

        vector<vector<float>> skillVectors = getVectorsForSkills(word2Vec, inputSkills);

        if (skillVectors.empty()) {
            cerr << "No valid skill vectors found" << endl;
            return 1;
        }

        vector<float> combinedSkillVector = combineVectors(skillVectors);

        CourseRecommendation recommendation = recommendCourse(word2Vec, combinedSkillVector, dataSet);

        cout << "" << recommendation.courseName << "\n"
             << "" << recommendation.courseUrl << "\n"
             << "";
        for (const auto& skill : recommendation.nextSkills) {
            cout << skill << " ";
        }
        cout << endl;
    } catch (const exception& e) {
        cerr << "Error: " << e.what() << endl;
        return 1;
    }

    return 0;
}