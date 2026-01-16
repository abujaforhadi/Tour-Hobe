import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const FAQ = () => (
  <section className="py-24 bg-white">
    <div className="container mx-auto px-6 max-w-3xl">
      <h2 className="text-4xl font-black text-center mb-16">Got Questions?</h2>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-lg font-bold">Is it safe for solo female travelers?</AccordionTrigger>
          <AccordionContent className="text-zinc-500 font-medium">Yes. We have a strict verification process and you can choose to join female-only groups or highly-rated verified hosts.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-lg font-bold">How do I verify my account?</AccordionTrigger>
          <AccordionContent className="text-zinc-500 font-medium">You can upload your NID or Passport in your dashboard. Our team reviews submissions within 24 hours.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="text-lg font-bold">Is there a fee for joining trips?</AccordionTrigger>
          <AccordionContent className="text-zinc-500 font-medium">Browsing and joining is free. We only charge for premium badges and featured trip listings.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  </section>
);