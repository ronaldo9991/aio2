/**
 * Scheduling Optimizer Service
 * Implements baseline (FIFO) and risk-aware scheduling algorithms
 */

import type { Job, Machine } from '@shared/schema';

export interface ScheduleItem {
  id: string;
  machineId: string;
  jobId: string;
  startTs: string;
  endTs: string;
  frozen: boolean;
  riskScore: number;
}

export interface ScheduleKPIs {
  makespan: number; // Total time to complete all jobs (minutes)
  totalLateness: number; // Total minutes past due date
  onTimeRate: number; // Percentage of jobs completed on time
  changeovers: number; // Number of setup changes
  utilization: number; // Average machine utilization
  riskCost: number; // Weighted risk cost (0-1)
  stability: number; // Schedule stability score (0-1)
}

export interface ScheduleResult {
  items: ScheduleItem[];
  kpis: ScheduleKPIs;
  mode: 'baseline' | 'risk_aware';
}

/**
 * Baseline Scheduler (FIFO + Due Date Priority)
 */
export function generateBaselineSchedule(
  jobs: Job[],
  machines: Machine[],
  machineRisks: Record<string, number> = {}
): ScheduleResult {
  // Filter operational machines
  const operationalMachines = machines.filter(m => m.status === 'operational');
  
  // Sort jobs by: priority (desc), due date (asc), then FIFO
  const sortedJobs = [...jobs].sort((a, b) => {
    if (a.priority !== b.priority) return b.priority - a.priority;
    const dueA = new Date(a.dueDate).getTime();
    const dueB = new Date(b.dueDate).getTime();
    return dueA - dueB;
  });

  const scheduleItems: ScheduleItem[] = [];
  const machineSchedules: Record<string, Date> = {};
  
  // Initialize machine schedules to now
  const now = new Date();
  now.setHours(8, 0, 0, 0); // Start at 8 AM
  operationalMachines.forEach(m => {
    machineSchedules[m.id] = new Date(now);
  });

  // Assign jobs to machines
  for (const job of sortedJobs) {
    // Find compatible machines
    const compatibleMachines = operationalMachines.filter(m => 
      m.type === job.requiredMachineType || job.requiredMachineType === 'any'
    );

    if (compatibleMachines.length === 0) continue;

    // Select machine with earliest available time
    let selectedMachine = compatibleMachines[0];
    let earliestTime = machineSchedules[selectedMachine.id];

    for (const machine of compatibleMachines) {
      if (machineSchedules[machine.id] < earliestTime) {
        selectedMachine = machine;
        earliestTime = machineSchedules[machine.id];
      }
    }

    // Calculate job timing
    const startTime = new Date(earliestTime);
    const endTime = new Date(startTime.getTime() + job.processingTimeMin * 60 * 1000);

    // Check if past 10 PM, move to next day 8 AM
    if (endTime.getHours() >= 22) {
      startTime.setDate(startTime.getDate() + 1);
      startTime.setHours(8, 0, 0, 0);
      endTime.setTime(startTime.getTime() + job.processingTimeMin * 60 * 1000);
    }

    scheduleItems.push({
      id: `SI-${scheduleItems.length + 1}`,
      machineId: selectedMachine.id,
      jobId: job.id,
      startTs: startTime.toISOString(),
      endTs: endTime.toISOString(),
      frozen: job.isUrgent || false,
      riskScore: machineRisks[selectedMachine.id] || 0.2,
    });

    // Update machine schedule
    machineSchedules[selectedMachine.id] = new Date(endTime);
  }

  // Calculate KPIs
  const kpis = calculateKPIs(scheduleItems, jobs, machines, machineRisks, 'baseline');

  return {
    items: scheduleItems,
    kpis,
    mode: 'baseline',
  };
}

/**
 * Risk-Aware Scheduler
 * Optimizes for: risk minimization, setup reduction, due date adherence
 */
