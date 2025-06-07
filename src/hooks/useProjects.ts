import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { Project, ProjectStatus } from '../types/project';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      // Fetch projects separately
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;

      // Fetch phases separately
      const { data: phasesData, error: phasesError } = await supabase
        .from('phases')
        .select('*');

      if (phasesError) throw phasesError;

      // Group phases by project_id
      const phasesByProject = phasesData.reduce((acc: any, phase: any) => {
        if (!acc[phase.project_id]) {
          acc[phase.project_id] = [];
        }
        acc[phase.project_id].push(phase);
        return acc;
      }, {});

      // Combine projects with their phases
      const formattedProjects = projectsData.map(p => ({
        id: p.id,
        name: p.name,
        client: p.client || undefined,
        description: p.description || undefined,
        eventDate: new Date(p.event_date),
        status: p.status as ProjectStatus,
        createdAt: new Date(p.created_at),
        phases: (phasesByProject[p.id] || []).reduce((acc: any, phase: any) => {
          acc[phase.name] = {
            start: new Date(phase.start_date),
            end: new Date(phase.end_date)
          };
          return acc;
        }, {})
      }));

      setProjects(formattedProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (project: Omit<Project, 'id' | 'createdAt'>): Promise<string> => {
    try {
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .insert({
          name: project.name,
          client: project.client,
          description: project.description,
          event_date: project.eventDate.toISOString(),
          status: project.status
        })
        .select()
        .single();

      if (projectError) throw projectError;

      const phaseInserts = Object.entries(project.phases).map(([name, phase]) => ({
        project_id: projectData.id,
        name,
        start_date: phase.start.toISOString(),
        end_date: phase.end.toISOString(),
        duration: Math.ceil((phase.end.getTime() - phase.start.getTime()) / (1000 * 60 * 60 * 24))
      }));

      const { error: phasesError } = await supabase
        .from('phases')
        .insert(phaseInserts);

      if (phasesError) throw phasesError;

      await loadProjects();
      toast.success('Project created successfully');
      return projectData.id;
    } catch (error) {
      console.error('Error adding project:', error);
      toast.error('Failed to create project');
      throw error;
    }
  };

  const updateProject = async (id: string, updatedProject: Partial<Project>): Promise<boolean> => {
    try {
      const { error: projectError } = await supabase
        .from('projects')
        .update({
          name: updatedProject.name,
          client: updatedProject.client,
          description: updatedProject.description,
          event_date: updatedProject.eventDate?.toISOString(),
          status: updatedProject.status
        })
        .eq('id', id);

      if (projectError) throw projectError;

      if (updatedProject.phases) {
        // Delete existing phases
        await supabase
          .from('phases')
          .delete()
          .eq('project_id', id);

        // Insert new phases
        const phaseInserts = Object.entries(updatedProject.phases).map(([name, phase]) => ({
          project_id: id,
          name,
          start_date: phase.start.toISOString(),
          end_date: phase.end.toISOString(),
          duration: Math.ceil((phase.end.getTime() - phase.start.getTime()) / (1000 * 60 * 60 * 24))
        }));

        const { error: phasesError } = await supabase
          .from('phases')
          .insert(phaseInserts);

        if (phasesError) throw phasesError;
      }

      await loadProjects();
      toast.success('Project updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project');
      return false;
    }
  };

  const deleteProject = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await loadProjects();
      toast.success('Project deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
      return false;
    }
  };

  const getProject = (id: string): Project | undefined => {
    return projects.find(project => project.id === id);
  };

  return {
    projects,
    loading,
    addProject,
    updateProject,
    deleteProject,
    getProject
  };
};