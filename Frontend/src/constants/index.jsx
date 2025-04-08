import { Dog } from "lucide-react";
import { Microscope } from "lucide-react";
import { FileText } from "lucide-react";
import { Brain } from "lucide-react";
import { CircleDashed } from "lucide-react";
import {ClipboardType} from "lucide-react";


export const navItems = [
  { label: "Features", href: "#features" },
  { label: "Workflow", href: "#workflow" }
];


export const features = [
  {
    icon: <Dog />,
    text: "Better Pet Healthcare",
    description:
      "Providing an efficient tool for early detection of canine skin diseases, supporting pet owners and veterinarians."
  },
  {
    icon: <CircleDashed />,
    text: "Advanced Preprocessing",
    description:
      "Utilize Canny Edge Detection with circular mask kernel, HSV color space conversion, and contrast enhancement to isolate lesions.",
  },
  {
    icon: <Brain />,
    text: "Dual CNN Architecture",
    description:
      "Two-stage AI approach with first model detecting disease presence and second model classifying specific disease conditions.",
  },
  {
    icon: <ClipboardType />,
    text: "Weighted Scoring Algorithm",
    description:
      "Clinical knowledge integration through a weighted questionnaire system to refine AI-based classifications with veterinary expertise.",
  },
  {
    icon: <Microscope />,
    text: "Lesion Segmentation",
    description:
      "Precise isolation of affected skin areas from surrounding healthy tissue, improving classification accuracy and diagnostic focus.",
  },
  {
    icon: <FileText />,
    text: "Comprehensive Reporting",
    description:
      "Generate detailed diagnostic outputs with disease classification, confidence scores, and suggested next steps for veterinary care.",
  },
];

export const checklistItems = [
  {
    title: "Capture Skin Lesion Image",
    description:
      "Take a close-up photograph of the affected canine skin area as the first step in the diagnostic process.",
  },
  {
    title: "Initial Disease Screening",
    description:
      "First model determines if a skin disease is present for efficient preliminary analysis.",
  },
  {
    title: "Detailed Classification",
    description:
      "For detected diseases, next model analyses segmented lesions to identify specific conditions.",
  },
  {
    title: "Clinical Assessment",
    description:
      "Answer six questions about symptoms to enhance AI diagnosis with domain knowledge for improved accuracy.",
  },
];


export const resourcesLinks = [
  { href: "#", text: "Getting Started" },
  { href: "#", text: "Documentation" },
  { href: "#", text: "Tutorials" },
  { href: "#", text: "API Reference" },
  { href: "#", text: "Community Forums" },
];

export const platformLinks = [
  { href: "#", text: "Features" },
  { href: "#", text: "Supported Devices" },
  { href: "#", text: "System Requirements" },
  { href: "#", text: "Downloads" },
  { href: "#", text: "Release Notes" },
];