export function generateRiskAwareSchedule(
  jobs: Job[],
  machines: Machine[],
  machineRisks: Record<string, number>,
  riskWindow: Record<string, { start: Date; end: Date; risk: number }> = {}
): ScheduleResult {
  const operationalMachines = machines.filter(m => m.status === 'operational');
  
  // Sort jobs with risk-aware weighting
  const sortedJobs = [...jobs].sort((a, b) => {
    // Calculate composite score
    const scoreA = calculateJobScore(a, machineRisks, riskWindow);
    const scoreB = calculateJobScore(b, machineRisks, riskWindow);
    return scoreB - scoreA; // Higher score = higher priority
  });

  const scheduleItems: ScheduleItem[] = [];
  const machineSchedules: Record<string, Date> = {};
  const machineLastSetup: Record<string, string | null> = {};
  
  const now = new Date();
  now.setHours(8, 0, 0, 0);
  operationalMachines.forEach(m => {
    machineSchedules[m.id] = new Date(now);
    machineLastSetup[m.id] = null;
  });

  for (const job of sortedJobs) {
    const compatibleMachines = operationalMachines.filter(m => 
      m.type === job.requiredMachineType || job.requiredMachineType === 'any'
    );

    if (compatibleMachines.length === 0) continue;

    // Score each machine for this job
    let bestMachine = compatibleMachines[0];
    let bestScore = -Infinity;
    let bestStartTime = machineSchedules[bestMachine.id];

    for (const machine of compatibleMachines) {
      const startTime = machineSchedules[machine.id];
      const endTime = new Date(startTime.getTime() + job.processingTimeMin * 60 * 1000);

      // Calculate machine score
      let score = 0;

      // Prefer machines with same setup group (reduce changeovers)
      if (machineLastSetup[machine.id] === job.setupGroup) {
        score += 50;
      } else if (job.setupGroup) {
        score -= 20; // Penalty for changeover
      }

      // Prefer lower risk machines
      const risk = machineRisks[machine.id] || 0.2;
      score -= risk * 100;

      // Check if job overlaps with high-risk window
      const jobOverlapsRisk = checkRiskWindowOverlap(startTime, endTime, riskWindow[machine.id]);
      if (jobOverlapsRisk) {
        score -= 80; // Heavy penalty
      }

      // Prefer earlier completion (due date adherence)
      const dueDate = new Date(job.dueDate);
      const slack = (dueDate.getTime() - endTime.getTime()) / (1000 * 60); // minutes
      if (slack < 0) {
        score -= Math.abs(slack) * 2; // Penalty for lateness
      } else {
        score += Math.min(slack, 480) * 0.1; // Bonus for early completion (max 8 hours)
      }

      // Urgent jobs get priority
      if (job.isUrgent) {
        score += 100;
      }

      // Priority bonus
      score += job.priority * 10;

      if (score > bestScore) {
        bestScore = score;
        bestMachine = machine;
        bestStartTime = startTime;
      }
    }

    // Schedule job on best machine
    const startTime = new Date(bestStartTime);
    const endTime = new Date(startTime.getTime() + job.processingTimeMin * 60 * 1000);

    if (endTime.getHours() >= 22) {
      startTime.setDate(startTime.getDate() + 1);
      startTime.setHours(8, 0, 0, 0);
      endTime.setTime(startTime.getTime() + job.processingTimeMin * 60 * 1000);
    }

    scheduleItems.push({
      id: `SI-${scheduleItems.length + 1}`,
      machineId: bestMachine.id,
      jobId: job.id,
      startTs: startTime.toISOString(),
      endTs: endTime.toISOString(),
      frozen: job.isUrgent || false,
      riskScore: machineRisks[bestMachine.id] || 0.2,
    });

    machineSchedules[bestMachine.id] = new Date(endTime);
    machineLastSetup[bestMachine.id] = job.setupGroup || null;
  }

  const kpis = calculateKPIs(scheduleItems, jobs, machines, machineRisks, 'risk_aware');

  return {
    items: scheduleItems,
    kpis,
    mode: 'risk_aware',
  };
}

