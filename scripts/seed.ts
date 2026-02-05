import * as dotenv from 'dotenv'
import * as path from 'path'
import { DataSource } from 'typeorm'
import { Attendance } from '../src/modules/attendance/entities/attendance.entity'
import { Role } from '../src/modules/users/entities/role.entity'
import { User } from '../src/modules/users/entities/user.entity'
import { Verification } from '../src/modules/users/entities/verification.entity'

// Load .env file
dotenv.config({ path: path.join(__dirname, '../.env') })

async function bootstrap () {
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'employee_management',
    entities: [Role, User, Verification, Attendance],
    synchronize: true, // This will create tables if they don't exist
  })

  try {
    console.log('Connecting to database...')
    await dataSource.initialize()
    console.log('Database connected.')

    const roleRepository = dataSource.getRepository(Role)

    const roles = [
      { name: 'ADMIN', description: 'Administrator with full access' },
      { name: 'USER', description: 'Standard employee user' },
    ]

    for (const roleData of roles) {
      const existingRole = await roleRepository.findOne({
        where: { name: roleData.name },
      })
      if (!existingRole) {
        console.log(`Creating role: ${roleData.name}`)
        const role = roleRepository.create(roleData)
        await roleRepository.save(role)
      } else {
        console.log(`Role already exists: ${roleData.name}`)
      }
    }

    console.log('Seeding completed successfully.')
    await dataSource.destroy()
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

bootstrap()
