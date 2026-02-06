import { ApiProperty } from '@nestjs/swagger'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'

@Entity('attendances')
export class Attendance {
  @ApiProperty({
    description: 'The unique identifier of the attendance record',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({ description: 'The user ID associated with this record' })
  @Column()
  userId: string

  @ManyToOne(() => User, user => user.attendances, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User

  @ApiProperty({ description: 'The time the user clocked in' })
  @Column()
  entryTime: Date

  @ApiProperty({
    description: 'The time the user clocked out',
    required: false,
    nullable: true,
  })
  @Column({ nullable: true })
  exitTime: Date

  @ApiProperty({ description: 'The date when the record was created' })
  @CreateDateColumn()
  createdAt: Date

  @ApiProperty({ description: 'The date when the record was last updated' })
  @UpdateDateColumn()
  updatedAt: Date
}
