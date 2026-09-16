import * as fs from "fs";
import * as path from "path";
import { generateTopicFile, normalizeTopicSpec } from "./generate";
import { getAiAgentSpec, getAiEthicsSpec, getAiGovernanceSpec, getAiSecuritySpec, getAiFundamentalsSpec } from "./domains-batch1";
import { getAutoMlSpec } from "./domains-batch2";
import { getCompIntelSpec } from "./batch2a-comp-intel";
import { getComputerVisionSpec } from "./batch2b-computer-vision";
import { getDataAnalystSpec } from "./batch2c-data-analyst";
import { getDataEngSpec } from "./batch2d-data-eng";
import { getDataScienceSpec } from "./batch3a-data-science";
import { getDeepLearningSpec } from "./batch3b-deep-learning";
import { getEdgeAiSpec } from "./batch3c-edge-ai";
import { getExpertSystemSpec } from "./batch3d-expert-system";
import { getGenerativeAiSpec } from "./batch3e-generative-ai";
import { getGnnSpec } from "./batch4a-gnn";
import { getKnowledgeRepSpec } from "./batch4b-knowledge-rep";
import { getLLMSpec } from "./batch4c-llm";
import { getMachineLearningSpec } from "./batch4d-machine-learning";
import { getMLOpsSpec } from "./batch4e-mlops";
import { getMultimodalSpec } from "./batch5a-multimodal";
import { getNLPSpec } from "./batch5b-nlp";
import { getRecSysSpec } from "./batch5c-recsys";
import { getRLSpec } from "./batch5d-rl";
import { getRoboticsSpec } from "./batch6a-robotics";
import { getSpeechSpec } from "./batch6b-speech";
import { getTimeSeriesSpec } from "./batch6c-time-series";
import { getVectorDBSpec } from "./batch6d-vector-db";

const TOPICS_DIR = path.join(process.cwd(), "src/lib/curriculum/topics");

const specs = [
  getAiAgentSpec(),
  getAiEthicsSpec(),
  getAiGovernanceSpec(),
  getAiSecuritySpec(),
  getAiFundamentalsSpec(),
  getAutoMlSpec(),
  getCompIntelSpec(),
  getComputerVisionSpec(),
  getDataAnalystSpec(),
  getDataEngSpec(),
  getDataScienceSpec(),
  getDeepLearningSpec(),
  getEdgeAiSpec(),
  getExpertSystemSpec(),
  getGenerativeAiSpec(),
  getGnnSpec(),
  getKnowledgeRepSpec(),
  getLLMSpec(),
  getMachineLearningSpec(),
  getMLOpsSpec(),
  getMultimodalSpec(),
  getNLPSpec(),
  getRecSysSpec(),
  getRLSpec(),
  getRoboticsSpec(),
  getSpeechSpec(),
  getTimeSeriesSpec(),
  getVectorDBSpec(),
];

console.log(`Starting generation of all ${specs.length} topics into ${TOPICS_DIR}...`);

for (const rawSpec of specs) {
  const spec = normalizeTopicSpec(rawSpec);
  console.log(`Generating ${spec.file} (${spec.chapters.length} chapters)...`);
  const content = generateTopicFile(spec);
  fs.writeFileSync(path.join(TOPICS_DIR, spec.file), content, "utf-8");
  console.log(`Wrote ${spec.file} successfully (${(content.length / 1024).toFixed(1)} KB).`);
}

console.log(`All ${specs.length} topics generated successfully!`);
