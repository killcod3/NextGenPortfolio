import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SectionContainerProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function SectionContainer({ id, children, className }: SectionContainerProps) {
  return (
    <motion.section
      id={id}
      className={cn("overflow-x-clip py-16 md:py-24", className)}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="container mx-auto px-4">
        {children}
      </div>
    </motion.section>
  );
}
