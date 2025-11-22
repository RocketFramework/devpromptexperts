import { ConsultantData } from "@/types";

// lib/sampleData.ts
export type ScenarioType = 
  | 'highPerformer' 
  | 'teamEarningsOnly' 
  | 'growingConsultant' 
  | 'enterpriseFocus'
  | 'startupSpecialist'
  | 'balancedPortfolio';


const generateBaseData = (): Omit<ConsultantData, 'consultant_id'> => {
  const baseValue = Math.random() * 100000 + 50000;
  const monthlyVariation = (base: number) => base * (0.8 + Math.random() * 0.4);
  
  const totalContractValue = baseValue * 12;
  const thisMonthValue = monthlyVariation(baseValue);
  const lastMonthValue = monthlyVariation(baseValue);
  
  const totalProjects = Math.floor(Math.random() * 50) + 20;
  const completedProjects = Math.floor(totalProjects * (0.6 + Math.random() * 0.3));
  
  return {
    total_projects_count: totalProjects,
    total_projects_count_this_month: Math.floor(Math.random() * 8) + 3,
    total_projects_count_last_month: Math.floor(Math.random() * 8) + 3,
    total_contract_value: totalContractValue,
    total_contract_value_this_month: thisMonthValue,
    total_contract_value_last_month: lastMonthValue,
    average_project_contract_value: totalContractValue / totalProjects,
    average_project_contract_value_this_month: thisMonthValue / 6,
    average_project_contract_value_last_month: lastMonthValue / 6,
    completed_projects_count: completedProjects,
    completed_projects_count_this_month: Math.floor(Math.random() * 6) + 2,
    completed_projects_count_last_month: Math.floor(Math.random() * 6) + 2,
    pending_projects_count: Math.floor(Math.random() * 10) + 5,
    active_projects_count: Math.floor(Math.random() * 15) + 8,
    active_projects_this_month: Math.floor(Math.random() * 5) + 3,
    active_projects_next_month: Math.floor(Math.random() * 7) + 4,
    project_success_rate: completedProjects / totalProjects,
    repeating_clients_count: Math.floor(Math.random() * 15) + 8,
    one_time_clients_count: Math.floor(Math.random() * 25) + 10,
    client_retention_rate_percent: 70 + Math.random() * 25,
    avg_project_duration_days: 45 + Math.random() * 60,

    total_leads_count: Math.floor(Math.random() * 100) + 50,
    total_leads_count_this_month: Math.floor(Math.random() * 15) + 8,
    total_leads_count_last_month: Math.floor(Math.random() * 15) + 8,
    total_responses_submitted: Math.floor(Math.random() * 80) + 40,
    responses_submitted_this_month: Math.floor(Math.random() * 12) + 6,
    responses_submitted_last_month: Math.floor(Math.random() * 12) + 6,

    // Earnings will be calculated per scenario
    net_earnings: 0,
    net_earnings_this_month: 0,
    net_earnings_last_month: 0,
    direct_earnings: 0,
    sales_commissions: 0,
    consultant_commissions: 0,
    direct_earnings_platform_commissions: 0,
    direct_earnings_my_earnings: 0,
    direct_earnings_overdue: 0,
    direct_earnings_this_month: 0,
    direct_earnings_overdue_this_month: 0,
    direct_earnings_last_month: 0,
    direct_earnings_overdue_last_month: 0,
    platform_commissions_this_month: 0,
    my_direct_earnings_this_month: 0,
    sales_commissions_this_month: 0,
    sales_commissions_last_month: 0,
    consultant_commissions_this_month: 0,
    consultant_commissions_last_month: 0,
    client_commissions: 0,
    client_commissions_this_month: 0,
    client_commissions_last_month: 0,

    sales_commissions_count: Math.floor(Math.random() * 20) + 5,
    consultant_commissions_count: Math.floor(Math.random() * 15) + 3,
    consultant_commissions_count_last_month: Math.floor(Math.random() * 8) + 2,
    consultant_commissions_count_this_month: Math.floor(Math.random() * 8) + 2,
    client_commissions_count: Math.floor(Math.random() * 25) + 8,
    client_commissions_count_last_month: Math.floor(Math.random() * 10) + 3,
    client_commissions_count_this_month: Math.floor(Math.random() * 10) + 3,
    platform_commissions_count: Math.floor(Math.random() * 30) + 10,
    platform_commissions_count_last_month: Math.floor(Math.random() * 15) + 5,
    platform_commissions_count_this_month: Math.floor(Math.random() * 15) + 5,

    // Industry breakdown - will be adjusted per scenario
    earnings_technology_saas: 0,
    earnings_financial_services: 0,
    earnings_healthcare: 0,
    earnings_ecommerce_retail: 0,
    earnings_manufacturing: 0,
    earnings_energy_utilities: 0,
    earnings_telecommunications: 0,
    earnings_media_entertainment: 0,
    earnings_education: 0,
    earnings_government: 0,
    earnings_startups_vc: 0,
    earnings_consulting_services: 0,
    earnings_other: 0,

    consultants_team_count: Math.floor(Math.random() * 10) + 3,
    consultants_team_count_last_month: Math.floor(Math.random() * 8) + 2,
    consultants_team_count_this_month: Math.floor(Math.random() * 8) + 2,
    sales_team_count: Math.floor(Math.random() * 8) + 2,
    sales_team_count_last_month: Math.floor(Math.random() * 6) + 1,
    sales_team_count_this_month: Math.floor(Math.random() * 6) + 1,
    clients_team_count: Math.floor(Math.random() * 30) + 15,
    clients_team_count_last_month: Math.floor(Math.random() * 25) + 10,
    clients_team_count_this_month: Math.floor(Math.random() * 25) + 10,

    summary_generated_at: new Date().toISOString(),
  };
};

