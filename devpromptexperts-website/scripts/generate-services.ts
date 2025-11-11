// scripts/generate-services.ts
import fs from 'fs'
import path from 'path'
import { supabase } from '@/lib/supabase'

// Define common joins for each table (you can customize this)
const TABLE_JOINS: Record<string, string[]> = {
  users: ['consultants'],
  consultants: ['users', 'consultants_with_ob_partners'],
  clients: ['users'],
  // Add more tables and their joins as needed
}

// Service template with join methods
const generateService = (tableName: string, pascalCase: string, joins: string[] = []) => `
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type ${pascalCase} = Database['public']['Tables']['${tableName}']['Row']
export type ${pascalCase}Insert = Database['public']['Tables']['${tableName}']['Insert']
export type ${pascalCase}Update = Database['public']['Tables']['${tableName}']['Update']

export class ${pascalCase}Service {
  static async findAll() {
    const { data, error } = await supabase
      .from('${tableName}')
      .select('*')
    
    if (error) throw error
    return data
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from('${tableName}')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async create(data: ${pascalCase}Insert) {
    const { data: result, error } = await supabase
      .from('${tableName}')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: string, data: ${pascalCase}Update) {
    const { data: result, error } = await supabase
      .from('${tableName}')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async upsert(data: ${pascalCase}Insert) {
    const { data: result, error } = await supabase
      .from('${tableName}')
      .upsert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('${tableName}')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  ${joins.map(joinTable => {
    const joinPascalCase = joinTable.replace(/(^\w|_\w)/g, (match) => 
      match.replace(/_/, '').toUpperCase()
    )
    
    // Determine if it's a one-to-one or one-to-many relationship
    const isOneToOne = tableName === 'users' && (joinTable === 'consultants' || joinTable === 'clients')
    
    if (isOneToOne) {
      return `
  // One-to-one relationship with ${joinTable}
  static async findWith${joinPascalCase}(id: string) {
    const { data, error } = await supabase
      .from('${tableName}')
      .select(\`
        *,
        ${joinTable} (*)
      \`)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async findAllWith${joinPascalCase}() {
    const { data, error } = await supabase
      .from('${tableName}')
      .select(\`
        *,
        ${joinTable} (*)
      \`)
    
    if (error) throw error
    return data
  }`
    } else {
      return `
  // One-to-many relationship with ${joinTable}
  static async findWith${joinPascalCase}(id: string) {
    const { data, error } = await supabase
      .from('${tableName}')
      .select(\`
        *,
        ${joinTable} (*)
      \`)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async findAllWith${joinPascalCase}() {
    const { data, error } = await supabase
      .from('${tableName}')
      .select(\`
        *,
        ${joinTable} (*)
      \`)
    
    if (error) throw error
    return data
  }`
    }
  }).join('\n\n')}

  // Custom join methods for complex queries
  ${generateCustomJoinMethods(tableName, joins)}
}

${generateTypeDefinitions(tableName, pascalCase, joins)}
`

// Generate custom join methods for complex queries
function generateCustomJoinMethods(tableName: string, joins: string[]): string {
  if (tableName === 'consultants') {
    return `
  // Get consultant with consultants_with_ob_partners details 
  static async findFullProfile(id: string) {
    const { data, error } = await supabase
      .from('${tableName}')
      .select(\`
        *,
        users (*),
        consultants_with_ob_partners (*)
      \`)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  // Get all consultants with consultants_with_ob_partners details
  static async findAllWithConsultants_with_ob_partners() {
    const { data, error } = await supabase
      .from('${tableName}')
      .select(\`
        *,
        users (*),
        consultants_with_ob_partners (*)
      \`)
    
    if (error) throw error
    return data
  }`
  }

  if (tableName === 'users') {
    return `
  // Get user with role-specific data
  static async findWithRoleData(id: string) {
    const { data, error } = await supabase
      .from('${tableName}')
      .select(\`
        *,
        consultants (*),
        clients (*)
      \`)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }`
  }

  return ''
}

