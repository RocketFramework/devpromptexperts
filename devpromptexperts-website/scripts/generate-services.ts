// scripts/generate-services.ts
import fs from 'fs'
import path from 'path'

// Service template
const generateService = (tableName: string, pascalCase: string) => `
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
}
`

// Manually define your tables instead of dynamic import
const tables = [
  'users',
  'consultants', 
  'clients',
  'provider_accounts'
  // Add any other tables you have
]

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
  
  const serviceContent = generateService(tableName, pascalCase)
  const filePath = path.join(servicesDir, `${pascalCase}Service.ts`)
  fs.writeFileSync(filePath, serviceContent)
  console.log(`✅ Generated ${pascalCase}Service.ts`)
})

// Generate index file
const indexContent = tables.map((tableName) => {
  const pascalCase = tableName.replace(/(^\w|_\w)/g, (match) => 
    match.replace(/_/, '').toUpperCase()
  )
  return `export { ${pascalCase}Service } from './${pascalCase}Service'`
}).join('\n')

fs.writeFileSync(path.join(servicesDir, 'index.ts'), indexContent)
console.log('✅ Generated index.ts')
console.log(`🎉 Successfully generated ${tables.length} service classes!`)