const applyScenario = (baseData: Omit<ConsultantData, 'consultant_id'>, scenario: ScenarioType): Omit<ConsultantData, 'consultant_id'> => {
  const data = { ...baseData };
  const totalValue = data.total_contract_value;

  switch (scenario) {
    case 'highPerformer':
      data.total_contract_value = totalValue * 2.5;
      data.total_contract_value_this_month = data.total_contract_value_this_month * 2;
      data.client_retention_rate_percent = 92;
      data.project_success_rate = 0.94;
      data.consultants_team_count += 8;
      data.sales_team_count += 4;
      
      // High performer earnings mix
      data.direct_earnings = totalValue * 1.8;
      data.consultant_commissions = totalValue * 0.4;
      data.sales_commissions = totalValue * 0.2;
      data.client_commissions = totalValue * 0.1;
      break;

    case 'teamEarningsOnly':
      // Minimal direct earnings, mostly from team
      data.direct_earnings = totalValue * 0.2;
      data.consultant_commissions = totalValue * 0.6;
      data.sales_commissions = totalValue * 0.15;
      data.client_commissions = totalValue * 0.05;
      
      data.consultants_team_count = 25;
      data.consultants_team_count_this_month = 28;
      data.sales_team_count = 12;
      data.consultant_commissions_count = 45;
      break;

    case 'growingConsultant':
      data.total_contract_value_this_month = data.total_contract_value_this_month * 1.8;
      data.total_projects_count_this_month += 5;
      data.active_projects_next_month = data.active_projects_count + 6;
      
      data.direct_earnings = totalValue * 0.9;
      data.consultant_commissions = totalValue * 0.05;
      data.sales_commissions = totalValue * 0.03;
      data.client_commissions = totalValue * 0.02;
      break;

    case 'enterpriseFocus':
      data.average_project_contract_value = 85000;
      data.average_project_contract_value_this_month = 92000;
      data.total_projects_count = 12;
      data.total_projects_count_this_month = 2;
      
      data.earnings_financial_services = totalValue * 0.4;
      data.earnings_healthcare = totalValue * 0.3;
      data.earnings_energy_utilities = totalValue * 0.2;
      break;

    case 'startupSpecialist':
      data.average_project_contract_value = 25000;
      data.total_projects_count = 35;
      data.total_projects_count_this_month = 8;
      
      data.earnings_technology_saas = totalValue * 0.6;
      data.earnings_startups_vc = totalValue * 0.3;
      data.repeating_clients_count = 5; // Startups often one-time
      break;

    case 'balancedPortfolio':
      // Balanced across all metrics - good all-rounder
      data.direct_earnings = totalValue * 0.7;
      data.consultant_commissions = totalValue * 0.15;
      data.sales_commissions = totalValue * 0.1;
      data.client_commissions = totalValue * 0.05;
      
      // Balanced industry mix
      data.earnings_technology_saas = totalValue * 0.2;
      data.earnings_financial_services = totalValue * 0.2;
      data.earnings_healthcare = totalValue * 0.15;
      data.earnings_ecommerce_retail = totalValue * 0.15;
      data.earnings_manufacturing = totalValue * 0.1;
      data.earnings_other = totalValue * 0.2;
      break;
  }

  // Calculate derived fields
  data.direct_earnings_platform_commissions = data.direct_earnings * 0.2;
  data.direct_earnings_my_earnings = data.direct_earnings * 0.8;
  data.direct_earnings_overdue = data.direct_earnings * 0.1;
  
  data.direct_earnings_this_month = data.direct_earnings * 0.1;
  data.direct_earnings_last_month = data.direct_earnings * 0.09;
  data.direct_earnings_overdue_this_month = data.direct_earnings_this_month * 0.1;
  data.direct_earnings_overdue_last_month = data.direct_earnings_last_month * 0.1;
  
  data.sales_commissions_this_month = data.sales_commissions * 0.1;
  data.sales_commissions_last_month = data.sales_commissions * 0.09;
  data.consultant_commissions_this_month = data.consultant_commissions * 0.1;
  data.consultant_commissions_last_month = data.consultant_commissions * 0.09;
  data.client_commissions_this_month = data.client_commissions * 0.1;
  data.client_commissions_last_month = data.client_commissions * 0.09;
  
  data.platform_commissions_this_month = data.direct_earnings_this_month * 0.2;
  data.my_direct_earnings_this_month = data.direct_earnings_this_month * 0.8;
  
  // Net earnings calculation
  data.net_earnings = data.direct_earnings_my_earnings + data.sales_commissions + data.consultant_commissions + data.client_commissions;
  data.net_earnings_this_month = (data.direct_earnings_this_month * 0.8) + data.sales_commissions_this_month + data.consultant_commissions_this_month + data.client_commissions_this_month;
  data.net_earnings_last_month = (data.direct_earnings_last_month * 0.8) + data.sales_commissions_last_month + data.consultant_commissions_last_month + data.client_commissions_last_month;

  return data;
};

export const getSampleData = (scenario: ScenarioType, consultantId: string = 'demo_consultant'): ConsultantData => {
  const baseData = generateBaseData();
  const scenarioData = applyScenario(baseData, scenario);
  
  return {
    consultant_id: consultantId,
    ...scenarioData
  };
};

// Helper to get all scenarios for testing
export const getAllScenarios = (consultantId: string = 'demo_consultant'): Record<ScenarioType, ConsultantData> => {
  const scenarios: ScenarioType[] = [
    'highPerformer', 
    'teamEarningsOnly', 
    'growingConsultant', 
    'enterpriseFocus',
    'startupSpecialist',
    'balancedPortfolio'
  ];
  
  return scenarios.reduce((acc, scenario) => {
    acc[scenario] = getSampleData(scenario, consultantId);
    return acc;
  }, {} as Record<ScenarioType, ConsultantData>);
};