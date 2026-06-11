import { ProjectService } from "@/lib/services/projectService";
import { StaffService } from "@/lib/services/staffService";
import { notFound } from "next/navigation";
import ProjectDetailView from "@/components/projects/ProjectDetailView";

export const dynamic = "force-dynamic";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [proyecto, tecnicos] = await Promise.all([
    ProjectService.getProjectById(id),
    StaffService.getAllStaff()
  ]);

  if (!proyecto) {
    return notFound();
  }

  return <ProjectDetailView proyecto={proyecto} tecnicos={tecnicos} />;
}