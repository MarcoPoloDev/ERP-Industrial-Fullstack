import { ProjectService } from "@/lib/services/projectService";
import ProjectsDirectoryView from "@/components/projects/ProjectsDirectoryView";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const proyectos = await ProjectService.getAllProjects();

  return <ProjectsDirectoryView initialProjects={proyectos} />;
}