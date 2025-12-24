"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, ShieldCheck, Zap, Users, MessageCircle } from "lucide-react";

type FAQItem = {
  question: string;
  answer: string;
  icon?: React.ReactNode;
};

const faqs: FAQItem[] = [
  {
    question: "What is Tour Hobe?",
    answer:
      "Tour Hobe is Bangladesh's dedicated social travel network. We help explorers connect with verified travel partners, split costs, and plan safer, more organized group adventures across the country.",
    icon: <Zap className="w-4 h-4 text-primary" />,
  },
  {
    question: "Is the platform free to use?",
    answer:
      "Exploring public travel plans and connecting with others is free! We believe in building a strong community. Some advanced security features and premium trip management tools may require a subscription in the future.",
  },
  {
    question: "How do I find a compatible travel buddy?",
    answer:
      "Simply post your trip details (destination, dates, budget) or browse existing plans. You can view traveler profiles, see their verification status, and check their trip history to find your perfect match.",
    icon: <Users className="w-4 h-4 text-primary" />,
  },
  {
    question: "Why should I verify my account?",
    answer:
      "Trust is our priority. Verifying your account via NID builds credibility in the community, making it easier for others to trust you as a travel partner. Verified users also get a 'Blue Badge' on their profiles.",
    icon: <ShieldCheck className="w-4 h-4 text-primary" />,
  },
  {
    question: "How do I join someone else's trip?",
    answer:
      "Browse the 'Explore' feed, find a trip you like, and send a 'Join Request.' The trip host can then review your profile and accept your request to start chatting about the details.",
  },
  {
    question: "Is my personal information safe?",
    answer:
      "Absolutely. We use industry-standard encryption to protect your data. Your contact details are never shared publicly—communication happens securely within our platform until you choose to share your info.",
  },
  {
    question: "Can I manage multiple trips at once?",
    answer:
      "Yes! Whether you're planning a weekend in Sajek and a week-long trek in Bandarban, your dashboard allows you to manage multiple itineraries effortlessly.",
  },
  {
    question: "What happens if I need to cancel my plan?",
    answer:
      "Life happens! You can update or cancel your plan through your dashboard. We recommend notifying your connected buddies as early as possible so they can adjust their plans too.",
  },
];

const FAQPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-50/50 py-16 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center space-y-4">
          <Badge variant="outline" className="px-4 py-1.5 rounded-full border-primary/30 bg-primary/5 text-primary font-bold tracking-wider">
            HELP CENTER
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-zinc-900 leading-tight">
            Common <span className="text-primary italic underline decoration-zinc-200 underline-offset-8">Questions</span>
          </h1>
          <p className="text-lg text-zinc-500 max-w-xl font-medium leading-relaxed">
            Everything you need to know about finding your next travel tribe and exploring Bangladesh safely.
          </p>
        </div>

        {/* FAQ Accordion Card */}
        <Card className="border-none shadow-2xl shadow-zinc-200/50 rounded-xl overflow-hidden bg-white">
          <CardHeader className="bg-zinc-900 text-white p-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <HelpCircle className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-xl font-bold">Frequently Asked Questions</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 ">
            <Accordion type="single" collapsible className="w-full space-y-2">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border border-zinc-100 rounded-2xl px-4 py-1 data-[state=open]:bg-zinc-50/50 data-[state=open]:border-primary/20 transition-all"
                >
                  <AccordionTrigger className="hover:no-underline font-bold text-zinc-800 text-left py-4">
                    <div className="flex items-center gap-3">
                      {faq.icon}
                      {faq.question}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-600 font-medium leading-relaxed pb-6 pl-7">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Footer Support CTA */}
        <div className="text-center space-y-6 pt-4">
          <div className="flex flex-col items-center justify-center space-y-2">
            <p className="text-zinc-400 font-bold text-xs uppercase tracking-[0.2em]">Still have questions?</p>
            <h3 className="text-2xl font-black text-zinc-900">We&apos;re here to help!</h3>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <button className="flex items-center gap-2 px-8 h-14 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all">
               <MessageCircle className="w-5 h-5" />
               Contact Support
             </button>
             <p className="text-sm text-zinc-400 font-medium">Or email us at support@tourhobe.com</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FAQPage;