"use client";

import { SectionContainer } from "@/components/section-container";
import { SectionHeading } from "@/components/section-heading";
import { getWorkExperiences, getEducationExperiences } from "@/lib/config";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BriefcaseIcon, GraduationCap } from "lucide-react";
import { Experience } from "@/config/types";

export function ExperienceSection() {
  const workExperiences = getWorkExperiences();
  const educationExperiences = getEducationExperiences();

  return (
    <SectionContainer id="experience">
      <SectionHeading 
        title="Experience & Education" 
        subtitle="My professional journey and educational background"
      />

      <Tabs defaultValue="work" className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="flex justify-center mb-8"
        >
          <TabsList className="grid grid-cols-2 w-[300px]">
            <TabsTrigger value="work" className="flex items-center gap-2">
              <BriefcaseIcon className="h-4 w-4" /> Work
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" /> Education
            </TabsTrigger>
          </TabsList>
        </motion.div>

        <TabsContent value="work">
          <div className="space-y-6">
            {workExperiences.map((experience, index) => (
              <ExperienceItem 
                key={experience.id} 
                experience={experience} 
                index={index} 
                total={workExperiences.length}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="education">
          <div className="space-y-6">
            {educationExperiences.map((experience, index) => (
              <ExperienceItem 
                key={experience.id} 
                experience={experience} 
                index={index} 
                total={educationExperiences.length}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </SectionContainer>
  );
}

interface ExperienceItemProps {
  experience: Experience;
  index: number;
  total: number;
}

function ExperienceItem({ experience, index, total }: ExperienceItemProps) {
  return (
    <div className="relative">
      {/* Timeline connector */}
      {index < total - 1 && (
        <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-border"></div>
      )}
      
      <motion.div
        className="relative"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <Card className="ml-12 transition-all hover:shadow-md">
          <CardHeader>
            <div className="absolute left-0 top-6 h-12 w-12 rounded-full bg-primary flex items-center justify-center">
              {experience.type === 'work' ? (
                <BriefcaseIcon className="h-6 w-6 text-primary-foreground" />
              ) : (
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              )}
            </div>
            <CardTitle>{experience.position}</CardTitle>
            <CardDescription>
              {experience.company} | {experience.duration}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{experience.description}</p>
            <div className="flex flex-wrap gap-2">
              {experience.technologies.map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
