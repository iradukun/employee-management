import { ApiProperty } from '@nestjs/swagger'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Attendance } from '../../attendance/entities/attendance.entity'
import { Role } from './role.entity'
import { Verification } from './verification.entity'

@Entity('users')
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty()
  @Column()
  firstName: string

  @ApiProperty()
  @Column()
  lastName: string

  @ApiProperty()
  @Column({ unique: true })
  email: string

  @ApiProperty()
  @Column({ unique: true })
  phoneNumber: string

  @ApiProperty()
  @Column({ unique: true, nullable: true })
  employeeIdentifier: string

  @Column()
  password?: string

  @ApiProperty()
  @Column({ default: false })
  isVerified: boolean

  @ApiProperty({ type: () => [Role] })
  @ManyToMany(() => Role, role => role.users, { cascade: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'roleId', referencedColumnName: 'id' },
  })
  roles: Role[]

  @OneToMany(() => Verification, verification => verification.user)
  verifications: Verification[]

  @OneToMany(() => Attendance, attendance => attendance.user)
  attendances: Attendance[]

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date
}