// Generate type definitions for joined results
function generateTypeDefinitions(tableName: string, pascalCase: string, joins: string[]): string {
  if (joins.length === 0) return ''

  const joinTypeDefinitions = joins.map(joinTable => {
    const joinPascalCase = joinTable.replace(/(^\w|_\w)/g, (match) => 
      match.replace(/_/, '').toUpperCase()
    )
    
    const isOneToOne = tableName === 'users' && (joinTable === 'consultants' || joinTable === 'clients')
    
    if (isOneToOne) {
      return `export type ${pascalCase}With${joinPascalCase} = ${pascalCase} & {
  ${joinTable}: Database['public']['Tables']['${joinTable}']['Row'] | null
}`
    } else {
      return `export type ${pascalCase}With${joinPascalCase} = ${pascalCase} & {
  ${joinTable}: Database['public']['Tables']['${joinTable}']['Row'][]
}`
    }
  }).join('\n')

  // Generate comprehensive type for complex joins
  if (tableName === 'consultants') {
    return `${joinTypeDefinitions}

// Comprehensive consultant profile type
export type ConsultantsFullProfile = Consultants & {
  users?: Database['public']['Tables']['users']['Row'] | null
  consultants_with_ob_partners?: Database['public']['Tables']['consultants_with_ob_partners']['Row'] | null
}`
  }

  if (tableName === 'users') {
    return `${joinTypeDefinitions}

// User with all role data
export type UserWithRoleData = Users & {
  consultants?: Database['public']['Tables']['consultants']['Row'] | null
  clients?: Database['public']['Tables']['clients']['Row'] | null
  provider_accounts?: Database['public']['Tables']['provider_accounts']['Row'][]
}`
  }

  return joinTypeDefinitions
}

async function getAllTables(): Promise<string[]> {
  try {
    // Method 1: Query information_schema (more reliable)
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_type', 'BASE TABLE')

    if (error) {
      console.warn('Could not fetch tables from information_schema, using fallback:', error.message)
      return getTablesFromFallback()
    }

    return data.map(row => row.table_name).filter(table => 
      !table.startsWith('_') && table !== 'information_schema'
    )
  } catch (error) {
    console.warn('Error fetching tables, using fallback:', error)
    return getTablesFromFallback()
  }
}

function getTablesFromFallback(): string[] {
  // Fallback to manual list if auto-detection fails
  return [
    'ambassador_clients',
    'ambassador_consultants',
    'auth_audit',
    'clients',
    'commission_payouts',
    'consultant_availability',
    'consultant_referrals',
    'consultants',
    'consultants_with_ob_partners',
    'consultations',
    'consulting_ambassadors',
    'interview_slots',
    'ob_partners',
    'payments',
    'provider_accounts',
    'referral_commissions',
    'sales_ambassadors',
    'users',
    // Add any other tables you have
  ]
}

async function main() {
  console.log('🔍 Detecting tables from Supabase...')
  
  const tables = await getAllTables()
  console.log(`📊 Found ${tables.length} tables:`, tables)

  // Generate services directory
  const servicesDir = path.join(process.cwd(), 'src/services/generated')
  if (!fs.existsSync(servicesDir)) {
    fs.mkdirSync(servicesDir, { recursive: true })
  }

  // Generate service for each table
  tables.forEach((tableName) => {
    const pascalCase = tableName.replace(/(^\w|_\w)/g, (match) => 
      match.replace(/_/, '').toUpperCase()
    )
    
    const joins = TABLE_JOINS[tableName] || []
    const serviceContent = generateService(tableName, pascalCase, joins)
    const filePath = path.join(servicesDir, `${pascalCase}Service.ts`)
    fs.writeFileSync(filePath, serviceContent)
    console.log(`✅ Generated ${pascalCase}Service.ts with ${joins.length} join methods`)
  })

  // Generate index file
  const indexContent = tables.map((tableName) => {
    const pascalCase = tableName.replace(/(^\w|_\w)/g, (match) => 
      match.replace(/_/, '').toUpperCase()
    )
    return `export * from './${pascalCase}Service'`
  }).join('\n')

  fs.writeFileSync(path.join(servicesDir, 'index.ts'), indexContent)
  console.log('✅ Generated index.ts')
  console.log(`🎉 Successfully generated ${tables.length} service classes with join methods!`)
}

// Run the script
main().catch(console.error)