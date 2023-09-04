import { Blog } from '../blogs/entities/blog.entity';
import { Experience } from '../experience/entities/experience.entity';
import { Project } from '../projects/entities/project.entity';
import { Skill } from '../skills/entities/skill.entity';
import { Tag } from '../tags/entities/tag.entity';
import { WorkSchedule } from '../work-schedule/entities/work-schedule.entity';

export const entities = [Skill, Project, Blog, Tag, Experience, WorkSchedule  ];
