export interface ProgramWorkloadCourse {
  workloadHours: number;
  isRequired: boolean;
  alternativeGroup: string | null;
}

export interface ProgramWorkloadRange {
  minimum: number;
  maximum: number;
}

/** Calcula uma faixa real quando o aluno escolhe uma entre várias rotas. */
export function calculateProgramWorkload(
  courses: readonly ProgramWorkloadCourse[],
): ProgramWorkloadRange {
  const requiredHours = courses
    .filter((course) => course.isRequired)
    .reduce((sum, course) => sum + course.workloadHours, 0);
  const alternativeGroups = new Map<string, number[]>();
  let ungroupedOptionalHours = 0;

  for (const course of courses) {
    if (course.isRequired) continue;

    if (!course.alternativeGroup) {
      ungroupedOptionalHours += course.workloadHours;
      continue;
    }

    const workloads = alternativeGroups.get(course.alternativeGroup) ?? [];
    workloads.push(course.workloadHours);
    alternativeGroups.set(course.alternativeGroup, workloads);
  }

  const minimumAlternativeHours = [...alternativeGroups.values()].reduce(
    (sum, workloads) => sum + Math.min(...workloads),
    0,
  );
  const maximumAlternativeHours = [...alternativeGroups.values()].reduce(
    (sum, workloads) => sum + Math.max(...workloads),
    0,
  );

  return {
    minimum: requiredHours + minimumAlternativeHours,
    maximum: requiredHours + maximumAlternativeHours + ungroupedOptionalHours,
  };
}
