"use client";
import React, { useState } from "react";

type FAQItem = {
  question: string;
  answer: string;
};

const faqs: FAQItem[] = [
  {
    question: "What is Travel Planner?",
    answer:
      "Travel Planner is a travel planning and meetup platform that helps users organize trips, explore destinations, and connect with compatible travel buddies.",
  },
  {
    question: "Is Travel Planner free to use?",
    answer:
      "You can explore public travel plans for free. Some advanced features such as premium matching and private meetups may require a subscription.",
  },
  {
    question: "How do I create a travel plan?",
    answer:
      "After logging in, go to your dashboard and click on 'Create Plan'. Fill in your destination, travel dates, budget, and travel type to publish your plan.",
  },
  {
    question: "How do I find a travel buddy?",
    answer:
      "Create a travel plan and browse similar trips. You can view other travelers’ profiles and send requests to connect and plan together.",
  },
  {
    question: "Can I join someone else’s travel plan?",
    answer:
      "Yes. You can request to join public travel plans shared by other users. The plan owner can accept or decline your request.",
  },
  {
    question: "Is my personal information safe?",
    answer:
      "Yes. We use secure authentication, encrypted data storage, and strict access control to protect your personal information.",
  },
  {
    question: "Can I edit or delete my travel plans?",
    answer:
      "Absolutely. You can edit or delete your travel plans anytime from your dashboard.",
  },
  {
    question: "Can I create multiple travel plans?",
    answer:
      "Yes. There is no limit to the number of travel plans you can create, manage, or update.",
  },
  {
    question: "How does matching work?",
    answer:
      "Matching is based on destination, travel dates, budget range, and travel type to help you find compatible travel buddies.",
  },
  {
    question: "What happens if a trip is cancelled?",
    answer:
      "You can update or cancel your travel plan anytime. Connected travelers will be notified about the changes.",
  },
  {
    question: "Do I need to verify my account?",
    answer:
      "Account verification helps build trust in the community. Some features may require a verified account.",
  },
  {
    question: "Can I use Travel Planner on mobile devices?",
    answer:
      "Yes. Travel Planner is fully responsive and works smoothly on mobile phones, tablets, and desktops.",
  },
  {
    question: "How do I contact support?",
    answer:
      "If you need help, you can reach out through the Contact page or email our support team for assistance.",
  },
];


const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number): void => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 md:px-8 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md border border-gray-200 p-6 md:p-10">
        
        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center">
          Frequently Asked <span className="text-primary">Questions</span>
        </h1>

        <p className="text-gray-500 text-center mt-3 max-w-2xl mx-auto">
          Find answers to common questions about using Travel Planner.
        </p>

        {/* FAQ List */}
        <div className="mt-10 space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center px-4 py-3 text-left text-gray-800 font-medium hover:bg-gray-50 transition"
              >
                <span>{faq.question}</span>
                <span className="text-primary text-xl font-bold">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>

              {openIndex === index && (
                <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default FAQPage;