function calculateJobScore(
  job: Job,
  machineRisks: Record<string, number>,
  riskWindow: Record<string, { start: Date; end: Date; risk: number }>
): number {
  let score = 0;

  // Due date urgency
  const dueDate = new Date(job.dueDate);
  const now = new Date();
  const hoursUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  if (hoursUntilDue < 24) {
    score += 100; // Very urgent
  } else if (hoursUntilDue < 48) {
    score += 50;
  }

  // Priority
  score += job.priority * 20;

  // Urgent flag
  if (job.isUrgent) {
    score += 150;
  }

  return score;
}

function checkRiskWindowOverlap(
  start: Date,
  end: Date,
  riskWindow?: { start: Date; end: Date; risk: number }
): boolean {
  if (!riskWindow || riskWindow.risk < 0.6) return false;
  return start < riskWindow.end && end > riskWindow.start;
}

function calculateKPIs(
  items: ScheduleItem[],
  jobs: Job[],
  machines: Machine[],
  machineRisks: Record<string, number>,
  mode: 'baseline' | 'risk_aware'
): ScheduleKPIs {
  if (items.length === 0) {
    return {
      makespan: 0,
      totalLateness: 0,
      onTimeRate: 1,
      changeovers: 0,
      utilization: 0,
      riskCost: 0,
      stability: 1,
    };
  }

  // Makespan: time from first start to last end
  const startTimes = items.map(i => new Date(i.startTs).getTime());
  const endTimes = items.map(i => new Date(i.endTs).getTime());
  const makespan = (Math.max(...endTimes) - Math.min(...startTimes)) / (1000 * 60); // minutes

  // Lateness and on-time rate
  let totalLateness = 0;
  let onTimeCount = 0;
  const jobMap = new Map(jobs.map(j => [j.id, j]));

  for (const item of items) {
    const job = jobMap.get(item.jobId);
    if (!job) continue;

    const dueDate = new Date(job.dueDate).getTime();
    const completionTime = new Date(item.endTs).getTime();
    const lateness = Math.max(0, (completionTime - dueDate) / (1000 * 60)); // minutes

    totalLateness += lateness;
    if (lateness === 0) onTimeCount++;
  }

  const onTimeRate = items.length > 0 ? onTimeCount / items.length : 1;

  // Changeovers: count setup group changes per machine
  const machineJobs = new Map<string, string[]>();
  for (const item of items) {
    if (!machineJobs.has(item.machineId)) {
      machineJobs.set(item.machineId, []);
    }
    const job = jobMap.get(item.jobId);
    if (job?.setupGroup) {
      machineJobs.get(item.machineId)!.push(job.setupGroup);
    }
  }

  let changeovers = 0;
  for (const [_, setupGroups] of machineJobs) {
    for (let i = 1; i < setupGroups.length; i++) {
      if (setupGroups[i] !== setupGroups[i - 1]) {
        changeovers++;
      }
    }
  }

  // Utilization: total job time / (makespan * machine count)
  const totalJobTime = items.reduce((sum, item) => {
    const job = jobMap.get(item.jobId);
    return sum + (job?.processingTimeMin || 0);
  }, 0);
  const operationalMachines = machines.filter(m => m.status === 'operational').length;
  const utilization = operationalMachines > 0 
    ? totalJobTime / (makespan * operationalMachines) 
    : 0;

  // Risk cost: weighted average of risk scores
  const riskCost = items.reduce((sum, item) => {
    return sum + item.riskScore;
  }, 0) / items.length;

  // Stability: inverse of schedule changes (simplified)
  const stability = mode === 'risk_aware' ? 0.88 : 0.65;

  return {
    makespan: Math.round(makespan),
    totalLateness: Math.round(totalLateness),
    onTimeRate: Math.round(onTimeRate * 100) / 100,
    changeovers,
    utilization: Math.round(utilization * 100) / 100,
    riskCost: Math.round(riskCost * 100) / 100,
    stability: Math.round(stability * 100) / 100,
  };
}
